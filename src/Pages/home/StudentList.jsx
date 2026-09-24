import axios from "axios";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Eye,
  GraduationCap,
  Hash,
  LayoutGrid,
  List,
  Loader2,
  Mail,
  MailWarning,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { BaseUrl } from "../../utils/constants";
import { fetchStudentList } from "../../customHooks/useStudentData";

const EMPTY = [];
const PAGE_SIZE = 30;
const VIEW_KEY = "pm_student_view";
const GOOD = 75;
const FAIR = 50;

/* ---------- helpers ---------- */

const fullName = (s) => `${s?.firstName || ""} ${s?.lastName || ""}`.trim() || "Unnamed student";

const initials = (s) => `${s?.firstName?.[0] || ""}${s?.lastName?.[0] || ""}`.toUpperCase() || "S";

const formatDate = (d, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  if (!d) return "—";
  // Plain "YYYY-MM-DD" dates are local calendar days, not UTC midnight
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d);
  return Number.isNaN(date.getTime()) ? String(d) : date.toLocaleDateString("en-GB", opts);
};

// Handles "14:30" as well as values already stored as "2:30 PM"
const formatTime = (t) => {
  if (!t) return null;
  if (/am|pm/i.test(t)) return String(t).toUpperCase().replace(/\s*(AM|PM)/, " $1");
  const m = String(t).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return t;
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? "PM" : "AM"}`;
};

// Semester may come as 3, "3" or "3rd" — pull the number out for sorting/display
const semesterNum = (s) => {
  const n = parseInt(s?.semester, 10);
  return Number.isNaN(n) ? null : n;
};

const semesterLabel = (s) => (semesterNum(s) ? `Sem ${semesterNum(s)}` : "—");

const pctTone = (p) =>
  p >= GOOD
    ? { text: "text-emerald-600", bar: "bg-emerald-500" }
    : p >= FAIR
    ? { text: "text-amber-600", bar: "bg-amber-500" }
    : { text: "text-red-600", bar: "bg-red-500" };

const errMsg = (err, fallback) =>
  err?.response?.data?.message || (err?.request && !err?.response ? "Network error — check your connection" : fallback);

const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.03, duration: 0.3 } }),
};

const exportCsv = (rows) => {
  const headers = ["Student ID", "First Name", "Last Name", "Email", "Phone", "Roll No", "Semester", "Email verified", "Joined"];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((s) =>
    [s.studentId, s.firstName, s.lastName, s.emailId, s.phone, s.rollNo, semesterNum(s), s.emailVerified ? "Yes" : "No", formatDate(s.createdAt)]
      .map(escape)
      .join(",")
  );
  // BOM so Excel opens non-English names correctly
  const blob = new Blob(["﻿" + [headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const useToast = () => {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = useCallback((type, message) => {
    clearTimeout(timer.current);
    setToast({ type, message });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [toast, notify, () => setToast(null)];
};

const copyText = async (text, notify, label) => {
  try {
    await navigator.clipboard.writeText(text);
    notify("success", `${label} copied`);
  } catch {
    notify("error", "Couldn't copy to clipboard");
  }
};

/* ---------- small UI ---------- */

const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        role="status"
        className={`fixed top-5 right-5 z-[70] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm text-white max-w-sm ${
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

const SemesterChip = ({ s }) =>
  semesterNum(s) ? (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#f6f8ff] text-[#0A80F5] font-medium">
      <GraduationCap className="w-3.5 h-3.5" />
      {semesterLabel(s)}
    </span>
  ) : null;

const Avatar = ({ s, size = "w-12 h-12", text = "text-base" }) =>
  s.profilePicUrl ? (
    <img src={s.profilePicUrl} alt={fullName(s)} className={`${size} rounded-full object-cover ring-2 ring-white shadow shrink-0 bg-gray-100`} />
  ) : (
    <div
      className={`${size} ${text} rounded-full bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] flex items-center justify-center text-white font-semibold shadow shrink-0`}
    >
      {initials(s)}
    </div>
  );

const StatusBadge = ({ verified, light }) =>
  verified ? (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
        light ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      <BadgeCheck className="w-3.5 h-3.5" /> Verified
    </span>
  ) : (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
        light ? "bg-amber-400/30 text-white" : "bg-amber-50 text-amber-700"
      }`}
    >
      <MailWarning className="w-3.5 h-3.5" /> Unverified
    </span>
  );

const StatCard = ({ label, value, hint, icon: Icon, gradient, loading, onClick, active }) => {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`text-left bg-white rounded-xl p-5 shadow-md border transition-all ${
        active ? "border-[#0A80F5] ring-2 ring-blue-100" : "border-gray-100"
      } ${onClick ? "hover:shadow-lg hover:-translate-y-0.5" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`bg-gradient-to-br ${gradient} p-2 rounded-xl text-white`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {loading ? <div className="mt-3 h-9 w-16 rounded bg-gray-100 animate-pulse" /> : <div className="mt-3 text-3xl font-bold text-gray-900">{value}</div>}
      <div className="text-xs text-gray-400 mt-1">{hint}</div>
    </Tag>
  );
};

