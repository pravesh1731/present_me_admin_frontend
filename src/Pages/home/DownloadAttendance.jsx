import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  Download,
  Eye,
  X,
  Clock,
  MapPin,
  User,
  Users,
  CalendarDays,
  BookOpen,
  FileText,
  FileSpreadsheet,
  FileDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  TrendingDown,
  Percent,
  History,
  Inbox,
  ArrowUpDown,
} from "lucide-react";
import { BaseUrl } from "../../utils/constants";
import {
  LOW_ATTENDANCE,
  buildReport,
  exportCSV,
  exportClassList,
  exportExcel,
  exportPDF,
  formatDate,
  rangeLabel,
  toISODate,
} from "../../utils/attendanceReport";

const EMPTY = [];
const RECENT_KEY = "pm_recent_attendance_reports";

const FORMATS = [
  { id: "pdf", label: "PDF", icon: FileText, hint: "Formatted report for printing" },
  { id: "xlsx", label: "Excel", icon: FileSpreadsheet, hint: "Summary, register & sessions" },
  { id: "csv", label: "CSV", icon: FileDown, hint: "Plain student summary" },
];

const PRESETS = [
  { id: "all", label: "All time" },
  { id: "7", label: "Last 7 days" },
  { id: "30", label: "Last 30 days" },
  { id: "month", label: "This month" },
  { id: "lastMonth", label: "Last month" },
  { id: "custom", label: "Custom" },
];

const presetRange = (id) => {
  const today = new Date();
  if (id === "7" || id === "30") {
    const from = new Date(today);
    from.setDate(from.getDate() - (Number(id) - 1));
    return [toISODate(from), toISODate(today)];
  }
  if (id === "month") return [toISODate(new Date(today.getFullYear(), today.getMonth(), 1)), toISODate(today)];
  if (id === "lastMonth")
    return [
      toISODate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
      toISODate(new Date(today.getFullYear(), today.getMonth(), 0)),
    ];
  return ["", ""];
};

const pctColor = (p) => (p >= LOW_ATTENDANCE ? "text-green-600" : p >= 50 ? "text-amber-600" : "text-red-600");
const pctBar = (p) => (p >= LOW_ATTENDANCE ? "bg-green-500" : p >= 50 ? "bg-amber-500" : "bg-red-500");

const readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.04, duration: 0.3 } }),
};

/* ---------- Small pieces ---------- */

const StatTile = ({ label, value, icon: Icon, gradient, loading }) => (
  <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`bg-gradient-to-br ${gradient} p-2 rounded-xl text-white`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {loading ? (
      <div className="mt-3 h-8 w-14 rounded bg-gray-100 animate-pulse" />
    ) : (
      <div className="mt-3 text-3xl font-semibold text-gray-900">{value}</div>
    )}
  </div>
);

