import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const LOW_ATTENDANCE = 75;

// Attendance dates are stored as "YYYY-MM-DD", so plain string comparison is a correct date comparison.
export const toISODate = (d) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const rangeLabel = (start, end) => {
  if (!start && !end) return "All records";
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  return start ? `From ${formatDate(start)}` : `Until ${formatDate(end)}`;
};

const pct = (num, den) => (den > 0 ? Math.round((num / den) * 100) : 0);

/**
 * Turn the raw API response into everything the UI and exports need,
 * restricted to [start, end] (either bound optional).
 */
export const buildReport = (data, start, end) => {
  const inRange = (date) => (!start || date >= start) && (!end || date <= end);

  const students = (data?.students || []).map((s) => {
    const attendance = (s.attendance || []).filter((a) => inRange(a.date));
    const present = attendance.filter((a) => a.status === 1).length;
    const absent = attendance.length - present;
    return {
      studentId: s.studentId,
      name: s.name || "Unknown student",
      email: s.email || "",
      rollNo: s.rollNo || "",
      attendance,
      byDate: Object.fromEntries(attendance.map((a) => [a.date, a.status])),
      present,
      absent,
      total: attendance.length,
      percentage: pct(present, attendance.length),
    };
  });

  // Collect dates across *all* students — a single student may have missed a session record.
  const dates = [...new Set(students.flatMap((s) => s.attendance.map((a) => a.date)))].sort();

  const daily = dates.map((date) => {
    let present = 0;
    let absent = 0;
    students.forEach((s) => {
      if (s.byDate[date] === undefined) return;
      if (s.byDate[date] === 1) present++;
      else absent++;
    });
    return { date, present, absent, marked: present + absent, percentage: pct(present, present + absent) };
  });

  const totalPresent = students.reduce((n, s) => n + s.present, 0);
  const totalMarked = students.reduce((n, s) => n + s.total, 0);
  const tracked = students.filter((s) => s.total > 0);

  return {
    students,
    dates,
    daily,
    summary: {
      totalStudents: students.length,
      sessions: dates.length,
      totalPresent,
      totalAbsent: totalMarked - totalPresent,
      average: pct(totalPresent, totalMarked),
      lowCount: tracked.filter((s) => s.percentage < LOW_ATTENDANCE).length,
      perfectCount: tracked.filter((s) => s.percentage === 100).length,
    },
  };
};

const safeName = (s) => String(s || "class").replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "");

export const reportFileName = (cls, start, end, ext) => {
  const range = start || end ? `${start || "start"}_to_${end || "today"}` : "all";
  return `${safeName(cls.className)}_${safeName(cls.classCode)}_attendance_${range}.${ext}`;
};

const classDetailRows = (cls, report, start, end, institutionName) => [
  ...(institutionName ? [["Institution", institutionName]] : []),
  ["Class name", cls.className || "—"],
  ["Class code", cls.classCode || "—"],
  ["Teacher", cls.teacherName || "—"],
  ["Room", cls.roomNo || "—"],
  ["Schedule", cls.startTime && cls.endTime ? `${cls.startTime} – ${cls.endTime}` : "—"],
  ["Class days", cls.classDays?.length ? cls.classDays.join(", ") : "—"],
  ["Period", rangeLabel(start, end)],
  ["Sessions held", report.summary.sessions],
  ["Students", report.summary.totalStudents],
  ["Average attendance", `${report.summary.average}%`],
  [`Students below ${LOW_ATTENDANCE}%`, report.summary.lowCount],
  ["Generated on", new Date().toLocaleString("en-GB")],
];

const BRAND = [10, 128, 245];

