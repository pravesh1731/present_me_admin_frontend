import axios from "axios";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import {
  Search,
  RefreshCw,
  UserPlus,
  Users,
  UserCheck,
  Clock,
  CalendarPlus,
  Mail,
  Phone,
  Wifi,
  MapPin,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  Check,
  X,
  Eye,
  ArrowLeft,
  Copy,
  LayoutGrid,
  List,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  BookOpen,
  CalendarDays,
  Percent,
  ClipboardList,
  Undo2,
  Hash,
  Smartphone,
} from "lucide-react";
import { BaseUrl } from "../../utils/constants";
import { setPendingTeacher, setVerifiedTeacher } from "../../utils/teacherSlice";
import { fetchTeacherLists } from "../../customHooks/useTeacherData";

const EMPTY = [];
const VIEW_KEY = "pm_teacher_view";
const GOOD = 75;
const FAIR = 50;
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/* ---------- helpers ---------- */

const teacherName = (t) => `${t?.firstName || ""} ${t?.lastName || ""}`.trim() || t?.name || "Unnamed teacher";

const initials = (p) => {
  const first = p?.firstName || p?.name || "";
  const last = p?.lastName || (p?.name || "").split(" ")[1] || "";
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "?";
};

const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const timeAgo = (d) => {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (!d || Number.isNaN(diff)) return "";
  if (diff < 60) return "just now";
  const units = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of units) {
    const n = Math.floor(diff / secs);
    if (n >= 1) return `${n} ${label}${n > 1 ? "s" : ""} ago`;
  }
  return "";
};

// Accepts "10:00", "10:00 AM", "2:30pm"
const toMinutes = (t) => {
  const m = String(t || "").match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (!m) return null;
  let h = Number(m[1]) % 24;
  if (m[3]) h = (h % 12) + (m[3].toLowerCase() === "pm" ? 12 : 0);
  return h * 60 + Number(m[2]);
};

const isToday = (cls) => {
  const today = WEEKDAYS[new Date().getDay()];
  return (cls.classDays || []).some((d) => String(d).slice(0, 3).toLowerCase() === today);
};

const liveStatus = (cls) => {
  const start = toMinutes(cls.startTime);
  const end = toMinutes(cls.endTime);
  if (start == null || end == null) return null;
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  if (now < start) {
    const mins = start - now;
    return { label: mins <= 60 ? `Starts in ${mins} min` : "Upcoming", tone: "bg-blue-50 text-[#0A80F5]" };
  }
  if (now <= end) return { label: "In progress", tone: "bg-green-50 text-green-700" };
  return { label: "Finished", tone: "bg-gray-100 text-gray-500" };
};

const pctColor = (p) => (p >= GOOD ? "text-green-600" : p >= FAIR ? "text-amber-600" : "text-red-600");
const pctBar = (p) => (p >= GOOD ? "bg-green-500" : p >= FAIR ? "bg-amber-500" : "bg-red-500");

const errMsg = (err, fallback) =>
  err?.response?.data?.message || (err?.request && !err?.response ? "Network error — check your connection" : fallback);

const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === "table" ? "table" : "grid";
  } catch {
    return "grid";
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.04, duration: 0.3 } }),
};

const useToast = () => {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = useCallback((type, message) => {
    clearTimeout(timer.current);
    setToast({ type, message });
    timer.current = setTimeout(() => setToast(null), 3500);
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

/* ---------- shared UI ---------- */

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

const Modal = ({ onClose, children, labelledBy, width = "max-w-md" }) => {
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

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className={`relative z-10 w-full sm:w-[92%] ${width} bg-white rounded-t-2xl sm:rounded-xl shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ConfirmDialog = ({ config, onClose }) => {
  const [busy, setBusy] = useState(false);
  const danger = config.tone === "danger";
  const run = async () => {
    setBusy(true);
    try {
      await config.run();
    } finally {
      setBusy(false);
      onClose();
    }
  };
  return (
    <Modal onClose={busy ? () => {} : onClose} labelledBy="confirm-title">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${danger ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="confirm-title" className="font-semibold text-gray-900">
              {config.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{config.message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={run}
            disabled={busy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Avatar = ({ person, size = "w-11 h-11", text = "text-sm", gradient = "from-[#0BCCEB] to-[#0A80F5]" }) =>
  person?.profilePicUrl ? (
    <img src={person.profilePicUrl} alt={teacherName(person)} className={`${size} rounded-full object-cover shrink-0 bg-gray-100`} />
  ) : (
    <div className={`${size} ${text} rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-semibold shrink-0`}>
      {initials(person)}
    </div>
  );

const STATUS = {
  verified: { label: "Approved", cls: "bg-green-50 text-green-700", icon: BadgeCheck },
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700", icon: Clock },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700", icon: X },
};

const StatusChip = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${s.cls}`}>
      <s.icon className="w-3.5 h-3.5" /> {s.label}
    </span>
  );
};

const StatTile = ({ label, value, sub, icon: Icon, gradient, onClick, active }) => {
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
      <div className="mt-3 text-3xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </Tag>
  );
};

const EmptyState = ({ icon: Icon = Inbox, title, text, action }) => (
  <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
    <Icon className="w-8 h-8 text-gray-300" />
    <div className="font-medium text-gray-700">{title}</div>
    {text && <div className="text-sm text-gray-500 max-w-md">{text}</div>}
    {action}
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="py-12 flex flex-col items-center text-center gap-3">
    <AlertCircle className="w-8 h-8 text-red-500" />
    <div className="text-gray-700">{message}</div>
    <button onClick={onRetry} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
      Try again
    </button>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-gray-100" />
      <div className="flex-1">
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="h-3 w-1/3 bg-gray-100 rounded mt-2" />
      </div>
    </div>
    <div className="h-3 w-3/4 bg-gray-100 rounded mt-5" />
    <div className="h-3 w-1/2 bg-gray-100 rounded mt-2" />
    <div className="h-9 w-full bg-gray-100 rounded-lg mt-6" />
  </div>
);

const PctBar = ({ value }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden min-w-[60px]">
      <div className={`h-full ${pctBar(value)}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
    <span className={`text-sm font-semibold w-12 text-right ${pctColor(value)}`}>{Math.round(value)}%</span>
  </div>
);

const Segmented = ({ value, onChange, options }) => (
  <div role="tablist" className="inline-flex p-1 bg-gray-50 rounded-lg border border-gray-100 w-fit shrink-0">
    {options.map(([id, label, count]) => (
      <button
        key={id}
        role="tab"
        aria-selected={value === id}
        onClick={() => onChange(id)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
          value === id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-800"
        }`}
      >
        {label}
        {count !== undefined && <span className="ml-1 text-gray-400 font-normal">{count}</span>}
      </button>
    ))}
  </div>
);