const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        role="status"
        className={`fixed top-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm text-white max-w-sm ${
          toast.type === "error" ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {toast.type === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
        <span>{toast.message}</span>
        <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm animate-pulse">
    <div className="h-5 w-2/3 bg-gray-100 rounded" />
    <div className="h-4 w-1/3 bg-gray-100 rounded mt-3" />
    <div className="h-4 w-1/2 bg-gray-100 rounded mt-5" />
    <div className="h-4 w-2/5 bg-gray-100 rounded mt-2" />
    <div className="flex gap-3 mt-6">
      <div className="h-10 flex-1 bg-gray-100 rounded-lg" />
      <div className="h-10 flex-1 bg-gray-100 rounded-lg" />
    </div>
  </div>
);

const ClassCard = ({ cls, i, onOpen, onQuickDownload, busy, onCopy }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={i}
    className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 text-lg truncate" title={cls.className}>
          {cls.className || "Untitled class"}
        </h3>
        <button
          onClick={() => onCopy(cls.classCode)}
          className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#0A80F5] bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100"
          title="Copy class code"
        >
          {cls.classCode} <Copy className="w-3 h-3" />
        </button>
      </div>
      <span
        className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
          cls.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
        }`}
      >
        {cls.isActive ? "Active" : "Inactive"}
      </span>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
      <span className="flex items-center gap-2 min-w-0">
        <User className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="truncate">{cls.teacherName || "—"}</span>
      </span>
      <span className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-400 shrink-0" />
        {cls.totalStudents ?? 0} student{cls.totalStudents === 1 ? "" : "s"}
      </span>
      {cls.startTime && cls.endTime && (
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          {cls.startTime} – {cls.endTime}
        </span>
      )}
      {cls.roomNo && (
        <span className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          Room {cls.roomNo}
        </span>
      )}
    </div>

    {cls.classDays?.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {cls.classDays.map((d) => (
          <span key={d} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
            {String(d).slice(0, 3)}
          </span>
        ))}
      </div>
    )}

    <div className="mt-auto pt-5 flex gap-2">
      <button
        onClick={() => onOpen(cls)}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] hover:opacity-95"
      >
        <Eye className="w-4 h-4" /> View report
      </button>
      <button
        onClick={() => onQuickDownload(cls, "pdf")}
        disabled={!!busy}
        title="Download full report as PDF"
        aria-label="Download PDF"
        className="px-3 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >
        {busy === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
      </button>
      <button
        onClick={() => onQuickDownload(cls, "xlsx")}
        disabled={!!busy}
        title="Download full report as Excel"
        aria-label="Download Excel"
        className="px-3 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >
        {busy === "xlsx" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
      </button>
    </div>
  </motion.div>
);

const SortHead = ({ k, sort, onSort, children, className = "" }) => (
  <th className={`px-4 py-2.5 text-left text-xs font-medium text-gray-500 ${className}`}>
    <button onClick={() => onSort(k)} className="inline-flex items-center gap-1 hover:text-gray-800">
      {children}
      <ArrowUpDown className={`w-3 h-3 ${sort.key === k ? "text-[#0A80F5]" : "text-gray-300"}`} />
    </button>
  </th>
);

const PctBar = ({ value }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div className={`h-full ${pctBar(value)}`} style={{ width: `${value}%` }} />
    </div>
    <span className={`text-sm font-semibold w-11 text-right ${pctColor(value)}`}>{value}%</span>
  </div>
);

/* ---------- Report modal ---------- */

const ReportModal = ({ cls, getAttendance, onClose, onExport, exporting }) => {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [preset, setPreset] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [view, setView] = useState("students");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "name", dir: 1 });
  const [lowOnly, setLowOnly] = useState(false);
  const [format, setFormat] = useState("pdf");

  const load = useCallback(
    async (force = false) => {
      setState({ loading: true, error: null, data: null });
      try {
        setState({ loading: false, error: null, data: await getAttendance(cls.classCode, force) });
      } catch (err) {
        setState({ loading: false, error: err?.response?.data?.message || "Couldn't load attendance", data: null });
      }
    },
    [cls.classCode, getAttendance]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Esc to close + lock background scroll
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const rangeError = start && end && start > end ? "Start date must be on or before end date" : null;
  const report = useMemo(
    () => (state.data && !rangeError ? buildReport(state.data, start, end) : null),
    [state.data, start, end, rangeError]
  );

  const rows = useMemo(() => {
    if (!report) return EMPTY;
    const q = query.trim().toLowerCase();
    return report.students
      .filter((s) => !q || [s.name, s.rollNo, s.email].some((v) => String(v).toLowerCase().includes(q)))
      .filter((s) => !lowOnly || (s.total > 0 && s.percentage < LOW_ATTENDANCE))
      .sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        return (typeof av === "number" ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true })) * sort.dir;
      });
  }, [report, query, lowOnly, sort]);

  const choosePreset = (id) => {
    setPreset(id);
    if (id !== "custom") {
      const [s, e] = presetRange(id);
      setStart(s);
      setEnd(e);
    }
  };

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: key === "name" || key === "rollNo" ? 1 : -1 }));

  const s = report?.summary;
  const canExport = report && !exporting && report.students.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="relative z-10 w-full sm:w-[95%] max-w-5xl bg-white sm:rounded-xl rounded-t-2xl shadow-xl max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 id="report-title" className="text-lg font-semibold text-gray-900 truncate">
                {cls.className}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5 flex flex-wrap gap-x-3">
                <span>{cls.classCode}</span>
                {cls.teacherName && <span>• {cls.teacherName}</span>}
                {cls.startTime && cls.endTime && (
                  <span>
                    • {cls.startTime} – {cls.endTime}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => load(true)}
                disabled={state.loading}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Reload attendance"
                title="Reload"
              >
                <RefreshCw className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Date range */}
          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => choosePreset(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  preset === p.id ? "bg-[#0A80F5] border-[#0A80F5] text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {preset === "custom" && (
            <div className="mt-3 grid grid-cols-2 gap-3 max-w-md">
              <label className="text-xs text-gray-500">
                From
                <input
                  type="date"
                  value={start}
                  max={end || undefined}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0A80F5]"
                />
              </label>
              <label className="text-xs text-gray-500">
                To
                <input
                  type="date"
                  value={end}
                  min={start || undefined}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0A80F5]"
                />
              </label>
            </div>
          )}
          <p className={`text-xs mt-2 ${rangeError ? "text-red-600" : "text-gray-400"}`}>
            {rangeError || `Showing: ${rangeLabel(start, end)}`}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {state.loading ? (
            <div className="py-16 flex flex-col items-center text-gray-500 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#0A80F5]" />
              Loading attendance…
            </div>
          ) : state.error ? (
            <div className="py-16 flex flex-col items-center text-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className="text-gray-700">{state.error}</div>
              <button onClick={() => load(true)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                Try again
              </button>
            </div>
          ) : !report ? null : report.students.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center gap-2 text-gray-500">
              <Inbox className="w-8 h-8 text-gray-300" />
              <div className="font-medium text-gray-700">No attendance recorded yet</div>
              <div className="text-sm">Once the teacher takes attendance for this class, it will show up here.</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <div className="text-xs text-[#0A80F5] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Students
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">{s.totalStudents}</div>
                </div>
                <div className="rounded-xl bg-purple-50 p-4">
                  <div className="text-xs text-[#6b46c1] flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> Sessions
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">{s.sessions}</div>
                </div>
                <div className="rounded-xl bg-green-50 p-4">
                  <div className="text-xs text-green-700 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" /> Average attendance
                  </div>
                  <div className={`text-2xl font-semibold mt-1 ${s.sessions ? pctColor(s.average) : "text-gray-400"}`}>
                    {s.sessions ? `${s.average}%` : "—"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setView("students");
                    setLowOnly((v) => !v);
                  }}
                  className={`rounded-xl p-4 text-left transition-colors ${lowOnly ? "bg-red-100 ring-2 ring-red-200" : "bg-red-50 hover:bg-red-100"}`}
                  title="Show only students below the threshold"
                >
                  <div className="text-xs text-red-700 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5" /> Below {LOW_ATTENDANCE}%
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">{s.lowCount}</div>
                </button>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div role="tablist" className="inline-flex p-1 bg-gray-50 rounded-lg border border-gray-100 w-fit">
                  {[
                    ["students", `Students (${report.students.length})`],
                    ["sessions", `Sessions (${report.daily.length})`],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={view === id}
                      onClick={() => setView(id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        view === id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {view === "students" && (
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={lowOnly}
                        onChange={(e) => setLowOnly(e.target.checked)}
                        className="w-4 h-4 accent-[#0A80F5]"
                      />
                      Below {LOW_ATTENDANCE}% only
                    </label>
                    <div className="relative w-full sm:w-60">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, roll no, email"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0A80F5]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg border border-gray-100">
                {view === "students" ? (
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 w-12">#</th>
                        <SortHead k="name" sort={sort} onSort={toggleSort}>
                          Student
                        </SortHead>
                        <SortHead k="rollNo" sort={sort} onSort={toggleSort}>
                          Roll no
                        </SortHead>
                        <SortHead k="present" sort={sort} onSort={toggleSort}>
                          Present
                        </SortHead>
                        <SortHead k="absent" sort={sort} onSort={toggleSort}>
                          Absent
                        </SortHead>
                        <SortHead k="percentage" sort={sort} onSort={toggleSort} className="w-48">
                          Attendance
                        </SortHead>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                            No students match your filters.
                          </td>
                        </tr>
                      ) : (
                        rows.map((st, idx) => (
                          <tr key={st.studentId} className="hover:bg-gray-50/60">
                            <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{st.name}</div>
                              {st.email && <div className="text-xs text-gray-500">{st.email}</div>}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{st.rollNo || "—"}</td>
                            <td className="px-4 py-3 text-sm text-green-600 font-medium">{st.present}</td>
                            <td className="px-4 py-3 text-sm text-red-600 font-medium">{st.absent}</td>
                            <td className="px-4 py-3">
                              {st.total ? <PctBar value={st.percentage} /> : <span className="text-xs text-gray-400">No records in range</span>}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full min-w-[520px]">
                    <thead className="bg-gray-50">
                      <tr>
                        {["#", "Date", "Present", "Absent", "Attendance"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {report.daily.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                            No sessions in this date range.
                          </td>
                        </tr>
                      ) : (
                        [...report.daily].reverse().map((d, idx) => (
                          <tr key={d.date} className="hover:bg-gray-50/60">
                            <td className="px-4 py-3 text-sm text-gray-400">{report.daily.length - idx}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatDate(d.date)}</td>
                            <td className="px-4 py-3 text-sm text-green-600 font-medium">{d.present}</td>
                            <td className="px-4 py-3 text-sm text-red-600 font-medium">{d.absent}</td>
                            <td className="px-4 py-3 w-56">
                              <PctBar value={d.percentage} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer: export */}
        <div className="p-4 sm:px-6 border-t border-gray-100 bg-gray-50/60 sm:rounded-b-xl flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex gap-2" role="radiogroup" aria-label="File format">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                role="radio"
                aria-checked={format === f.id}
                onClick={() => setFormat(f.id)}
                title={f.hint}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  format === f.id ? "border-[#0A80F5] bg-blue-50 text-[#0A80F5]" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <f.icon className="w-4 h-4" /> {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onExport(cls, report, format, start, end)}
            disabled={!canExport}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? "Preparing…" : `Download ${FORMATS.find((f) => f.id === format).label}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------- Page ---------- */

const DownloadAttendance = () => {
  const user = useSelector((store) => store.user);
  const students = useSelector((store) => store.student) || EMPTY;
  const verifiedTeachers = useSelector((store) => store.teacher.verifiedTeachers) || EMPTY;

  const [classes, setClasses] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("active");
  const [query, setQuery] = useState("");
  const [teacher, setTeacher] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [openClass, setOpenClass] = useState(null);
  const [busy, setBusy] = useState(null); // { classCode, format } while a file is being generated
  const [recent, setRecent] = useState(readRecent);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const cache = useRef(new Map());

  const notify = (type, message) => {
    clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BaseUrl}/admin/classes`, { withCredentials: true });
      setClasses(res.data?.data || EMPTY);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load classes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Attendance is cached per class so preview → download doesn't refetch
  const getAttendance = useCallback(async (classCode, force = false) => {
    if (!force && cache.current.has(classCode)) return cache.current.get(classCode);
    const res = await axios.get(`${BaseUrl}/admin/download/class-attendance/${encodeURIComponent(classCode)}`, {
      withCredentials: true,
    });
    cache.current.set(classCode, res.data);
    return res.data;
  }, []);

  const rememberDownload = (cls, format, start, end) => {
    const entry = { id: Date.now(), classCode: cls.classCode, className: cls.className, format, start, end };
    setRecent((prev) => {
      const next = [entry, ...prev].slice(0, 6);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — list just won't persist */
      }
      return next;
    });
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  const runExport = async (cls, report, format, start = "", end = "") => {
    setBusy({ classCode: cls.classCode, format });
    try {
      const r = report || buildReport(await getAttendance(cls.classCode), start, end);
      if (!r.students.length) {
        notify("error", "No attendance recorded for this class yet");
        return;
      }
      const institution = user?.InstitutionName;
      if (format === "pdf") exportPDF(cls, r, start, end, institution);
      else if (format === "xlsx") exportExcel(cls, r, start, end, institution);
      else exportCSV(cls, r, start, end);
      rememberDownload(cls, format, start, end);
      notify("success", `${cls.className} report downloaded`);
    } catch (err) {
      console.error(err);
      notify("error", err?.response?.data?.message || "Couldn't generate the report");
    } finally {
      setBusy(null);
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      notify("success", `Copied ${code}`);
    } catch {
      notify("error", "Couldn't copy to clipboard");
    }
  };

  const counts = useMemo(
    () => ({
      all: classes.length,
      active: classes.filter((c) => c.isActive).length,
      inactive: classes.filter((c) => !c.isActive).length,
    }),
    [classes]
  );

  const teacherOptions = useMemo(
    () =>
      [...new Map(classes.map((c) => [c.teacherId, c.teacherName])).entries()].sort((a, b) =>
        String(a[1]).localeCompare(String(b[1]))
      ),
    [classes]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes
      .filter((c) => status === "all" || (status === "active" ? c.isActive : !c.isActive))
      .filter((c) => teacher === "all" || c.teacherId === teacher)
      .filter((c) => !q || [c.className, c.classCode, c.teacherName, c.roomNo].some((v) => String(v || "").toLowerCase().includes(q)))
      .sort((a, b) => {
        if (sortBy === "students") return (b.totalStudents || 0) - (a.totalStudents || 0);
        if (sortBy === "newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
        return String(a.className || "").localeCompare(String(b.className || ""), undefined, { numeric: true });
      });
  }, [classes, status, teacher, query, sortBy]);

  const filtersActive = query || teacher !== "all";
  const closeModal = useCallback(() => setOpenClass(null), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Attendance Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Preview class attendance and download reports as PDF, Excel or CSV</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportClassList(visible)}
            disabled={!visible.length}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export class list
          </button>
          <button
            onClick={() => {
              cache.current.clear();
              fetchClasses();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total classes" value={counts.all} icon={BookOpen} gradient="from-[#0BCCEB] to-[#0A80F5]" loading={loading} />
        <StatTile label="Active classes" value={counts.active} icon={CalendarDays} gradient="from-emerald-400 to-green-600" loading={loading} />
        <StatTile label="Students" value={students.length} icon={Users} gradient="from-[#9f7aea] to-[#6b46c1]" />
        <StatTile label="Teachers" value={verifiedTeachers.length} icon={User} gradient="from-amber-400 to-orange-500" />
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 xl:col-span-9 space-y-4">
          {/* Toolbar */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-3 lg:items-center">
            <div role="tablist" className="inline-flex p-1 bg-gray-50 rounded-lg border border-gray-100 w-fit shrink-0">
              {[
                ["active", "Active"],
                ["inactive", "Inactive"],
                ["all", "All"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={status === id}
                  onClick={() => setStatus(id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    status === id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {label} <span className="text-gray-400 font-normal">{loading ? "" : counts[id]}</span>
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search class, code, teacher or room"
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0A80F5]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="flex-1 lg:w-44 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
                aria-label="Filter by teacher"
              >
                <option value="all">All teachers</option>
                {teacherOptions.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 lg:w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
                aria-label="Sort classes"
              >
                <option value="name">Name A–Z</option>
                <option value="students">Most students</option>
                <option value="newest">Newest first</option>
              </select>
            </div>
          </div>

          {/* Class grid */}
          {error ? (
            <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className="text-gray-700">{error}</div>
              <button onClick={fetchClasses} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((k) => (
                <CardSkeleton key={k} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
              <Inbox className="w-8 h-8 text-gray-300" />
              <div className="font-medium text-gray-700">
                {classes.length === 0 ? "No classes yet" : filtersActive ? "No classes match your filters" : `No ${status} classes`}
              </div>
              <div className="text-sm text-gray-500">
                {classes.length === 0 ? "Classes created by your approved teachers will appear here." : "Try a different search or filter."}
              </div>
              {filtersActive && (
                <button
                  onClick={() => {
                    setQuery("");
                    setTeacher("all");
                  }}
                  className="mt-2 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visible.map((cls, i) => (
                <ClassCard
                  key={cls.classCode}
                  cls={cls}
                  i={i}
                  onOpen={setOpenClass}
                  onQuickDownload={(c, f) => runExport(c, null, f)}
                  busy={busy ? (busy.classCode === cls.classCode ? busy.format : "other") : null}
                  onCopy={copyCode}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent downloads */}
        <div className="col-span-12 xl:col-span-3">
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <History className="w-4 h-4 text-gray-400" /> Recent downloads
              </h4>
              {recent.length > 0 && (
                <button onClick={clearRecent} className="text-xs text-gray-400 hover:text-gray-600">
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">Saved on this browser only</p>
            {recent.length === 0 ? (
              <div className="text-sm text-gray-500 py-6 text-center">Reports you download will appear here for quick re-download.</div>
            ) : (
              <ul className="space-y-2">
                {recent.map((r) => {
                  const cls = classes.find((c) => c.classCode === r.classCode);
                  const F = FORMATS.find((f) => f.id === r.format) || FORMATS[0];
                  return (
                    <li key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0A80F5] flex items-center justify-center shrink-0">
                        <F.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{r.className}</div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {F.label} • {rangeLabel(r.start, r.end)}
                        </div>
                      </div>
                      <button
                        onClick={() => cls && runExport(cls, null, r.format, r.start, r.end)}
                        disabled={!cls || !!busy}
                        title={cls ? "Download again" : "Class no longer available"}
                        aria-label="Download again"
                        className="p-1.5 rounded-md text-gray-500 hover:bg-white hover:text-[#0A80F5] disabled:opacity-40"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openClass && (
          <ReportModal
            key={openClass.classCode}
            cls={openClass}
            getAttendance={getAttendance}
            onClose={closeModal}
            onExport={runExport}
            exporting={busy?.classCode === openClass.classCode}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default DownloadAttendance;