export const exportPDF = (cls, report, start, end, institutionName) => {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title band
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, pageWidth, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(`Attendance Report — ${cls.className || cls.classCode}`, 14, 12);
  doc.setFontSize(10);
  doc.text(
    [institutionName, `Code ${cls.classCode}`, rangeLabel(start, end)].filter(Boolean).join("   •   "),
    14,
    20
  );
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: 34,
    head: [["Detail", "Value"]],
    body: classDetailRows(cls, report, start, end, institutionName),
    theme: "grid",
    headStyles: { fillColor: BRAND },
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 55, fontStyle: "bold" } },
    tableWidth: 150,
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["#", "Student", "Roll no", "Email", "Present", "Absent", "Sessions", "Attendance"]],
    body: report.students.map((s, i) => [
      i + 1,
      s.name,
      s.rollNo || "—",
      s.email || "—",
      s.present,
      s.absent,
      s.total,
      s.total ? `${s.percentage}%` : "—",
    ]),
    theme: "striped",
    headStyles: { fillColor: BRAND },
    styles: { fontSize: 9 },
    didParseCell: (d) => {
      if (d.section !== "body" || d.column.index !== 7) return;
      const s = report.students[d.row.index];
      if (!s?.total) return;
      d.cell.styles.fontStyle = "bold";
      d.cell.styles.textColor = s.percentage >= LOW_ATTENDANCE ? [22, 163, 74] : s.percentage >= 50 ? [202, 138, 4] : [220, 38, 38];
    },
  });

  if (report.daily.length) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Session-wise summary", 14, 18);
    autoTable(doc, {
      startY: 24,
      head: [["#", "Date", "Present", "Absent", "Marked", "Attendance"]],
      body: report.daily.map((d, i) => [i + 1, formatDate(d.date), d.present, d.absent, d.marked, `${d.percentage}%`]),
      theme: "striped",
      headStyles: { fillColor: BRAND },
      styles: { fontSize: 9 },
    });
  }

  // Footer with page numbers
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(`Generated by Present Me • Page ${p} of ${pages}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 8, {
      align: "right",
    });
  }

  doc.save(reportFileName(cls, start, end, "pdf"));
};

export const exportExcel = (cls, report, start, end, institutionName) => {
  const wb = XLSX.utils.book_new();

  const details = XLSX.utils.aoa_to_sheet([["Attendance Report", ""], ...classDetailRows(cls, report, start, end, institutionName)]);
  details["!cols"] = [{ wch: 24 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, details, "Summary");

  const students = XLSX.utils.json_to_sheet(
    report.students.map((s, i) => ({
      "#": i + 1,
      Student: s.name,
      "Roll no": s.rollNo,
      Email: s.email,
      Present: s.present,
      Absent: s.absent,
      Sessions: s.total,
      "Attendance %": s.total ? s.percentage : "",
      Status: !s.total ? "No records" : s.percentage >= LOW_ATTENDANCE ? "OK" : "Below threshold",
    }))
  );
  students["!cols"] = [{ wch: 5 }, { wch: 26 }, { wch: 12 }, { wch: 30 }, { wch: 9 }, { wch: 9 }, { wch: 9 }, { wch: 13 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, students, "Students");

  // Register: one row per student, one column per session, P / A marks
  const register = XLSX.utils.aoa_to_sheet([
    ["Student", "Roll no", ...report.dates.map(formatDate), "Present", "%"],
    ...report.students.map((s) => [
      s.name,
      s.rollNo,
      ...report.dates.map((d) => (s.byDate[d] === undefined ? "" : s.byDate[d] === 1 ? "P" : "A")),
      s.present,
      s.total ? s.percentage : "",
    ]),
  ]);
  register["!cols"] = [{ wch: 26 }, { wch: 12 }, ...report.dates.map(() => ({ wch: 12 })), { wch: 9 }, { wch: 6 }];
  XLSX.utils.book_append_sheet(wb, register, "Register");

  const daily = XLSX.utils.json_to_sheet(
    report.daily.map((d, i) => ({
      "#": i + 1,
      Date: d.date,
      Present: d.present,
      Absent: d.absent,
      Marked: d.marked,
      "Attendance %": d.percentage,
    }))
  );
  daily["!cols"] = [{ wch: 5 }, { wch: 12 }, { wch: 9 }, { wch: 9 }, { wch: 9 }, { wch: 13 }];
  XLSX.utils.book_append_sheet(wb, daily, "Sessions");

  XLSX.writeFile(wb, reportFileName(cls, start, end, "xlsx"));
};

export const exportCSV = (cls, report, start, end) => {
  const ws = XLSX.utils.aoa_to_sheet([
    ["Student", "Roll no", "Email", "Present", "Absent", "Sessions", "Attendance %"],
    ...report.students.map((s) => [s.name, s.rollNo, s.email, s.present, s.absent, s.total, s.total ? s.percentage : ""]),
  ]);
  const blob = new Blob(["﻿" + XLSX.utils.sheet_to_csv(ws)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = reportFileName(cls, start, end, "csv");
  a.click();
  URL.revokeObjectURL(url);
};

export const exportClassList = (classes) => {
  const ws = XLSX.utils.json_to_sheet(
    classes.map((c, i) => ({
      "#": i + 1,
      "Class name": c.className,
      "Class code": c.classCode,
      Teacher: c.teacherName,
      Students: c.totalStudents ?? "",
      Room: c.roomNo || "",
      Schedule: c.startTime && c.endTime ? `${c.startTime} – ${c.endTime}` : "",
      Days: (c.classDays || []).join(", "),
      Status: c.isActive ? "Active" : "Inactive",
      "Created on": c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB") : "",
    }))
  );
  ws["!cols"] = [{ wch: 5 }, { wch: 26 }, { wch: 14 }, { wch: 22 }, { wch: 9 }, { wch: 10 }, { wch: 18 }, { wch: 24 }, { wch: 9 }, { wch: 12 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Classes");
  XLSX.writeFile(wb, `classes_${toISODate(new Date())}.xlsx`);
};