const SearchInput = ({ value, onChange, placeholder, className = "" }) => (
  <div className={`relative ${className}`}>
    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0A80F5]"
    />
    {value && (
      <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear search">
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

const BackLink = ({ onClick, children }) => (
  <button onClick={onClick} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
    <ArrowLeft className="w-4 h-4" /> {children}
  </button>
);

/* ---------- Teacher list ---------- */

const TeacherActions = ({ t, pending, busy, onOpen, onApprove, onReject, compact }) =>
  pending ? (
    <div className={`flex gap-2 ${compact ? "" : "w-full"}`}>
      <button
        onClick={() => onApprove(t)}
        disabled={!!busy}
        className={`${compact ? "" : "flex-1"} inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60`}
      >
        {busy === "verified" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Approve
      </button>
      <button
        onClick={() => onReject(t)}
        disabled={!!busy}
        className={`${compact ? "" : "flex-1"} inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60`}
      >
        {busy === "rejected" ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        Reject
      </button>
      <button
        onClick={() => onOpen(t)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        aria-label={`View ${teacherName(t)}`}
        title="View details"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <div className={`flex gap-2 ${compact ? "" : "w-full"}`}>
      <button
        onClick={() => onOpen(t)}
        className={`${compact ? "" : "flex-1"} inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] hover:opacity-95`}
      >
        <Eye className="w-4 h-4" /> View profile
      </button>
      {t.emailId && (
        <a
          href={`mailto:${t.emailId}`}
          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          aria-label={`Email ${teacherName(t)}`}
          title="Send email"
        >
          <Mail className="w-4 h-4" />
        </a>
      )}
    </div>
  );

const TeacherCard = ({ t, i, pending, selected, onToggle, busy, ...actions }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={i}
    className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col ${
      selected ? "border-[#0A80F5] ring-2 ring-blue-100" : "border-gray-100"
    }`}
  >
    <div className="flex items-start gap-3">
      {pending && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(t.teacherId)}
          className="mt-3 w-4 h-4 accent-[#0A80F5]"
          aria-label={`Select ${teacherName(t)}`}
        />
      )}
      <button onClick={() => actions.onOpen(t)} className="flex items-center gap-3 min-w-0 flex-1 text-left group">
        <Avatar person={t} gradient={pending ? "from-amber-400 to-orange-500" : undefined} />
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate group-hover:text-[#0A80F5]">{teacherName(t)}</div>
          <div className="text-sm text-gray-500 truncate">{t.department || t.specialization || "Teacher"}</div>
        </div>
      </button>
      <StatusChip status={pending ? "pending" : "verified"} />
    </div>

    <div className="mt-4 space-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2 min-w-0">
        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="truncate">{t.emailId || "—"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
        {t.phone ? (
          <a href={`tel:${t.phone}`} className="hover:text-[#0A80F5]">
            {t.phone}
          </a>
        ) : (
          "—"
        )}
      </div>
      {t.hotspotName && (
        <div className="flex items-center gap-2 min-w-0">
          <Wifi className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{t.hotspotName}</span>
        </div>
      )}
    </div>

    {(t.qualification || t.experience || t.specialization) && (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[t.specialization, t.qualification, t.experience && `${t.experience} yrs exp`].filter(Boolean).map((c) => (
          <span key={c} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0A80F5]">
            {c}
          </span>
        ))}
      </div>
    )}

    <div className="text-xs text-gray-400 mt-3" title={formatDate(t.createdAt)}>
      {pending ? "Applied" : "Joined"} {timeAgo(t.createdAt) || formatDate(t.createdAt)}
    </div>

    <div className="mt-auto pt-4">
      <TeacherActions t={t} pending={pending} busy={busy} {...actions} />
    </div>
  </motion.div>
);

const TeacherTable = ({ rows, pending, selectedIds, onToggle, onToggleAll, busyMap, ...actions }) => {
  const allSelected = rows.length > 0 && rows.every((t) => selectedIds.has(t.teacherId));
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead className="bg-gray-50">
          <tr>
            {pending && (
              <th className="pl-4 py-3 w-8">
                <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="w-4 h-4 accent-[#0A80F5]" aria-label="Select all" />
              </th>
            )}
            {["Teacher", "Phone", "Hotspot", pending ? "Applied" : "Joined", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((t) => (
            <tr key={t.teacherId} className={`hover:bg-gray-50/60 ${selectedIds.has(t.teacherId) ? "bg-blue-50/40" : ""}`}>
              {pending && (
                <td className="pl-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(t.teacherId)}
                    onChange={() => onToggle(t.teacherId)}
                    className="w-4 h-4 accent-[#0A80F5]"
                    aria-label={`Select ${teacherName(t)}`}
                  />
                </td>
              )}
              <td className="px-4 py-3">
                <button onClick={() => actions.onOpen(t)} className="flex items-center gap-3 text-left group">
                  <Avatar person={t} size="w-9 h-9" text="text-xs" gradient={pending ? "from-amber-400 to-orange-500" : undefined} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-[#0A80F5]">{teacherName(t)}</div>
                    <div className="text-xs text-gray-500">{t.emailId}</div>
                  </div>
                </button>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{t.phone || "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{t.hotspotName || "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600" title={formatDate(t.createdAt)}>
                {formatDate(t.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <TeacherActions t={t} pending={pending} busy={busyMap[t.teacherId]} compact {...actions} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InviteDialog = ({ user, onClose, notify }) => (
  <Modal onClose={onClose} labelledBy="invite-title">
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-2 rounded-xl text-white">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 id="invite-title" className="font-semibold text-gray-900">
              Add teachers to {user?.InstitutionName || "your institution"}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">Teachers create their own account in the Present Me app.</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      <ol className="mt-6 space-y-4">
        {[
          [Smartphone, "Install the app", "Ask the teacher to install Present Me on their phone."],
          [UserPlus, "Sign up as a teacher", `During sign-up they select "${user?.InstitutionName || "your institution"}" from the list of institutions.`],
          [BadgeCheck, "Approve them here", "Their request appears in the Pending tab. Approve it and they can sign in and create classes."],
        ].map(([Icon, title, text], idx) => (
          <li key={title} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A80F5] flex items-center justify-center text-sm font-semibold shrink-0">{idx + 1}</div>
            <div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-gray-400" /> {title}
              </div>
              <div className="text-sm text-gray-500">{text}</div>
            </div>
          </li>
        ))}
      </ol>

      {user?.institutionId && (
        <div className="mt-6 rounded-lg bg-gray-50 border border-gray-100 p-3">
          <div className="text-xs text-gray-500 mb-1">Institution ID (for support or verification)</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs truncate">{user.institutionId}</code>
            <button onClick={() => copyText(user.institutionId, notify, "Institution ID")} className="p-1.5 rounded-md text-gray-500 hover:bg-white" aria-label="Copy institution ID">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button onClick={onClose} className="mt-6 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] hover:opacity-95">
        Got it
      </button>
    </div>
  </Modal>
);

const TeacherListView = ({ pending, verified, busyMap, refreshing, onRefresh, onOpen, onApprove, onReject, onBulk, onInvite }) => {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "pending" ? "pending" : "approved";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [view, setView] = useState(readView);
  const [selected, setSelected] = useState(() => new Set());

  const setTab = (next) => {
    setSelected(new Set());
    setParams(next === "pending" ? { tab: "pending" } : {}, { replace: true });
  };

  const changeView = (v) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const filterSort = useCallback(
    (list) => {
      const q = query.trim().toLowerCase();
      return list
        .filter(
          (t) =>
            !q ||
            [teacherName(t), t.emailId, t.phone, t.department, t.hotspotName, t.specialization].some((v) =>
              String(v || "").toLowerCase().includes(q)
            )
        )
        .sort((a, b) => {
          if (sort === "newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
          if (sort === "oldest") return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
          return teacherName(a).localeCompare(teacherName(b));
        });
    },
    [query, sort]
  );

  const visibleVerified = useMemo(() => filterSort(verified), [verified, filterSort]);
  const visiblePending = useMemo(() => filterSort(pending), [pending, filterSort]);
  const rows = tab === "pending" ? visiblePending : visibleVerified;
  const isPending = tab === "pending";

  // Only keep selections that are still visible pending teachers
  const selectedIds = useMemo(() => new Set(visiblePending.filter((t) => selected.has(t.teacherId)).map((t) => t.teacherId)), [visiblePending, selected]);
  const selectedTeachers = visiblePending.filter((t) => selectedIds.has(t.teacherId));

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(selectedIds.size === visiblePending.length ? new Set() : new Set(visiblePending.map((t) => t.teacherId)));

  const recent = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    return [...verified, ...pending].filter((t) => new Date(t.createdAt).getTime() >= cutoff).length;
  }, [verified, pending]);

  const exportTeachers = () => {
    const ws = XLSX.utils.json_to_sheet(
      rows.map((t, idx) => ({
        "#": idx + 1,
        Name: teacherName(t),
        Email: t.emailId || "",
        Phone: t.phone || "",
        Department: t.department || "",
        Hotspot: t.hotspotName || "",
        Status: isPending ? "Pending" : "Approved",
        [isPending ? "Applied on" : "Joined on"]: formatDate(t.createdAt),
      }))
    );
    ws["!cols"] = [{ wch: 5 }, { wch: 24 }, { wch: 30 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, isPending ? "Pending teachers" : "Teachers");
    XLSX.writeFile(wb, `${isPending ? "pending_" : ""}teachers_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const actions = { onOpen, onApprove, onReject };
  const filtersActive = !!query.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Teachers</h2>
          <p className="text-sm text-gray-500 mt-1">Approve new teachers and see their classes and attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={onInvite}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] hover:opacity-95"
          >
            <UserPlus className="w-4 h-4" /> Add teachers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total teachers" value={verified.length + pending.length} icon={Users} gradient="from-[#0BCCEB] to-[#0A80F5]" />
        <StatTile label="Approved" value={verified.length} icon={UserCheck} gradient="from-emerald-400 to-green-600" onClick={() => setTab("approved")} active={tab === "approved"} />
        <StatTile
          label="Pending approval"
          value={pending.length}
          sub={pending.length ? "Needs your review" : "All caught up"}
          icon={Clock}
          gradient="from-amber-400 to-orange-500"
          onClick={() => setTab("pending")}
          active={tab === "pending"}
        />
        <StatTile label="New in last 30 days" value={recent} icon={CalendarPlus} gradient="from-[#9f7aea] to-[#6b46c1]" />
      </div>

      {tab === "approved" && pending.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Clock className="w-4 h-4 shrink-0" />
            {pending.length} teacher{pending.length > 1 ? "s are" : " is"} waiting for your approval.
          </div>
          <button onClick={() => setTab("pending")} className="text-sm font-medium text-amber-800 hover:underline w-fit">
            Review now →
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-3 lg:items-center">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            ["approved", "Approved", verified.length],
            ["pending", "Pending", pending.length],
          ]}
        />
        <SearchInput value={query} onChange={setQuery} placeholder="Search name, email, phone, department or hotspot" className="flex-1" />
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 lg:w-36 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
            aria-label="Sort teachers"
          >
            <option value="name">Name A–Z</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <div className="inline-flex p-1 bg-gray-50 rounded-lg border border-gray-100">
            {[
              ["grid", LayoutGrid, "Card view"],
              ["table", List, "Table view"],
            ].map(([id, Icon, label]) => (
              <button
                key={id}
                onClick={() => changeView(id)}
                aria-label={label}
                title={label}
                aria-pressed={view === id}
                className={`p-1.5 rounded-md ${view === id ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <button
            onClick={exportTeachers}
            disabled={!rows.length}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            aria-label="Export to Excel"
            title="Export this list to Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isPending && visiblePending.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={selectedIds.size > 0 && selectedIds.size === visiblePending.length}
              onChange={toggleAll}
              className="w-4 h-4 accent-[#0A80F5]"
            />
            Select all
          </label>
          {selectedIds.size > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-gray-700">{selectedIds.size} selected</span>
              <button
                onClick={() => onBulk(selectedTeachers, "verified", () => setSelected(new Set()))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" /> Approve selected
              </button>
              <button
                onClick={() => onBulk(selectedTeachers, "rejected", () => setSelected(new Set()))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" /> Reject selected
              </button>
              <button onClick={() => setSelected(new Set())} className="text-gray-500 hover:text-gray-800">
                Clear
              </button>
            </>
          )}
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon={isPending ? CheckCircle2 : Users}
          title={
            filtersActive ? "No teachers match your search" : isPending ? "No pending requests" : "No approved teachers yet"
          }
          text={
            filtersActive
              ? "Try a different name, email or phone number."
              : isPending
              ? "New teacher sign-ups for your institution will show up here for approval."
              : "Once you approve teachers, they'll appear here."
          }
          action={
            filtersActive ? (
              <button onClick={() => setQuery("")} className="mt-2 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                Clear search
              </button>
            ) : !isPending ? (
              <button onClick={onInvite} className="mt-2 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                How to add teachers
              </button>
            ) : null
          }
        />
      ) : view === "table" ? (
        <TeacherTable
          rows={rows}
          pending={isPending}
          selectedIds={selectedIds}
          onToggle={toggle}
          onToggleAll={toggleAll}
          busyMap={busyMap}
          {...actions}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((t, i) => (
            <TeacherCard
              key={t.teacherId}
              t={t}
              i={i}
              pending={isPending}
              selected={selectedIds.has(t.teacherId)}
              onToggle={toggle}
              busy={busyMap[t.teacherId]}
              {...actions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- Teacher details ---------- */

const InfoRow = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <div className="text-xs text-gray-500">{label}</div>
      {value ? (
        href ? (
          <a href={href} className="text-sm font-medium text-[#0A80F5] hover:underline break-all">
            {value}
          </a>
        ) : (
          <div className="text-sm font-medium text-gray-900 break-words">{value}</div>
        )
      ) : (
        <div className="text-sm text-gray-400 italic">Not provided</div>
      )}
    </div>
  </div>
);

const InfoCard = ({ title, children }) => (
  <div className="rounded-xl border border-gray-100 p-5">
    <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
    <div className="divide-y divide-gray-50">{children}</div>
  </div>
);

const TeacherClassCard = ({ cls, i, onOpen, onCopy, showLive }) => {
  const live = showLive && cls.isActive !== false ? liveStatus(cls) : null;
  const today = WEEKDAYS[new Date().getDay()];
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={i}
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 truncate" title={cls.className}>
            {cls.className || "Untitled class"}
          </h4>
          <button
            onClick={() => onCopy(cls.classCode)}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#0A80F5] bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100"
            title="Copy class code"
          >
            {cls.classCode} <Copy className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls.isActive !== false ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            {cls.isActive !== false ? "Active" : "Inactive"}
          </span>
          {live && <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${live.tone}`}>{live.label}</span>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
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
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400 shrink-0" />
          {cls.totalStudents ?? cls.students?.length ?? 0} students
        </span>
        <span className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-gray-400 shrink-0" />
          {cls.totalClasses ?? 0} sessions
        </span>
      </div>

      {cls.classDays?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cls.classDays.map((d) => {
            const isNow = String(d).slice(0, 3).toLowerCase() === today;
            return (
              <span
                key={d}
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  isNow ? "bg-blue-50 border-blue-100 text-[#0A80F5] font-medium" : "bg-gray-50 border-gray-100 text-gray-600"
                }`}
              >
                {String(d).slice(0, 3)}
              </span>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <div className="text-xs text-gray-500 mb-1">Average attendance</div>
        {cls.totalClasses ? <PctBar value={Number(cls.averageAttendance) || 0} /> : <div className="text-xs text-gray-400">No sessions taken yet</div>}
      </div>

      <button
        onClick={() => onOpen(cls)}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
      >
        <Users className="w-4 h-4" /> View students
      </button>
    </motion.div>
  );
};

const TeacherDetails = ({ teacher, isPending, busy, getClasses, onBack, onOpenClass, onApprove, onReject, onRevoke, notify }) => {
  const [state, setState] = useState({ loading: true, error: null, classes: EMPTY });
  const [tab, setTab] = useState("overview");
  const [classFilter, setClassFilter] = useState("active");
  const [query, setQuery] = useState("");

  const load = useCallback(
    async (force = false) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        setState({ loading: false, error: null, classes: await getClasses(teacher.teacherId, force) });
      } catch (err) {
        setState({ loading: false, error: errMsg(err, "Couldn't load classes"), classes: EMPTY });
      }
    },
    [teacher.teacherId, getClasses]
  );

  useEffect(() => {
    load();
  }, [load]);

  const { classes } = state;
  const active = classes.filter((c) => c.isActive !== false);
  const todays = useMemo(
    () => classes.filter((c) => c.isActive !== false && isToday(c)).sort((a, b) => (toMinutes(a.startTime) ?? 0) - (toMinutes(b.startTime) ?? 0)),
    [classes]
  );

  const stats = useMemo(() => {
    const withSessions = classes.filter((c) => c.totalClasses > 0);
    return {
      students: active.reduce((n, c) => n + (c.totalStudents ?? c.students?.length ?? 0), 0),
      sessions: classes.reduce((n, c) => n + (c.totalClasses || 0), 0),
      avg: withSessions.length ? Math.round(withSessions.reduce((n, c) => n + (Number(c.averageAttendance) || 0), 0) / withSessions.length) : null,
    };
  }, [classes, active]);

  const visibleClasses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes
      .filter((c) => classFilter === "all" || (classFilter === "active" ? c.isActive !== false : c.isActive === false))
      .filter((c) => !q || [c.className, c.classCode, c.roomNo].some((v) => String(v || "").toLowerCase().includes(q)))
      .sort((a, b) => String(a.className || "").localeCompare(String(b.className || ""), undefined, { numeric: true }));
  }, [classes, classFilter, query]);

  const copyCode = (code) => copyText(code, notify, `Class code ${code}`);
  const todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-6">
      <BackLink onClick={onBack}>All teachers</BackLink>

      {/* Hero */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className={`h-24 bg-gradient-to-r ${isPending ? "from-amber-300 via-amber-400 to-orange-400" : "from-[#0BCCEB] via-[#0A80F5] to-[#6b46c1]"}`} />
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10">
            <div className="ring-4 ring-white rounded-full w-fit">
              <Avatar person={teacher} size="w-20 h-20" text="text-2xl" gradient={isPending ? "from-amber-400 to-orange-500" : undefined} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900 truncate">{teacherName(teacher)}</h2>
                <StatusChip status={isPending ? "pending" : "verified"} />
              </div>
              <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {teacher.department && (
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" /> {teacher.department}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> {isPending ? "Applied" : "Joined"} {formatDate(teacher.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.emailId && (
                <a href={`mailto:${teacher.emailId}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
              {teacher.phone && (
                <a href={`tel:${teacher.phone}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Phone className="w-4 h-4" /> Call
                </a>
              )}
              {isPending ? (
                <>
                  <button
                    onClick={() => onApprove(teacher)}
                    disabled={!!busy}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"
                  >
                    {busy === "verified" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Approve
                  </button>
                  <button
                    onClick={() => onReject(teacher)}
                    disabled={!!busy}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onRevoke(teacher)}
                  disabled={!!busy}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                  title="Move this teacher back to pending"
                >
                  {busy === "pending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo2 className="w-4 h-4" />} Revoke approval
                </button>
              )}
            </div>
          </div>
          {isPending && (
            <div className="mt-5 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800">
              <Clock className="w-4 h-4 mt-0.5 shrink-0" />
              This teacher is waiting for approval. Check that their name, email and phone belong to a member of your staff before approving.
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Classes" value={state.loading ? "…" : active.length} sub={state.loading ? null : `${classes.length - active.length} inactive`} icon={BookOpen} gradient="from-[#0BCCEB] to-[#0A80F5]" />
        <StatTile label="Students" value={state.loading ? "…" : stats.students} sub="Across active classes" icon={Users} gradient="from-[#9f7aea] to-[#6b46c1]" />
        <StatTile label="Sessions taken" value={state.loading ? "…" : stats.sessions} icon={ClipboardList} gradient="from-amber-400 to-orange-500" />
        <StatTile label="Avg. attendance" value={state.loading ? "…" : stats.avg == null ? "—" : `${stats.avg}%`} icon={Percent} gradient="from-emerald-400 to-green-600" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-3 border-b border-gray-100">
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              ["overview", "Overview"],
              ["classes", "Classes", state.loading ? "" : classes.length],
              ["today", "Today", state.loading ? "" : todays.length],
            ]}
          />
        </div>

        <div className="p-5">
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <InfoCard title="Contact">
                <InfoRow icon={Mail} label="Email" value={teacher.emailId} href={teacher.emailId && `mailto:${teacher.emailId}`} />
                <InfoRow icon={Phone} label="Phone" value={teacher.phone} href={teacher.phone && `tel:${teacher.phone}`} />
                <div className="flex items-start gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500">Teacher ID</div>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-gray-800 truncate">{teacher.teacherId}</code>
                      <button onClick={() => copyText(teacher.teacherId, notify, "Teacher ID")} className="p-1 rounded text-gray-400 hover:text-gray-700" aria-label="Copy teacher ID">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Professional">
                <InfoRow icon={Briefcase} label="Department" value={teacher.department} />
                <InfoRow icon={GraduationCap} label="Qualification" value={teacher.qualification} />
                <InfoRow icon={BadgeCheck} label="Specialization" value={teacher.specialization} />
                <InfoRow icon={CalendarDays} label="Experience" value={teacher.experience && `${teacher.experience} years`} />
              </InfoCard>
              <InfoCard title="Attendance setup">
                <InfoRow icon={Wifi} label="Hotspot name" value={teacher.hotspotName} />
                <InfoRow icon={MapPin} label="Office location" value={teacher.officeLocation} />
                <InfoRow icon={Hash} label="Employee ID" value={teacher.empId} />
              </InfoCard>
            </div>
          )}

          {tab !== "overview" && state.error && <ErrorState message={state.error} onRetry={() => load(true)} />}

          {tab !== "overview" && !state.error && state.loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((k) => (
                <CardSkeleton key={k} />
              ))}
            </div>
          )}

          {tab === "classes" && !state.loading && !state.error && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Segmented
                  value={classFilter}
                  onChange={setClassFilter}
                  options={[
                    ["active", "Active", active.length],
                    ["inactive", "Inactive", classes.length - active.length],
                    ["all", "All", classes.length],
                  ]}
                />
                <SearchInput value={query} onChange={setQuery} placeholder="Search class, code or room" className="flex-1" />
                <button
                  onClick={() => load(true)}
                  className="self-start sm:self-auto p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                  aria-label="Reload classes"
                  title="Reload"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {visibleClasses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title={classes.length === 0 ? "No classes yet" : query ? "No classes match your search" : `No ${classFilter} classes`}
                  text={classes.length === 0 ? (isPending ? "Teachers can create classes after you approve them." : "Classes this teacher creates in the app will appear here.") : null}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleClasses.map((c, i) => (
                    <TeacherClassCard key={c.classCode} cls={c} i={i} onOpen={onOpenClass} onCopy={copyCode} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "today" && !state.loading && !state.error && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">{todayLabel}</div>
              {todays.length === 0 ? (
                <EmptyState icon={CalendarDays} title="No classes today" text="None of this teacher's active classes are scheduled for today." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todays.map((c, i) => (
                    <TeacherClassCard key={c.classCode} cls={c} i={i} onOpen={onOpenClass} onCopy={copyCode} showLive />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Class students ---------- */

const BANDS = {
  good: { label: `Good (≥${GOOD}%)`, test: (p) => p >= GOOD, badge: "bg-green-50 text-green-700", text: "Good" },
  average: { label: `Average (${FAIR}–${GOOD - 1}%)`, test: (p) => p >= FAIR && p < GOOD, badge: "bg-amber-50 text-amber-700", text: "Average" },
  poor: { label: `Poor (<${FAIR}%)`, test: (p) => p < FAIR, badge: "bg-red-50 text-red-700", text: "Poor" },
};

const bandOf = (s) => {
  if (!s.attendance?.totalClasses) return null;
  const p = s.attendance.percentage;
  return BANDS.good.test(p) ? "good" : BANDS.average.test(p) ? "average" : "poor";
};

const ClassStudents = ({ classCode, teacher, classMeta, onBack, notify }) => {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [query, setQuery] = useState("");
  const [band, setBand] = useState("all");
  const [sort, setSort] = useState("name");

  const load = useCallback(async () => {
    setState({ loading: true, error: null, data: null });
    try {
      const res = await axios.get(`${BaseUrl}/admin/class/${encodeURIComponent(classCode)}/students`, { withCredentials: true });
      setState({ loading: false, error: null, data: res.data?.data });
    } catch (err) {
      setState({ loading: false, error: errMsg(err, "Couldn't load students"), data: null });
    }
  }, [classCode]);

  useEffect(() => {
    load();
  }, [load]);

  const students = state.data?.students || EMPTY;
  const info = { ...classMeta, ...(state.data?.classInfo || {}) };

  const counts = useMemo(() => {
    const c = { good: 0, average: 0, poor: 0, none: 0 };
    students.forEach((s) => c[bandOf(s) || "none"]++);
    const tracked = students.filter((s) => s.attendance?.totalClasses);
    c.avg = tracked.length ? Math.round(tracked.reduce((n, s) => n + s.attendance.percentage, 0) / tracked.length) : null;
    return c;
  }, [students]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pct = (s) => (s.attendance?.totalClasses ? s.attendance.percentage : -1);
    return students
      .filter((s) => band === "all" || (band === "none" ? !bandOf(s) : bandOf(s) === band))
      .filter((s) => !q || [s.name, s.emailId, s.rollNo, s.phone].some((v) => String(v || "").toLowerCase().includes(q)))
      .sort((a, b) => {
        if (sort === "roll") return String(a.rollNo || "").localeCompare(String(b.rollNo || ""), undefined, { numeric: true });
        if (sort === "low") return pct(a) - pct(b);
        if (sort === "high") return pct(b) - pct(a);
        return String(a.name || "").localeCompare(String(b.name || ""));
      });
  }, [students, band, query, sort]);

  const exportStudents = () => {
    const ws = XLSX.utils.json_to_sheet(
      rows.map((s, i) => ({
        "#": i + 1,
        Name: s.name,
        "Roll no": s.rollNo || "",
        Email: s.emailId || "",
        Phone: s.phone || "",
        Present: s.attendance?.present ?? 0,
        Absent: s.attendance?.absent ?? 0,
        Sessions: s.attendance?.totalClasses ?? 0,
        "Attendance %": s.attendance?.totalClasses ? s.attendance.percentage : "",
        Status: BANDS[bandOf(s)]?.text || "No sessions",
      }))
    );
    ws["!cols"] = [{ wch: 5 }, { wch: 24 }, { wch: 12 }, { wch: 30 }, { wch: 15 }, { wch: 9 }, { wch: 9 }, { wch: 9 }, { wch: 13 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `${String(info.className || classCode).replace(/[^a-z0-9_-]+/gi, "_")}_students.xlsx`);
    notify("success", "Student list exported");
  };

  const tiles = [
    ["all", "Students", students.length, Users, "from-[#0BCCEB] to-[#0A80F5]", counts.avg == null ? "No sessions yet" : `Class average ${counts.avg}%`],
    ["good", BANDS.good.label, counts.good, CheckCircle2, "from-emerald-400 to-green-600"],
    ["average", BANDS.average.label, counts.average, Percent, "from-amber-400 to-orange-500"],
    ["poor", BANDS.poor.label, counts.poor, AlertTriangle, "from-rose-400 to-red-600"],
  ];

  return (
    <div className="space-y-6">
      <BackLink onClick={onBack}>Back to {teacherName(teacher)}</BackLink>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-900 truncate">{info.className || classCode}</h2>
              {info.isActive !== undefined && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${info.isActive !== false ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {info.isActive !== false ? "Active" : "Inactive"}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <button onClick={() => copyText(classCode, notify, "Class code")} className="inline-flex items-center gap-1.5 text-[#0A80F5] font-medium hover:underline">
                {classCode} <Copy className="w-3.5 h-3.5" />
              </button>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> {teacherName(teacher)}
              </span>
              {info.startTime && info.endTime && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {info.startTime} – {info.endTime}
                </span>
              )}
              {info.roomNo && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Room {info.roomNo}
                </span>
              )}
              {info.classDays?.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> {info.classDays.map((d) => String(d).slice(0, 3)).join(", ")}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              disabled={state.loading}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Reload students"
              title="Reload"
            >
              <RefreshCw className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={exportStudents}
              disabled={!rows.length}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </motion.div>

      {state.error ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <ErrorState message={state.error} onRetry={load} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tiles.map(([id, label, value, Icon, gradient, sub]) => (
              <StatTile
                key={id}
                label={label}
                value={state.loading ? "…" : value}
                sub={sub}
                icon={Icon}
                gradient={gradient}
                onClick={() => setBand(band === id ? "all" : id)}
                active={band === id && id !== "all"}
              />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-3 border-b border-gray-100 flex flex-col md:flex-row gap-3 md:items-center">
              <SearchInput value={query} onChange={setQuery} placeholder="Search name, roll no, email or phone" className="flex-1" />
              <div className="flex gap-2">
                <select
                  value={band}
                  onChange={(e) => setBand(e.target.value)}
                  className="flex-1 md:w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
                  aria-label="Filter by attendance"
                >
                  <option value="all">All students</option>
                  <option value="good">{BANDS.good.label}</option>
                  <option value="average">{BANDS.average.label}</option>
                  <option value="poor">{BANDS.poor.label}</option>
                  <option value="none">No sessions yet ({counts.none})</option>
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="flex-1 md:w-44 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
                  aria-label="Sort students"
                >
                  <option value="name">Name A–Z</option>
                  <option value="roll">Roll number</option>
                  <option value="low">Lowest attendance</option>
                  <option value="high">Highest attendance</option>
                </select>
              </div>
            </div>

            {state.loading ? (
              <div className="py-16 flex flex-col items-center text-gray-500 gap-3">
                <Loader2 className="w-7 h-7 animate-spin text-[#0A80F5]" />
                Loading students…
              </div>
            ) : rows.length === 0 ? (
              <div className="py-14 text-center">
                <Inbox className="w-8 h-8 text-gray-300 mx-auto" />
                <div className="font-medium text-gray-700 mt-2">{students.length === 0 ? "No students have joined this class yet" : "No students match your filters"}</div>
                {students.length > 0 && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setBand("all");
                    }}
                    className="mt-3 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-gray-50">
                    <tr>
                      {["#", "Student", "Roll no", "Phone", "Present", "Attendance", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((s, idx) => {
                      const b = BANDS[bandOf(s)];
                      const a = s.attendance || {};
                      return (
                        <tr key={s.studentId} className="hover:bg-gray-50/60">
                          <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar person={s} size="w-9 h-9" text="text-xs" gradient="from-[#9f7aea] to-[#6b46c1]" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900">{s.name}</div>
                                {s.emailId && <div className="text-xs text-gray-500">{s.emailId}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{s.rollNo || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {s.phone ? (
                              <a href={`tel:${s.phone}`} className="hover:text-[#0A80F5]">
                                {s.phone}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {a.totalClasses ? (
                              <>
                                <span className="font-medium text-green-600">{a.present}</span>
                                <span className="text-gray-400"> / {a.totalClasses}</span>
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3 w-48">{a.totalClasses ? <PctBar value={a.percentage} /> : <span className="text-xs text-gray-400">No sessions yet</span>}</td>
                          <td className="px-4 py-3">
                            {b ? (
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.badge}`}>{b.text}</span>
                            ) : (
                              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ---------- Page ---------- */

const TeacherList = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const user = useSelector((s) => s.user);
  const pending = useSelector((s) => s.teacher.pendingTeachers) || EMPTY;
  const verified = useSelector((s) => s.teacher.verifiedTeachers) || EMPTY;
  const [params, setParams] = useSearchParams();
  const teacherId = params.get("teacher");
  const classCode = params.get("class");

  const [toast, notify, dismissToast] = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [busyMap, setBusyMap] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const classesCache = useRef(new Map());
  const triedLookup = useRef(false);

  const refresh = useCallback(
    async (silent = false) => {
      setRefreshing(true);
      try {
        await fetchTeacherLists(dispatch);
        classesCache.current.clear();
        if (!silent) notify("success", "Teacher list updated");
      } catch (err) {
        notify("error", errMsg(err, "Couldn't refresh teachers"));
      } finally {
        setRefreshing(false);
      }
    },
    [dispatch, notify]
  );

  const teacher = teacherId ? verified.find((t) => t.teacherId === teacherId) || pending.find((t) => t.teacherId === teacherId) : null;
  const teacherPending = !!teacher && pending.some((t) => t.teacherId === teacherId);

  // Opened via a link or page reload before the lists arrived — fetch once
  useEffect(() => {
    if (teacherId && !teacher && !triedLookup.current) {
      triedLookup.current = true;
      refresh(true);
    }
  }, [teacherId, teacher, refresh]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [teacherId, classCode]);

  const getClasses = useCallback(async (id, force = false) => {
    if (!force && classesCache.current.has(id)) return classesCache.current.get(id);
    const res = await axios.get(`${BaseUrl}/admin/teachers/${encodeURIComponent(id)}/classes`, { withCredentials: true });
    const d = res.data?.data;
    const list = Array.isArray(d) ? d : d?.classes || EMPTY;
    classesCache.current.set(id, list);
    return list;
  }, []);

  // Change status for one or many teachers; keeps the Redux lists in sync.
  const setStatus = useCallback(
    async (list, status) => {
      const ids = list.map((t) => t.teacherId);
      setBusyMap((m) => ({ ...m, ...Object.fromEntries(ids.map((id) => [id, status])) }));
      const results = await Promise.allSettled(
        list.map((t) =>
          axios.patch(`${BaseUrl}/admin/institutes/teachers/${encodeURIComponent(t.teacherId)}/status`, { status }, { withCredentials: true })
        )
      );
      const ok = list.filter((_, i) => results[i].status === "fulfilled");
      const okIds = new Set(ok.map((t) => t.teacherId));

      if (ok.length) {
        // Read fresh state so parallel actions don't overwrite each other
        const { pendingTeachers = [], verifiedTeachers = [] } = store.getState().teacher;
        const moved = ok.map((t) => ({ ...t, status }));
        if (status === "verified") {
          dispatch(setPendingTeacher(pendingTeachers.filter((t) => !okIds.has(t.teacherId))));
          dispatch(setVerifiedTeacher([...moved, ...verifiedTeachers.filter((t) => !okIds.has(t.teacherId))]));
        } else if (status === "rejected") {
          dispatch(setPendingTeacher(pendingTeachers.filter((t) => !okIds.has(t.teacherId))));
        } else if (status === "pending") {
          dispatch(setVerifiedTeacher(verifiedTeachers.filter((t) => !okIds.has(t.teacherId))));
          dispatch(setPendingTeacher([...moved, ...pendingTeachers.filter((t) => !okIds.has(t.teacherId))]));
        }
      }

      setBusyMap((m) => {
        const next = { ...m };
        ids.forEach((id) => delete next[id]);
        return next;
      });

      const verb = { verified: "Approved", rejected: "Rejected", pending: "Moved to pending:" }[status];
      const who = ok.length === 1 ? teacherName(ok[0]) : `${ok.length} teachers`;
      const failed = list.length - ok.length;
      if (failed && !ok.length) {
        notify("error", errMsg(results.find((r) => r.status === "rejected")?.reason, "Couldn't update teacher status"));
      } else if (failed) {
        notify("error", `${verb} ${who}, but ${failed} failed — try again`);
      } else {
        notify("success", `${verb} ${who}`);
      }
      return okIds;
    },
    [dispatch, notify, store]
  );

  const approve = (t) => setStatus([t], "verified");

  const reject = (t) =>
    setConfirm({
      title: `Reject ${teacherName(t)}?`,
      message: "Their request will be removed from your pending list. Only reject people who aren't part of your staff.",
      confirmLabel: "Reject",
      tone: "danger",
      run: async () => {
        const ok = await setStatus([t], "rejected");
        if (ok.has(t.teacherId) && teacherId === t.teacherId) setParams({ tab: "pending" });
      },
    });

  const revoke = (t) =>
    setConfirm({
      title: `Revoke approval for ${teacherName(t)}?`,
      message: "They'll move back to Pending and won't be able to sign in to the app again until you re-approve them. Their classes and attendance are kept.",
      confirmLabel: "Revoke approval",
      tone: "warning",
      run: () => setStatus([t], "pending"),
    });

  const bulk = (list, status, done) => {
    if (!list.length) return;
    if (status === "verified") {
      setStatus(list, status).then(done);
      return;
    }
    setConfirm({
      title: `Reject ${list.length} teacher${list.length > 1 ? "s" : ""}?`,
      message: "Their requests will be removed from your pending list.",
      confirmLabel: `Reject ${list.length}`,
      tone: "danger",
      run: () => setStatus(list, status).then(done),
    });
  };

  const openTeacher = (t) => setParams({ teacher: t.teacherId });
  const closeConfirm = useCallback(() => setConfirm(null), []);
  const closeInvite = useCallback(() => setInviteOpen(false), []);

  let content;
  if (teacherId && !teacher) {
    content = refreshing ? (
      <div className="py-24 flex flex-col items-center text-gray-500 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-[#0A80F5]" />
        Loading teacher…
      </div>
    ) : (
      <EmptyState
        icon={Users}
        title="Teacher not found"
        text="This teacher may have been rejected or removed."
        action={
          <button onClick={() => setParams({})} className="mt-2 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
            Back to all teachers
          </button>
        }
      />
    );
  } else if (teacher && classCode) {
    content = (
      <ClassStudents
        key={classCode}
        classCode={classCode}
        teacher={teacher}
        classMeta={classesCache.current.get(teacher.teacherId)?.find((c) => c.classCode === classCode)}
        onBack={() => setParams({ teacher: teacher.teacherId })}
        notify={notify}
      />
    );
  } else if (teacher) {
    content = (
      <TeacherDetails
        key={teacher.teacherId}
        teacher={teacher}
        isPending={teacherPending}
        busy={busyMap[teacher.teacherId]}
        getClasses={getClasses}
        onBack={() => setParams(teacherPending ? { tab: "pending" } : {})}
        onOpenClass={(c) => setParams({ teacher: teacher.teacherId, class: c.classCode })}
        onApprove={approve}
        onReject={reject}
        onRevoke={revoke}
        notify={notify}
      />
    );
  } else {
    content = (
      <TeacherListView
        pending={pending}
        verified={verified}
        busyMap={busyMap}
        refreshing={refreshing}
        onRefresh={() => refresh()}
        onOpen={openTeacher}
        onApprove={approve}
        onReject={reject}
        onBulk={bulk}
        onInvite={() => setInviteOpen(true)}
      />
    );
  }

  return (
    <>
      {content}
      <AnimatePresence>
        {confirm && <ConfirmDialog key="confirm" config={confirm} onClose={closeConfirm} />}
        {inviteOpen && <InviteDialog key="invite" user={user} onClose={closeInvite} notify={notify} />}
      </AnimatePresence>
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
};

export default TeacherList;