const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-100" />
      <div className="flex-1">
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="h-3 w-1/3 bg-gray-100 rounded mt-2" />
      </div>
    </div>
    <div className="h-3 w-3/4 bg-gray-100 rounded mt-5" />
    <div className="h-3 w-1/2 bg-gray-100 rounded mt-2.5" />
    <div className="h-3 w-2/5 bg-gray-100 rounded mt-2.5" />
    <div className="h-8 w-full bg-gray-100 rounded-lg mt-5" />
  </div>
);

/* ---------- list items ---------- */

const StudentCard = ({ s, i, onView }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={i}
    className="group bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-[#0A80F5]/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
  >
    <div className="flex items-start justify-between gap-3">
      <button onClick={() => onView(s)} className="flex items-center gap-3 min-w-0 text-left">
        <Avatar s={s} />
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate group-hover:text-[#0A80F5]">{fullName(s)}</div>
          <div className="text-xs text-gray-500 truncate">Roll no: {s.rollNo || "—"}</div>
          <div className="mt-1">
            <SemesterChip s={s} />
          </div>
        </div>
      </button>
      <StatusBadge verified={s.emailVerified === true} />
    </div>

    <div className="mt-4 space-y-2.5 text-sm text-gray-600">
      <div className="flex items-center gap-2 min-w-0">
        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="truncate" title={s.emailId}>
          {s.emailId || "—"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
        {s.phone ? (
          <a href={`tel:${s.phone}`} className="hover:text-[#0A80F5]">
            {s.phone}
          </a>
        ) : (
          <span>—</span>
        )}
      </div>
    </div>

    <div className="mt-auto pt-4">
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">Joined {formatDate(s.createdAt)}</span>
        <button
          onClick={() => onView(s)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A80F5] bg-[#f6f8ff] hover:bg-[#0A80F5] hover:text-white rounded-lg px-3 py-1.5 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      </div>
    </div>
  </motion.div>
);

const StudentRow = ({ s, onView }) => (
  <div
    onClick={() => onView(s)}
    onKeyDown={(e) => e.key === "Enter" && onView(s)}
    role="button"
    tabIndex={0}
    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#f6f8ff] cursor-pointer transition-colors outline-none focus-visible:bg-[#f6f8ff]"
  >
    <div className="flex-1 flex items-center gap-3 min-w-0">
      <Avatar s={s} size="w-10 h-10" text="text-sm" />
      <div className="min-w-0">
        <div className="font-medium text-gray-900 truncate">{fullName(s)}</div>
        <div className="text-xs text-gray-500 truncate">{s.emailId}</div>
      </div>
    </div>
    <div className="hidden md:block text-sm text-gray-600 w-28 truncate">{s.phone || "—"}</div>
    <div className="hidden sm:block text-sm text-gray-600 w-20 truncate">{s.rollNo || "—"}</div>
    <div className="hidden sm:block text-sm text-gray-600 w-16">{semesterLabel(s)}</div>
    <div className="hidden lg:block text-sm text-gray-500 w-28">{formatDate(s.createdAt)}</div>
    <div className="flex items-center gap-3 shrink-0">
      <span className="hidden sm:inline-flex w-[104px]">
        <StatusBadge verified={s.emailVerified === true} />
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView(s);
        }}
        className="p-2 rounded-lg text-gray-500 hover:text-[#0A80F5] hover:bg-white border border-transparent hover:border-gray-200 transition"
        aria-label={`View ${fullName(s)}`}
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  </div>
);

/* ---------- details modal ---------- */

const StudentClassCard = ({ classData }) => {
  const summary = classData.attendanceSummary || {};
  const hasSessions = summary.totalClasses > 0;
  const pct = summary.percentage ?? 0;
  const tone = pctTone(pct);
  const records = useMemo(
    () => [...(classData.attendanceRecords || [])].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [classData.attendanceRecords]
  );
  const recent = records.slice(0, 12).reverse();
  const start = formatTime(classData.startTime);
  const end = formatTime(classData.endTime);

  return (
    <div className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#0A80F5]/30 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{classData.className || "Untitled class"}</h3>
          <p className="text-xs text-[#0A80F5] mt-0.5 font-medium">Code: {classData.classCode}</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
            classData.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {classData.isActive !== false ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
        {start && end && (
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            {start} – {end}
          </span>
        )}
        {classData.roomNo && (
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            Room {classData.roomNo}
          </span>
        )}
        <span className="flex items-center gap-2 min-w-0">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{classData.teacherName || "—"}</span>
        </span>
        {classData.classDays?.length > 0 && (
          <span className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
            {classData.classDays.map((day) => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(", ")}
          </span>
        )}
      </div>

      <div className="mt-4">
        {hasSessions ? (
          <>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-500">Attendance</span>
              <span className={`font-semibold ${tone.text}`}>{pct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className={`${tone.bar} rounded-full h-2 transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between gap-3 mt-2">
              <p className="text-xs text-gray-400">
                {summary.present} of {summary.totalClasses} sessions attended
              </p>
              {/* Last sessions at a glance, oldest → newest */}
              <div className="flex gap-1" aria-label="Recent sessions">
                {recent.map((r) => (
                  <span
                    key={r.date}
                    title={`${formatDate(r.date)} — ${r.status === 1 ? "Present" : "Absent"}`}
                    className={`w-2.5 h-2.5 rounded-sm ${r.status === 1 ? "bg-emerald-500" : "bg-red-400"}`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-400">No sessions recorded yet</p>
        )}
      </div>

      {records.length > 0 && (
        <details className="group/rec mt-3">
          <summary className="list-none flex items-center gap-1 text-xs font-medium text-[#0A80F5] cursor-pointer select-none">
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-open/rec:rotate-180" />
            Attendance history ({records.length})
          </summary>
          <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-100">
            {records.map((record) => (
              <div key={record.date} className="flex justify-between text-xs px-3 py-2">
                <span className="text-gray-600">{formatDate(record.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    record.status === 1 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  }`}
                >
                  {record.status === 1 ? "Present" : "Absent"}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

const StudentDetailsModal = ({ student, onClose, notify }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [classSubTab, setClassSubTab] = useState("active");
  const [state, setState] = useState({ loading: true, error: null, classes: EMPTY });

  const load = useCallback(async () => {
    setState({ loading: true, error: null, classes: EMPTY });
    try {
      const response = await axios.get(`${BaseUrl}/admin/students/${encodeURIComponent(student.studentId)}/classes`, {
        withCredentials: true,
      });
      setState({ loading: false, error: null, classes: response.data?.data || EMPTY });
    } catch (err) {
      setState({ loading: false, error: errMsg(err, "Couldn't load classes"), classes: EMPTY });
    }
  }, [student.studentId]);

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

  const { classes } = state;
  const grouped = useMemo(
    () => ({
      active: classes.filter((c) => c.isActive !== false),
      inactive: classes.filter((c) => c.isActive === false),
    }),
    [classes]
  );

  const overall = useMemo(() => {
    const present = classes.reduce((n, c) => n + (c.attendanceSummary?.present || 0), 0);
    const total = classes.reduce((n, c) => n + (c.attendanceSummary?.totalClasses || 0), 0);
    const low = classes.filter((c) => c.attendanceSummary?.totalClasses > 0 && c.attendanceSummary.percentage < GOOD);
    return { present, total, pct: total ? Math.round((present / total) * 100) : null, low };
  }, [classes]);

  const verified = student.emailVerified === true;
  const personalFields = [
    { label: "Full name", value: fullName(student), icon: User },
    { label: "Email address", value: student.emailId, icon: Mail, href: student.emailId && `mailto:${student.emailId}` },
    { label: "Phone number", value: student.phone, icon: Phone, href: student.phone && `tel:${student.phone}` },
    { label: "Roll number", value: student.rollNo, icon: Hash },
    { label: "Semester", value: semesterNum(student), icon: GraduationCap },
    { label: "Branch", value: student.branch, icon: BookOpen },
    { label: "Joined", value: formatDate(student.createdAt), icon: CalendarDays },
    {
      label: "Email verification",
      value: verified ? (student.emailVerifiedAt ? `Verified on ${formatDate(student.emailVerifiedAt)}` : "Verified") : "Not verified yet",
      icon: verified ? BadgeCheck : MailWarning,
    },
  ].filter((f) => f.label !== "Branch" || f.value);

  const shownClasses = grouped[classSubTab];
  const overallTone = overall.pct == null ? null : pctTone(overall.pct);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="student-title">
      <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="relative z-10 w-full md:w-[780px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar s={student} size="w-16 h-16" text="text-xl" />
              <div className="min-w-0">
                <h3 id="student-title" className="text-xl font-semibold truncate">
                  {fullName(student)}
                </h3>
                <button
                  onClick={() => copyText(student.studentId, notify, "Student ID")}
                  className="text-sm text-white/80 hover:text-white inline-flex items-center gap-1.5 max-w-full"
                  title="Copy student ID"
                >
                  <span className="truncate">ID: {student.studentId}</span>
                  <Copy className="w-3.5 h-3.5 shrink-0" />
                </button>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <StatusBadge verified={verified} light />
                  {semesterNum(student) && (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/20">
                      <GraduationCap className="w-3.5 h-3.5" /> {semesterLabel(student)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg w-8 h-8 flex items-center justify-center transition shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {student.emailId && (
              <a href={`mailto:${student.emailId}`} className="inline-flex items-center gap-1.5 text-sm font-medium bg-white text-[#0A80F5] rounded-lg px-3 py-1.5 hover:bg-white/90">
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
            {student.phone && (
              <a href={`tel:${student.phone}`} className="inline-flex items-center gap-1.5 text-sm font-medium bg-white/15 rounded-lg px-3 py-1.5 hover:bg-white/25">
                <Phone className="w-4 h-4" /> Call
              </a>
            )}
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 text-center">
          <div className="py-3">
            <div className="text-xs text-gray-500">Classes</div>
            <div className="text-lg font-semibold text-gray-900">{state.loading ? "…" : grouped.active.length}</div>
          </div>
          <div className="py-3">
            <div className="text-xs text-gray-500">Sessions attended</div>
            <div className="text-lg font-semibold text-gray-900">{state.loading ? "…" : `${overall.present}/${overall.total}`}</div>
          </div>
          <div className="py-3">
            <div className="text-xs text-gray-500">Overall attendance</div>
            <div className={`text-lg font-semibold ${overallTone ? overallTone.text : "text-gray-400"}`}>
              {state.loading ? "…" : overall.pct == null ? "—" : `${overall.pct}%`}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 px-6">
          <div className="flex gap-6" role="tablist">
            {[
              { id: "personal", label: "Personal info" },
              { id: "classes", label: "Classes & attendance", count: classes.length },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 -mb-px border-b-2 text-sm transition-colors ${
                  activeTab === tab.id ? "border-[#0A80F5] text-[#0A80F5] font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && !state.loading && (
                  <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === "personal" && (
            <div className="space-y-4">
              {!verified && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800">
                  <MailWarning className="w-4 h-4 mt-0.5 shrink-0" />
                  This student hasn't verified their email yet. Ask them to open the verification link sent when they signed up.
                </div>
              )}
              {overall.low.length > 0 && (
                <button
                  onClick={() => setActiveTab("classes")}
                  className="w-full text-left flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 hover:bg-red-100/60"
                >
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  Attendance below {GOOD}% in {overall.low.length} class{overall.low.length > 1 ? "es" : ""}:{" "}
                  {overall.low.map((c) => c.className).join(", ")}
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personalFields.map(({ label, value, icon: Icon, href }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <div className="bg-[#f6f8ff] text-[#0A80F5] p-2 rounded-lg">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 font-medium">{label}</div>
                      {value && href ? (
                        <a href={href} className="mt-0.5 block text-[#0A80F5] hover:underline break-words">
                          {value}
                        </a>
                      ) : (
                        <div className={`mt-0.5 break-words ${value ? "text-gray-900" : "text-gray-400 italic"}`}>{value || "Not provided"}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "classes" && (
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                  {[
                    { id: "active", label: "Active" },
                    { id: "inactive", label: "Inactive" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setClassSubTab(t.id)}
                      className={`px-4 py-1.5 text-sm rounded-md transition ${
                        classSubTab === t.id ? "bg-white shadow-sm text-[#0A80F5] font-medium" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t.label} ({grouped[t.id].length})
                    </button>
                  ))}
                </div>
                <button
                  onClick={load}
                  disabled={state.loading}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  aria-label="Reload classes"
                  title="Reload"
                >
                  <RefreshCw className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {state.loading ? (
                <div className="text-center py-10">
                  <Loader2 className="w-7 h-7 animate-spin text-[#0A80F5] mx-auto" />
                  <p className="mt-3 text-sm text-gray-500">Loading classes…</p>
                </div>
              ) : state.error ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                  <p className="mt-3 text-sm text-gray-700">{state.error}</p>
                  <button onClick={load} className="mt-3 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                    Try again
                  </button>
                </div>
              ) : shownClasses.length === 0 ? (
                <div className="text-center py-10 text-sm text-gray-500">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  {classes.length === 0 ? "This student hasn't joined any classes yet." : `No ${classSubTab} classes.`}
                </div>
              ) : (
                <div className="grid gap-3">
                  {shownClasses.map((cls) => (
                    <StudentClassCard key={cls.classCode} classData={cls} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ---------- page ---------- */

const StudentList = () => {
  const dispatch = useDispatch();
  const storeStudents = useSelector((store) => store.student);
  const studentList = storeStudents || EMPTY;
  const [params, setParams] = useSearchParams();
  const viewingId = params.get("student");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("verified"); // "verified" | "unverified" | "all"
  const [semester, setSemester] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // "name" | "rollNo" | "semester" | "date"
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState(readView);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [toast, notify, dismissToast] = useToast();
  const triedFetch = useRef(false);

  const loading = storeStudents == null && !loadError;

  const refresh = useCallback(
    async (silent = false) => {
      setRefreshing(true);
      try {
        await fetchStudentList(dispatch);
        setLoadError(null);
        if (!silent) notify("success", "Student list updated");
      } catch (err) {
        setLoadError(errMsg(err, "Couldn't load students"));
        if (!silent) notify("error", errMsg(err, "Couldn't refresh students"));
      } finally {
        setRefreshing(false);
      }
    },
    [dispatch, notify]
  );

  // The header loads students once; if that hasn't landed after a few seconds (or failed), try ourselves
  useEffect(() => {
    if (storeStudents != null || triedFetch.current) return;
    const t = setTimeout(() => {
      triedFetch.current = true;
      refresh(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [storeStudents, refresh]);

  const counts = useMemo(() => {
    const verified = studentList.filter((s) => s.emailVerified === true).length;
    const now = new Date();
    const newThisMonth = studentList.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { all: studentList.length, verified, unverified: studentList.length - verified, newThisMonth };
  }, [studentList]);

  const byStatus = useMemo(
    () =>
      studentList.filter((s) => status === "all" || (status === "verified" ? s.emailVerified === true : s.emailVerified !== true)),
    [studentList, status]
  );

  const semesters = useMemo(() => [...new Set(byStatus.map(semesterNum).filter((n) => n !== null))].sort((a, b) => a - b), [byStatus]);

  const sortedStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = byStatus
      .filter((s) => semester === "all" || (semester === "none" ? semesterNum(s) === null : semesterNum(s) === Number(semester)))
      .filter(
        (s) =>
          !q ||
          [fullName(s), s.studentId, s.emailId, s.rollNo, s.phone].some((v) =>
            String(v ?? "")
              .toLowerCase()
              .includes(q)
          )
      );

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = fullName(a).toLowerCase().localeCompare(fullName(b).toLowerCase());
      } else if (sortBy === "date") {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "rollNo") {
        comparison = String(a.rollNo ?? "").localeCompare(String(b.rollNo ?? ""), undefined, { numeric: true });
      } else if (sortBy === "semester") {
        const semA = semesterNum(a);
        const semB = semesterNum(b);
        // Students without a semester always go to the bottom
        if (semA === null || semB === null) {
          if (semA === semB) return 0;
          return semA === null ? 1 : -1;
        }
        comparison = semA - semB || fullName(a).toLowerCase().localeCompare(fullName(b).toLowerCase());
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [byStatus, semester, query, sortBy, sortOrder]);

  // Start from the first page whenever the result set changes
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, status, semester, sortBy, sortOrder]);

  // Drop a semester filter that no longer exists in the current status tab
  useEffect(() => {
    if (semester !== "all" && semester !== "none" && !semesters.includes(Number(semester))) setSemester("all");
  }, [semesters, semester]);

  const shown = sortedStudents.slice(0, visible);
  const viewing = viewingId ? studentList.find((s) => s.studentId === viewingId) : null;
  const filtersActive = query.trim() || semester !== "all";

  const openStudent = (s) => setParams({ student: s.studentId });
  const closeView = useCallback(() => {
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.delete("student");
      return next;
    });
  }, [setParams]);

  const changeView = (v) => {
    setViewMode(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const clearFilters = () => {
    setQuery("");
    setSemester("all");
  };

  const statusLabel = { verified: "verified", unverified: "unverified", all: "registered" }[status];

  return (
    <section className="space-y-6">
      {/* Header banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white p-6 md:p-8 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Students</h2>
          <p className="mt-1 text-white/85">Student records, enrolled classes and attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refresh()}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-medium rounded-lg px-4 py-2 hover:bg-white/25 disabled:opacity-60 transition"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => exportCsv(sortedStudents)}
            disabled={sortedStudents.length === 0}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#0A80F5] font-medium rounded-lg px-4 py-2 shadow-sm hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            title="Export the students currently shown"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total registered"
          value={counts.all}
          hint="All student accounts"
          icon={Users}
          gradient="from-[#0BCCEB] to-[#0A80F5]"
          loading={loading}
          onClick={() => setStatus("all")}
          active={status === "all"}
        />
        <StatCard
          label="Verified"
          value={counts.verified}
          hint="Email verified accounts"
          icon={UserCheck}
          gradient="from-emerald-400 to-emerald-600"
          loading={loading}
          onClick={() => setStatus("verified")}
          active={status === "verified"}
        />
        <StatCard
          label="Awaiting verification"
          value={counts.unverified}
          hint={counts.unverified ? "Haven't confirmed their email" : "Everyone is verified"}
          icon={MailWarning}
          gradient="from-amber-400 to-amber-600"
          loading={loading}
          onClick={() => setStatus("unverified")}
          active={status === "unverified"}
        />
        <StatCard label="New this month" value={counts.newThisMonth} hint="Students who signed up" icon={UserPlus} gradient="from-[#9f7aea] to-[#6b46c1]" loading={loading} />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div role="tablist" className="inline-flex p-1 bg-gray-100 rounded-lg w-fit shrink-0">
            {[
              ["verified", "Verified", counts.verified],
              ["unverified", "Unverified", counts.unverified],
              ["all", "All", counts.all],
            ].map(([id, label, n]) => (
              <button
                key={id}
                role="tab"
                aria-selected={status === id}
                onClick={() => setStatus(id)}
                className={`px-3 py-1.5 text-sm rounded-md transition whitespace-nowrap ${
                  status === id ? "bg-white shadow-sm text-[#0A80F5] font-medium" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label} <span className="text-gray-400 font-normal">{loading ? "" : n}</span>
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, roll number or ID"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-9 py-2.5 text-sm focus:bg-white focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 outline-none transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20"
            aria-label="Filter by semester"
          >
            <option value="all">All semesters</option>
            {semesters.map((n) => (
              <option key={n} value={n}>
                Semester {n}
              </option>
            ))}
            <option value="none">No semester set</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20"
            aria-label="Sort by"
          >
            <option value="name">Sort: Name</option>
            <option value="rollNo">Sort: Roll number</option>
            <option value="semester">Sort: Semester</option>
            <option value="date">Sort: Join date</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            {sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </button>

          <div className="inline-flex p-1 bg-gray-100 rounded-lg ml-auto">
            {[
              { id: "grid", icon: LayoutGrid, label: "Grid view" },
              { id: "list", icon: List, label: "List view" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => changeView(id)}
                aria-pressed={viewMode === id}
                className={`p-1.5 rounded-md transition ${viewMode === id ? "bg-white shadow-sm text-[#0A80F5]" : "text-gray-500 hover:text-gray-700"}`}
                aria-label={label}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && !loadError && (
        <div className="text-sm text-gray-500 -mt-2 flex flex-wrap items-center gap-x-3">
          <span>
            Showing <span className="font-medium text-gray-700">{shown.length}</span> of {sortedStudents.length}
            {sortedStudents.length !== byStatus.length && ` (filtered from ${byStatus.length})`} {statusLabel} students
          </span>
          {filtersActive && (
            <button onClick={clearFilters} className="text-[#0A80F5] font-medium hover:underline">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loadError && storeStudents == null ? (
        <div className="bg-white rounded-xl p-12 shadow-md border border-gray-100 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="mt-3 font-semibold text-gray-900">Couldn't load students</h3>
          <p className="mt-1 text-sm text-gray-500">{loadError}</p>
          <button onClick={() => refresh()} className="mt-4 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <CardSkeleton key={k} />
          ))}
        </div>
      ) : sortedStudents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-md border border-gray-100 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#f6f8ff] text-[#0A80F5] flex items-center justify-center">
            {filtersActive ? <Search className="w-6 h-6" /> : status === "unverified" ? <CheckCircle2 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>
          <h3 className="mt-4 font-semibold text-gray-900">
            {filtersActive
              ? "No matching students"
              : status === "unverified"
              ? "Everyone has verified their email"
              : status === "verified"
              ? "No verified students yet"
              : "No students yet"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filtersActive
              ? "Try a different name, email, roll number or semester."
              : status === "verified" && counts.unverified
              ? `${counts.unverified} student${counts.unverified > 1 ? "s have" : " has"} signed up but not verified their email yet.`
              : "Students appear here after they sign up in the Present Me app and choose your institution."}
          </p>
          {filtersActive ? (
            <button onClick={clearFilters} className="mt-4 text-sm font-medium text-[#0A80F5] hover:underline">
              Clear filters
            </button>
          ) : (
            status === "verified" &&
            counts.unverified > 0 && (
              <button onClick={() => setStatus("unverified")} className="mt-4 text-sm font-medium text-[#0A80F5] hover:underline">
                View unverified students
              </button>
            )
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map((s, i) => (
            <StudentCard key={s.studentId} s={s} i={i % PAGE_SIZE} onView={openStudent} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium uppercase tracking-wide text-gray-500">
            <div className="flex-1">Student</div>
            <div className="hidden md:block w-28">Phone</div>
            <div className="hidden sm:block w-20">Roll no</div>
            <div className="hidden sm:block w-16">Semester</div>
            <div className="hidden lg:block w-28">Joined</div>
            <div className="w-10 sm:w-[156px]" />
          </div>
          <div className="divide-y divide-gray-100">
            {shown.map((s) => (
              <StudentRow key={s.studentId} s={s} onView={openStudent} />
            ))}
          </div>
        </div>
      )}

      {!loading && shown.length < sortedStudents.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <ChevronDown className="w-4 h-4" />
            Show {Math.min(PAGE_SIZE, sortedStudents.length - shown.length)} more
          </button>
        </div>
      )}

      <AnimatePresence>{viewing && <StudentDetailsModal key={viewing.studentId} student={viewing} onClose={closeView} notify={notify} />}</AnimatePresence>

      <Toast toast={toast} onClose={dismissToast} />
    </section>
  );
};

export default StudentList;
