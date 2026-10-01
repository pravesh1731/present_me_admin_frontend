import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Fingerprint,
  Check,
  X,
  ChevronDown,
  Search,
  Download,
  FileText,
  FileSpreadsheet,
  FileDown,
  Upload,
  Clock,
  Users,
  UserCheck,
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  Megaphone,
  IndianRupee,
  ShieldCheck,
  Signal,
  BatteryFull,
  Hourglass,
  Lock,
  MailCheck,
  Mail,
  Sun,
  Bell,
  Plus,
  User,
  House,
  BarChart3,
  Send,
  EllipsisVertical,
  Pencil,
  Eye,
  Archive,
  Trash2,
  KeyRound,
  LifeBuoy,
  WifiOff,
  ScreenShareOff,
  Router,
} from "lucide-react";

/* Illustrative sample data used inside the mockups only. */
const SAMPLE_SSID = "RahulM-Hotspot";
const SAMPLE_CODE = "482915";
const SAMPLE_STUDENTS = [
  ["Aarav Sharma", "21CS045"],
  ["Diya Verma", "21CS052"],
  ["Kabir Singh", "21CS061"],
  ["Ananya Gupta", "21CS008"],
  ["Rohan Yadav", "21CS033"],
];

/* ---------- frames ---------- */

export const PhoneFrame = ({ children, className = "" }) => (
  <div
    className={`relative w-[260px] h-[540px] shrink-0 rounded-[2.6rem] bg-[#0B1B34] p-[10px] shadow-[0_40px_80px_-30px_rgba(75,123,227,0.55)] ring-1 ring-black/5 ${className}`}
  >
    <div className="absolute top-[17px] left-1/2 -translate-x-1/2 w-[76px] h-[22px] rounded-full bg-[#0B1B34] z-30" />
    <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#F4F8FF] text-[#0B1B34]">
      <div className="absolute top-0 inset-x-0 h-8 px-6 flex items-center justify-between text-[10px] font-semibold z-20 text-white mix-blend-normal">
        <span>10:02</span>
        <span className="flex items-center gap-1">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <BatteryFull className="w-3.5 h-3.5" />
        </span>
      </div>
      {children}
    </div>
  </div>
);

export const BrowserFrame = ({ children, className = "", url = "presentme.in/admin" }) => (
  <div className={`w-full rounded-xl bg-white ring-1 ring-slate-200 shadow-[0_40px_80px_-30px_rgba(11,27,52,0.35)] overflow-hidden ${className}`}>
    <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center gap-2 px-3">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      <div className="ml-3 flex-1 max-w-[260px] h-5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-500 flex items-center px-2 gap-1">
        <Lock className="w-2.5 h-2.5" /> {url}
      </div>
    </div>
    <div className="relative bg-[#F6F8FC] text-[#0B1B34]">{children}</div>
  </div>
);

/* Renders children at a fixed design size and scales them to fit the parent width. */
export const ScaledStage = ({ width, height, children, className = "", maxScale = 1 }) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(maxScale, entry.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, maxScale]);
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ height: height * scale }}>
      <div className="absolute top-0 left-0" style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
};

/* ---------- phone building blocks ---------- */

const AppBar = ({ title, sub }) => (
  <div className="bg-gradient-to-r from-[#7CC8E0] to-[#4B7BE3] text-white px-4 pt-10 pb-4">
    {sub && <div className="text-[10px] opacity-85">{sub}</div>}
    <div className="font-bold text-[15px] leading-tight">{title}</div>
  </div>
);

const Field = ({ label, value, focus, trailing }) => (
  <div>
    <div className="text-[9px] font-semibold text-slate-500 mb-1">{label}</div>
    <div
      className={`h-8 rounded-lg bg-white border px-2.5 flex items-center justify-between text-[11px] ${
        focus ? "border-[#4B7BE3] ring-2 ring-[#4B7BE3]/15" : "border-slate-200"
      }`}
    >
      <span className={value ? "text-[#0B1B34]" : "text-slate-400"}>{value || "—"}</span>
      {trailing}
    </div>
  </div>
);

const Btn = ({ children, tone = "brand", className = "" }) => (
  <div
    className={`h-9 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold ${
      tone === "brand"
        ? "bg-gradient-to-r from-[#7CC8E0] to-[#4B7BE3] text-white shadow-md shadow-[#4B7BE3]/25"
        : tone === "danger"
        ? "bg-red-50 text-red-600 border border-red-100"
        : "bg-white text-[#0B1B34] border border-slate-200"
    } ${className}`}
  >
    {children}
  </div>
);

const Card = ({ children, className = "" }) => <div className={`rounded-2xl bg-white border border-slate-100 shadow-sm ${className}`}>{children}</div>;

const Avatar = ({ name, className = "w-7 h-7" }) => (
  <div className={`${className} rounded-full bg-gradient-to-br from-[#7CC8E0] to-[#4B7BE3] text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
    {name
      .split(" ")
      .map((p) => p[0])
      .join("")}
  </div>
);

const Bar = ({ pct, tone }) => (
  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
    <div className={`h-full rounded-full ${tone || (pct >= 75 ? "bg-emerald-500" : "bg-amber-500")}`} style={{ width: `${pct}%` }} />
  </div>
);

const WifiRings = ({ connected }) => (
  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className={`absolute inset-0 rounded-full border-2 ${connected ? "border-emerald-400" : "border-[#4B7BE3]"}`}
        initial={{ scale: 0.4, opacity: 0.7 }}
        animate={{ scale: 1.15, opacity: 0 }}
        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
      />
    ))}
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${connected ? "bg-emerald-500" : "bg-[#4B7BE3]"}`}>
      <Wifi className="w-7 h-7" />
    </div>
  </div>
);

/* ---------- student screens ---------- */

const StudentSignup = () => (
  <>
    <AppBar title="Create Student Account" sub="Join Present-Me to track your attendance" />
    <div className="p-4 space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        <Field label="First name" value="Aarav" />
        <Field label="Last name" value="Sharma" />
      </div>
      <Field label="Email address" value="aarav@college.edu" />
      <div>
        <Field label="Institute" value="Search Institute" focus trailing={<ChevronDown className="w-3.5 h-3.5 text-slate-400" />} />
        <div className="mt-1 rounded-lg bg-white border border-slate-200 shadow-lg overflow-hidden text-[10.5px]">
          <div className="px-2.5 py-2 bg-[#EEF5FF] text-[#4B7BE3] font-semibold">Institute of Technology</div>
          <div className="px-2.5 py-2 text-slate-600">City Engineering College</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Roll no" value="21CS045" />
        <Field label="Semester" value="5th Semester" />
      </div>
      <Btn className="mt-1">Create Account</Btn>
      <p className="text-[9.5px] text-center text-slate-500">We'll email you a link to verify your account</p>
    </div>
  </>
);

const StudentJoin = () => (
  <>
    <AppBar title="Join Class" sub="Enter the class code to join" />
    <div className="p-4">
      <div className="text-[10px] font-semibold text-slate-500 mb-2">6-Digit Class Code</div>
      <div className="grid grid-cols-6 gap-1.5">
        {SAMPLE_CODE.split("").map((c, i) => (
          <div key={i} className="h-10 rounded-lg bg-white border-2 border-[#4B7BE3]/40 flex items-center justify-center font-extrabold text-[15px]">
            {c}
          </div>
        ))}
      </div>
      <Btn className="mt-4">Join Class</Btn>
      <Card className="mt-5 p-3 flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Hourglass className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[11px] font-bold">Join request sent</div>
          <div className="text-[10px] text-slate-500">Data Structures · waiting for your teacher to approve</div>
        </div>
      </Card>
    </div>
  </>
);

const StudentHotspot = () => (
  <>
    <AppBar title="Data Structures" sub="Room 301 · 10:00 – 11:00 AM" />
    <div className="p-4">
      <Card className="p-4 text-center">
        <WifiRings connected />
        <div className="mt-3 text-[12px] font-bold">Connected to class hotspot</div>
        <div className="mt-1 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
          <Wifi className="w-3 h-3" /> {SAMPLE_SSID}
        </div>
        <p className="mt-2 text-[10px] text-slate-500">Connected to correct Wi-Fi. Your teacher has enabled attendance.</p>
      </Card>
      <Btn className="mt-4">
        <Fingerprint className="w-3.5 h-3.5" /> Authenticate & Mark Attendance
      </Btn>
      <p className="mt-3 text-[9px] text-center text-slate-400">One mark per class per day</p>
    </div>
  </>
);

const StudentVerify = () => (
  <>
    <StudentHotspot />
    <div className="absolute inset-0 bg-[#0B1B34]/45 flex items-end">
      <motion.div initial={{ y: 60 }} animate={{ y: 0 }} className="w-full bg-white rounded-t-3xl p-5 pb-8 text-center">
        <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-4" />
        <div className="text-[12px] font-bold">Authenticate to mark attendance</div>
        <motion.div
          className="mt-4 w-16 h-16 mx-auto rounded-full bg-[#EEF5FF] text-[#4B7BE3] flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          <Fingerprint className="w-9 h-9" />
        </motion.div>
        <div className="mt-3 text-[10px] text-slate-500">Touch the fingerprint sensor</div>
      </motion.div>
    </div>
  </>
);

const StudentMarked = () => (
  <>
    <AppBar title="Data Structures" sub="Room 301 · 10:00 – 11:00 AM" />
    <div className="p-4 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="mt-6 w-20 h-20 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
      >
        <Check className="w-10 h-10" strokeWidth={3} />
      </motion.div>
      <div className="mt-4 text-[15px] font-extrabold">You're marked present</div>
      <div className="text-[10.5px] text-slate-500 mt-1">Today at 10:02 AM</div>
      <Card className="mt-6 p-3 text-left">
        <div className="flex justify-between text-[10.5px]">
          <span className="text-slate-500">This month</span>
          <span className="font-bold text-emerald-600">18 / 20 · 90%</span>
        </div>
        <div className="mt-2">
          <Bar pct={90} />
        </div>
      </Card>
    </div>
  </>
);

const Ring = ({ pct }) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#E6EEF9" strokeWidth="8" />
      <motion.circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct / 100) }}
        transition={{ duration: 1 }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#7CC8E0" />
          <stop offset="1" stopColor="#4B7BE3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const StudentStats = () => (
  <>
    <AppBar title="My attendance" sub="Semester 5" />
    <div className="p-4">
      <Card className="p-4 flex items-center gap-4">
        <div className="relative">
          <Ring pct={86} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[17px] font-extrabold">86%</span>
            <span className="text-[8px] text-slate-500">overall</span>
          </div>
        </div>
        <div className="text-[10px] space-y-1">
          <div>
            <span className="font-bold">62</span> <span className="text-slate-500">present</span>
          </div>
          <div>
            <span className="font-bold">10</span> <span className="text-slate-500">absent</span>
          </div>
          <div>
            <span className="font-bold">4</span> <span className="text-slate-500">classes</span>
          </div>
        </div>
      </Card>
      <div className="mt-3 space-y-2">
        {[
          ["Data Structures", 90],
          ["DBMS", 88],
          ["Operating Systems", 84],
          ["Discrete Maths", 71],
        ].map(([n, p]) => (
          <Card key={n} className="p-2.5">
            <div className="flex justify-between text-[10.5px] mb-1.5">
              <span className="font-semibold">{n}</span>
              <span className={`font-bold ${p >= 75 ? "text-emerald-600" : "text-amber-600"}`}>{p}%</span>
            </div>
            <Bar pct={p} />
          </Card>
        ))}
      </div>
    </div>
  </>
);

const StudentWallet = () => (
  <>
    <AppBar title="Wallet" sub="Rewards from your uploads" />
    <div className="p-4">
      <div className="rounded-2xl p-4 text-white bg-[#0B1B34]">
        <div className="text-[10px] opacity-70">Available balance</div>
        <div className="text-[26px] font-extrabold flex items-center">
          <IndianRupee className="w-5 h-5" />
          120
        </div>
        <Btn className="mt-3 !h-8">Withdraw to UPI</Btn>
      </div>
      <div className="text-[10px] font-semibold text-slate-500 mt-4 mb-2">Recent activity</div>
      <div className="space-y-2">
        {[
          ["Notes / PYQ reward", "DBMS Unit 3 notes", "+₹20", true],
          ["Notes / PYQ reward", "Maths 2024 PYQ", "+₹20", true],
          ["Withdrawal", "UPI transfer", "−₹50", false],
        ].map(([t, s, amt, credit], i) => (
          <Card key={i} className="p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10.5px] font-bold">{t}</div>
              <div className="text-[9px] text-slate-500">{s}</div>
            </div>
            <span className={`text-[11px] font-bold ${credit ? "text-emerald-600" : "text-slate-600"}`}>{amt}</span>
          </Card>
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-3 text-center">Minimum withdrawal ₹10</p>
    </div>
  </>
);

/* ---------- teacher screens ---------- */

const TeacherPending = () => (
  <>
    <AppBar title="Almost there" sub="Teacher account" />
    <div className="p-5 text-center">
      <div className="mt-6 w-20 h-20 mx-auto rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
        <Hourglass className="w-9 h-9" />
      </div>
      <div className="mt-4 text-[14px] font-extrabold">Waiting for approval</div>
      <p className="mt-2 text-[10.5px] text-slate-500 leading-relaxed">
        Your institute's admin needs to approve your account. You'll be able to create classes as soon as they do.
      </p>
      <Card className="mt-6 p-3 text-left space-y-1.5 text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Institute</span>
          <span className="font-bold">Institute of Technology</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Status</span>
          <span className="font-bold text-amber-600">Pending</span>
        </div>
      </Card>
    </div>
  </>
);

const TeacherCreate = () => (
  <>
    <AppBar title="Create class" sub="New class" />
    <div className="p-4 space-y-2.5">
      <Field label="Class name" value="Data Structures" />
      <Field label="Room" value="301" />
      <div>
        <div className="text-[9px] font-semibold text-slate-500 mb-1">Days</div>
        <div className="flex gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => {
            const on = ["Mon", "Wed", "Fri"].includes(d);
            return (
              <span
                key={d}
                className={`flex-1 h-7 rounded-lg text-[9.5px] font-bold flex items-center justify-center ${
                  on ? "bg-[#4B7BE3] text-white" : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                {d}
              </span>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Starts" value="10:00 AM" />
        <Field label="Ends" value="11:00 AM" />
      </div>
      <Btn className="mt-2">Create class</Btn>
      <Card className="p-3 flex items-center justify-between">
        <div>
          <div className="text-[9px] text-slate-500">Class code</div>
          <div className="text-[16px] font-extrabold tracking-[0.2em]">{SAMPLE_CODE}</div>
        </div>
        <span className="text-[10px] font-bold text-[#4B7BE3]">Share</span>
      </Card>
    </div>
  </>
);

const TeacherRequests = () => (
  <>
    <AppBar title="Join Requests" sub="Data Structures" />
    <div className="p-4 space-y-2">
      <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
        <UserCheck className="w-3.5 h-3.5 text-[#4B7BE3]" /> Pending Requests (4)
      </div>
      {SAMPLE_STUDENTS.slice(0, 4).map(([n, r]) => (
        <Card key={r} className="p-2.5 flex items-center gap-2.5">
          <Avatar name={n} />
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-bold truncate">{n}</div>
            <div className="text-[9px] text-slate-500">Roll No: {r}</div>
          </div>
          <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <X className="w-3 h-3" />
          </span>
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3 h-3" />
          </span>
        </Card>
      ))}
    </div>
  </>
);

const TeacherSession = () => {
  const [count, setCount] = useState(24);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c >= 38 ? 38 : c + 1)), 450);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <AppBar title="Smart Attendance" sub="WiFi/Hotspot Based Attendance" />
      <div className="p-4">
        <Card className="p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Router className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-slate-500">Hotspot Status · Connected</div>
            <div className="text-[11px] font-bold truncate">{SAMPLE_SSID}</div>
          </div>
          <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Session active</span>
        </Card>
        <Card className="mt-3 p-4 text-center">
          <div className="text-[10px] text-slate-500">Present Students · Data Structures</div>
          <div className="text-[30px] font-extrabold leading-none mt-1">
            {count}
            <span className="text-[14px] text-slate-400 font-bold"> / 40</span>
          </div>
          <div className="mt-3">
            <Bar pct={(count / 40) * 100} tone="bg-gradient-to-r from-[#7CC8E0] to-[#4B7BE3]" />
          </div>
        </Card>
        <div className="mt-3 space-y-1.5">
          {SAMPLE_STUDENTS.slice(0, 3).map(([n, r], i) => (
            <motion.div key={r} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.35 }}>
              <Card className="p-2 flex items-center gap-2">
                <Avatar name={n} className="w-6 h-6" />
                <span className="text-[10px] font-semibold flex-1">{n}</span>
                <span className="text-[9px] text-slate-400">10:0{2 + i}</span>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              </Card>
            </motion.div>
          ))}
        </div>
        <Btn tone="danger" className="mt-3">
          Disable Attendance
        </Btn>
      </div>
    </>
  );
};

const TeacherManual = () => (
  <>
    <AppBar title="Manual Attendance" sub="Data Structures · Thursday, October 1, 2026" />
    <div className="p-4 space-y-2">
      {SAMPLE_STUDENTS.map(([n, r], i) => {
        const present = i !== 2;
        return (
          <Card key={r} className="p-2.5 flex items-center gap-2.5">
            <Avatar name={n} />
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] font-bold truncate">{n}</div>
              <div className="text-[9px] text-slate-500">{r}</div>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-[9.5px] font-bold">
              <span className={`px-2 py-1 rounded-md ${present ? "bg-emerald-500 text-white" : "text-slate-500"}`}>P</span>
              <span className={`px-2 py-1 rounded-md ${!present ? "bg-red-500 text-white" : "text-slate-500"}`}>A</span>
            </div>
          </Card>
        );
      })}
      <Btn className="mt-2">Submit Attendance</Btn>
    </div>
  </>
);

const TeacherReport = () => (
  <>
    <AppBar title="Download Attendance" sub="Export attendance records" />
    <div className="p-4 space-y-2.5">
      {[
        ["Data Structures", "40 students", "pdf"],
        ["DBMS", "38 students", null],
        ["Operating Systems", "42 students", null],
      ].map(([n, c, busy]) => (
        <Card key={n} className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-bold">{n}</div>
              <div className="text-[9px] text-slate-500">{c} · September 2026</div>
            </div>
            <span className="shrink-0 text-[8.5px] font-bold text-[#4B7BE3] flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Custom range
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <span
              className={`h-8 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 ${
                busy === "pdf" ? "bg-[#EEF5FF] text-[#4B7BE3] border border-[#4B7BE3]/30" : "bg-red-50 text-red-600"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> {busy === "pdf" ? "Generating PDF…" : "PDF"}
            </span>
            <span className="h-8 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center justify-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </span>
          </div>
        </Card>
      ))}
    </div>
  </>
);

/* ---------- admin (browser) screens ---------- */

const AdminShell = ({ active, children }) => (
  <div className="flex h-[400px]">
    <div className="w-[150px] bg-white border-r border-slate-100 p-3 space-y-1 text-[10.5px]">
      <div className="flex items-center gap-1.5 font-extrabold text-[12px] mb-3">
        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7CC8E0] to-[#4B7BE3]" /> Present-Me
      </div>
      {[
        [LayoutDashboard, "Dashboard"],
        [Users, "Teachers"],
        [BookOpen, "Students"],
        [Download, "Attendance"],
      ].map(([Icon, l]) => (
        <div key={l} className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${active === l ? "bg-[#EEF5FF] text-[#4B7BE3] font-bold" : "text-slate-500"}`}>
          <Icon className="w-3.5 h-3.5" /> {l}
        </div>
      ))}
    </div>
    <div className="flex-1 p-4 overflow-hidden">{children}</div>
  </div>
);

const AdminRegister = () => (
  <div className="h-[400px] flex">
    <div className="w-[230px] bg-gradient-to-br from-[#7CC8E0] to-[#4B7BE3] text-white p-6 flex flex-col justify-end">
      <ShieldCheck className="w-8 h-8 opacity-90" />
      <div className="mt-3 text-[16px] font-extrabold leading-tight">Register your institute</div>
      <p className="mt-2 text-[10.5px] opacity-85">Every institute is verified before it goes live.</p>
    </div>
    <div className="flex-1 p-6 bg-white space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Institute name" value="Institute of Technology" />
        <Field label="Your role" value="HOD" trailing={<ChevronDown className="w-3.5 h-3.5 text-slate-400" />} />
        <Field label="Full name" value="Dr. Meera Iyer" />
        <Field label="Official email" value="hod.cse@iot.edu" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {["Aadhaar card", "Designation ID"].map((d) => (
          <div key={d} className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50/60 px-3 py-2.5 flex items-center gap-2 text-[10.5px]">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">{d}</span>
            <span className="ml-auto text-[9px] text-emerald-700">Uploaded</span>
          </div>
        ))}
      </div>
      <Btn className="!w-48 mt-2">Submit for verification</Btn>
    </div>
  </div>
);

const AdminApprove = () => (
  <AdminShell active="Teachers">
    <div className="text-[14px] font-extrabold">Teachers</div>
    <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-[10.5px] text-amber-800 flex items-center gap-2">
      <Clock className="w-3.5 h-3.5" /> 3 teachers are waiting for your approval
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2.5">
      {[
        ["Rahul Mehta", "rahul.m@iot.edu"],
        ["Sneha Kapoor", "sneha.k@iot.edu"],
        ["Vikram Rao", "vikram.r@iot.edu"],
      ].map(([n, e]) => (
        <div key={n} className="rounded-xl bg-white border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2">
            <Avatar name={n} className="w-8 h-8" />
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold truncate">{n}</div>
              <div className="text-[9px] text-slate-500 truncate">{e}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <span className="h-7 rounded-md bg-emerald-600 text-white text-[9.5px] font-bold flex items-center justify-center gap-1">
              <Check className="w-3 h-3" /> Approve
            </span>
            <span className="h-7 rounded-md border border-red-200 text-red-600 text-[9.5px] font-bold flex items-center justify-center">Reject</span>
          </div>
        </div>
      ))}
    </div>
  </AdminShell>
);

const AdminDashboard = () => (
  <AdminShell active="Dashboard">
    <div className="text-[14px] font-extrabold">Good morning, Dr. Iyer</div>
    <div className="mt-3 grid grid-cols-4 gap-2.5">
      {[
        ["Teachers", "24"],
        ["Students", "860"],
        ["Pending", "3"],
        ["Classes", "41"],
      ].map(([k, v]) => (
        <div key={k} className="rounded-xl bg-white border border-slate-100 shadow-sm p-3">
          <div className="text-[9.5px] text-slate-500">{k}</div>
          <div className="text-[18px] font-extrabold mt-0.5">{v}</div>
        </div>
      ))}
    </div>
    <div className="mt-3 rounded-xl bg-white border border-slate-100 shadow-sm p-3">
      <div className="text-[10.5px] font-bold mb-3">Average attendance by department</div>
      <div className="flex items-end gap-4 h-[150px]">
        {[
          ["CSE", 88],
          ["ECE", 81],
          ["ME", 74],
          ["CE", 79],
          ["EE", 85],
          ["IT", 90],
        ].map(([d, p], i) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className={`w-full rounded-t-md ${p >= 75 ? "bg-gradient-to-t from-[#4B7BE3] to-[#7CC8E0]" : "bg-amber-400"}`}
              initial={{ height: 0 }}
              animate={{ height: `${p * 1.3}px` }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            />
            <span className="text-[9px] text-slate-500">{d}</span>
          </div>
        ))}
      </div>
    </div>
  </AdminShell>
);

const AdminReport = () => (
  <AdminShell active="Attendance">
    <div className="text-[14px] font-extrabold">Attendance reports</div>
    <div className="mt-3 grid grid-cols-2 gap-2.5">
      {[
        ["Data Structures", SAMPLE_CODE, "Rahul Mehta", 40],
        ["DBMS", "730264", "Sneha Kapoor", 38],
        ["Operating Systems", "159380", "Vikram Rao", 42],
        ["Discrete Maths", "604127", "Anil Joshi", 36],
      ].map(([n, c, t, s], i) => (
        <div key={c} className={`rounded-xl bg-white border shadow-sm p-3 ${i === 0 ? "border-[#4B7BE3] ring-2 ring-[#4B7BE3]/15" : "border-slate-100"}`}>
          <div className="text-[11px] font-bold">{n}</div>
          <div className="text-[9px] text-[#4B7BE3] font-semibold">{c}</div>
          <div className="text-[9.5px] text-slate-500 mt-1.5">
            {t} · {s} students
          </div>
          <div className="mt-2 flex gap-1.5">
            <span className="flex-1 h-6 rounded-md bg-gradient-to-r from-[#7CC8E0] to-[#4B7BE3] text-white text-[9px] font-bold flex items-center justify-center">View report</span>
            <span className="w-7 h-6 rounded-md border border-slate-200 flex items-center justify-center">
              <FileText className="w-3 h-3 text-slate-500" />
            </span>
            <span className="w-7 h-6 rounded-md border border-slate-200 flex items-center justify-center">
              <FileSpreadsheet className="w-3 h-3 text-slate-500" />
            </span>
            <span className="w-7 h-6 rounded-md border border-slate-200 flex items-center justify-center">
              <FileDown className="w-3 h-3 text-slate-500" />
            </span>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-3 flex gap-1.5 text-[9.5px]">
      {["Last 7 days", "Last 30 days", "This month", "Last month", "All time", "Custom"].map((p, i) => (
        <span key={p} className={`px-2.5 py-1 rounded-full border ${i === 1 ? "bg-[#4B7BE3] text-white border-[#4B7BE3]" : "border-slate-200 text-slate-600"}`}>
          {p}
        </span>
      ))}
    </div>
  </AdminShell>
);

/* ---------- shared bits for the screens below ---------- */

const Tabs = ({ items, active = 0 }) => (
  <div className="grid gap-1 p-1 rounded-xl bg-slate-100 text-[10px] font-bold" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
    {items.map((t, i) => (
      <span key={i} className={`h-7 rounded-lg flex items-center justify-center gap-1 ${i === active ? "bg-white shadow-sm text-[#0B1B34]" : "text-slate-500"}`}>
        {t}
      </span>
    ))}
  </div>
);

const PRIORITY = [
  ["Normal", "border-slate-400 text-slate-600 bg-slate-50"],
  ["Important", "border-amber-500 text-amber-700 bg-amber-50"],
  ["Urgent", "border-red-500 text-red-600 bg-red-50"],
];
const PRIORITY_TAG = { Normal: "bg-slate-100 text-slate-600", Important: "bg-amber-50 text-amber-700", Urgent: "bg-red-50 text-red-600" };

const PriorityPicker = ({ value }) => (
  <div>
    <div className="text-[9px] font-semibold text-slate-500 mb-1">Priority</div>
    <div className="flex gap-1.5">
      {PRIORITY.map(([p, on]) => (
        <span key={p} className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold border ${p === value ? `${on} border-[1.5px]` : "border-slate-200 text-slate-500 bg-slate-50"}`}>
          {p}
        </span>
      ))}
    </div>
  </div>
);

const BottomNav = ({ active }) => (
  <div className="absolute bottom-0 inset-x-0 h-12 bg-white border-t border-slate-100 grid grid-cols-4 text-[8.5px] font-semibold">
    {[
      [House, "Home"],
      [BookOpen, "Classes"],
      [BarChart3, "Attendance"],
      [User, "Profile"],
    ].map(([Icon, l]) => (
      <span key={l} className={`flex flex-col items-center justify-center gap-0.5 ${active === l ? "text-[#4B7BE3]" : "text-slate-400"}`}>
        <Icon className="w-4 h-4" />
        {l}
      </span>
    ))}
  </div>
);

const Sheet = ({ children }) => (
  <div className="absolute inset-0 bg-[#0B1B34]/45 flex items-end">
    <motion.div initial={{ y: 80 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} className="w-full bg-white rounded-t-3xl p-4 pb-6 space-y-2.5">
      <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto" />
      {children}
    </motion.div>
  </div>
);

const HomeHeader = ({ name, line }) => (
  <div className="bg-gradient-to-r from-[#7CC8E0] to-[#4B7BE3] text-white px-4 pt-10 pb-12">
    <div className="flex items-center justify-between text-[10px] opacity-90">
      <span className="flex items-center gap-1">
        <Sun className="w-3 h-3" /> Good Morning
      </span>
      <Bell className="w-3.5 h-3.5" />
    </div>
    <div className="mt-1 font-extrabold text-[16px]">{name}</div>
    <div className="text-[9.5px] opacity-85">{line}</div>
  </div>
);

/* ---------- more student screens ---------- */

const StudentVerifyEmail = () => (
  <>
    <AppBar title="Verify Your Email" sub="You are almost there!" />
    <div className="p-5 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
        className="mt-3 w-20 h-20 mx-auto rounded-full bg-[#EEF5FF] text-[#4B7BE3] flex items-center justify-center"
      >
        <MailCheck className="w-9 h-9" />
      </motion.div>
      <div className="mt-4 text-[10.5px] text-slate-500">We have sent a verification link to</div>
      <div className="text-[12px] font-bold">a••••@college.edu</div>
      <Card className="mt-4 p-3 text-left text-[10px] text-slate-600 leading-relaxed">
        Check your inbox (or spam) and tap the link to activate your Present-Me account.
        <div className="mt-2 inline-flex items-center gap-1 text-[9.5px] font-semibold text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
          <Clock className="w-3 h-3" /> Valid for 24 hours
        </div>
      </Card>
      <Btn className="mt-4">
        <Mail className="w-3.5 h-3.5" /> Open Email App
      </Btn>
      <Btn tone="light" className="mt-2">
        Go to Login
      </Btn>
    </div>
  </>
);

const StudentHome = () => (
  <>
    <HomeHeader name="Aarav Sharma" line="Roll No: 21CS045" />
    <div className="px-4 -mt-8 space-y-3">
      <Card className="p-3 grid grid-cols-2 divide-x divide-slate-100 text-center">
        <div>
          <div className="text-[17px] font-extrabold text-emerald-600">86%</div>
          <div className="text-[9px] text-slate-500">Attendance</div>
        </div>
        <div>
          <div className="text-[17px] font-extrabold">4</div>
          <div className="text-[9px] text-slate-500">Classes</div>
        </div>
      </Card>
      <div>
        <div className="text-[10px] font-bold mb-1.5">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <Btn className="!h-10">
            <Fingerprint className="w-3.5 h-3.5" /> Mark Attendance
          </Btn>
          <Btn tone="light" className="!h-10">
            <Plus className="w-3.5 h-3.5" /> Join Class
          </Btn>
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold mb-1.5">Today's classes</div>
        <div className="space-y-1.5">
          {[
            ["Discrete Maths", "Room 105 · 9:00 AM", "Completed"],
            ["Data Structures", "Room 301 · 10:00 AM", "Active"],
            ["DBMS", "Room 204 · 12:00 PM", null],
          ].map(([n, m, st]) => (
            <Card key={n} className="p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EEF5FF] text-[#4B7BE3] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-bold truncate">{n}</div>
                <div className="text-[9px] text-slate-500">{m}</div>
              </div>
              {st && (
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold ${st === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{st}</span>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
    <BottomNav active="Home" />
  </>
);

const StudentPending = () => (
  <>
    <AppBar title="Pending Requests" sub="Classes awaiting approval" />
    <div className="p-4 space-y-2.5">
      {[
        ["Data Structures", "Prof. Rahul Mehta", SAMPLE_CODE],
        ["Operating Systems", "Prof. Vikram Rao", "159380"],
      ].map(([n, t, c]) => (
        <Card key={c} className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-bold">{n}</div>
              <div className="text-[9px] text-slate-500">
                {t} · {c}
              </div>
            </div>
            <span className="text-[8.5px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center gap-1 whitespace-nowrap">
              <Hourglass className="w-2.5 h-2.5" /> Awaiting
            </span>
          </div>
          <p className="mt-2 text-[9.5px] text-slate-500 leading-relaxed">Your request is waiting for teacher approval.</p>
          <Btn tone="danger" className="mt-2 !h-7">
            Cancel Request
          </Btn>
        </Card>
      ))}
    </div>
  </>
);

const StudentHistory = () => (
  <>
    <AppBar title="Data Structures" sub="Attendance History" />
    <div className="p-4">
      <Card className="p-3 flex items-center justify-between">
        <div>
          <div className="text-[9px] text-slate-500">Overall Attendance</div>
          <div className="text-[20px] font-extrabold text-emerald-600 leading-tight">90%</div>
        </div>
        <div className="text-right text-[9.5px] text-slate-500 space-y-0.5">
          <div>
            <b className="text-[#0B1B34]">18</b> Present
          </div>
          <div>
            <b className="text-[#0B1B34]">2</b> Absent
          </div>
        </div>
      </Card>
      <div className="mt-3 space-y-1.5">
        {[
          ["Wed, 30 Sep", 1],
          ["Mon, 28 Sep", 1],
          ["Fri, 25 Sep", 0],
          ["Wed, 23 Sep", 1],
          ["Mon, 21 Sep", 1],
          ["Fri, 18 Sep", 1],
        ].map(([d, p]) => (
          <Card key={d} className="px-3 py-2 flex items-center justify-between">
            <span className="text-[10.5px] font-semibold flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              {d}
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{p ? "Present" : "Absent"}</span>
          </Card>
        ))}
      </div>
    </div>
  </>
);

const StudentNotices = () => (
  <>
    <AppBar title="Notices" sub="Notice Hub for students" />
    <div className="p-4">
      <Tabs
        items={[
          <>
            General Notice <span className="px-1.5 rounded-full bg-[#4B7BE3] text-white text-[8px]">2 new</span>
          </>,
          "Class Notice",
        ]}
      />
      <div className="mt-3 space-y-2">
        {[
          ["Urgent", "Mid-sem exams rescheduled", "New dates are up on the exam cell board.", "01 Oct 2026 · 09:15 AM", true],
          ["Important", "Fee deadline extended", "Semester fees can now be paid till 10 October.", "30 Sep 2026 · 04:40 PM", true],
          ["Normal", "Library timings", "The library stays open till 8 PM during exams.", "28 Sep 2026 · 11:00 AM", false],
        ].map(([p, t, m, d, isNew]) => (
          <Card key={t} className="p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wide ${PRIORITY_TAG[p]}`}>{p.toUpperCase()}</span>
              {isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#4B7BE3]" />}
            </div>
            <div className="mt-1.5 text-[10.5px] font-bold">{t}</div>
            <div className="text-[9.5px] text-slate-500 leading-snug">{m}</div>
            <div className="mt-1 text-[8.5px] text-slate-400">{d}</div>
          </Card>
        ))}
      </div>
    </div>
  </>
);

const StudentNotes = () => (
  <>
    <AppBar title="Notes & PYQs" sub="Find study material" />
    <div className="p-4 space-y-2">
      <Tabs items={["Previous papers", "Class material"]} />
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ["Course", "B.Tech"],
          ["Department", "CSE"],
          ["Semester", "5th"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-white border border-slate-200 px-2 py-1.5">
            <div className="text-[8px] text-slate-400">{l}</div>
            <div className="text-[10px] font-bold flex items-center justify-between">
              {v}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
      <Btn className="!h-8">
        <Search className="w-3.5 h-3.5" /> Search
      </Btn>
      {[
        ["DBMS · 2025 end-sem", "PDF · 860 KB", true],
        ["Operating Systems · 2025 end-sem", "PDF · 1.2 MB", false],
        ["Computer Networks · 2024 end-sem", "PDF · 940 KB", false],
      ].map(([t, m, off]) => (
        <Card key={t} className="p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-bold truncate">{t}</div>
            <div className="text-[9px] text-slate-500">{m}</div>
          </div>
          {off ? (
            <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">Offline</span>
          ) : (
            <Download className="w-3.5 h-3.5 text-[#4B7BE3]" />
          )}
        </Card>
      ))}
      <div className="absolute right-4 bottom-5 h-10 px-4 rounded-full bg-gradient-to-r from-[#7CC8E0] to-[#4B7BE3] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
        <Upload className="w-3.5 h-3.5" /> Upload
      </div>
    </div>
  </>
);

const StudentPdf = () => (
  <>
    <div className="bg-[#0B1B34] text-white px-4 pt-10 pb-3 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="text-[9px] opacity-70">My Downloads</div>
        <div className="text-[12px] font-bold truncate">DBMS · 2025 end-sem</div>
      </div>
      <span className="shrink-0 text-[8.5px] font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
        <Lock className="w-2.5 h-2.5" /> Protected
      </span>
    </div>
    <div className="p-3 bg-slate-200/70 h-full">
      <div className="rounded-md bg-white shadow p-4 h-[290px]">
        <div className="text-[10px] font-extrabold text-center">B.Tech · 5th Semester</div>
        <div className="text-[9px] text-center text-slate-500">Database Management Systems · End Semester 2025</div>
        <div className="h-px bg-slate-200 my-3" />
        <div className="space-y-2">
          {[92, 78, 85, 60, 88, 70, 82, 54, 90, 66].map((w, i) => (
            <div key={i} className={`h-1.5 rounded-full ${i % 4 === 0 ? "bg-slate-300" : "bg-slate-200"}`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-[#0B1B34] text-white px-3 py-2 text-[9.5px] flex items-center gap-2">
        <ScreenShareOff className="w-3.5 h-3.5 text-[#7CC8E0] shrink-0" /> Screenshots and screen recording are blocked
      </div>
      <div className="mt-2 text-center text-[9px] text-slate-500 flex items-center justify-center gap-1">
        <WifiOff className="w-3 h-3" /> Saved for offline reading
      </div>
    </div>
  </>
);

const StudentUpload = () => (
  <>
    <AppBar title="Upload material" sub="Reviewed before other students see it" />
    <div className="p-4 space-y-2">
      <div className="text-[9px] font-semibold text-slate-500">Material Type</div>
      <div className="grid grid-cols-2 gap-1.5">
        <span className="h-8 rounded-lg border-2 border-[#4B7BE3] bg-[#EEF5FF] text-[#4B7BE3] text-[10.5px] font-bold flex items-center justify-center">PYQ</span>
        <span className="h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-[10.5px] font-bold flex items-center justify-center">Notes</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Course" value="B.Tech" />
        <Field label="Department" value="CSE" />
        <Field label="Semester" value="5th Semester" />
        <Field label="Academic Year" value="2025" />
      </div>
      <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 p-3 flex items-center gap-2.5">
        <FileText className="w-6 h-6 text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] font-bold truncate">CSE_Sem5_2025_PYQ.pdf</div>
          <div className="text-[9px] text-slate-500">3.4 MB · File selected</div>
        </div>
        <Check className="w-4 h-4 text-emerald-600" />
      </div>
      <div className="text-[8.5px] text-slate-400 text-center">PDF, DOC, DOCX, PPT or PPTX · Max 10 MB</div>
      <Btn>
        <Upload className="w-3.5 h-3.5" /> Submit for Approval
      </Btn>
    </div>
  </>
);

const UPLOAD_TONE = { Approved: "bg-emerald-50 text-emerald-700", Pending: "bg-amber-50 text-amber-700", Rejected: "bg-red-50 text-red-600" };

const StudentUploads = () => (
  <>
    <AppBar title="My Uploads" sub="Track your submitted study materials" />
    <div className="p-4 space-y-2">
      {[
        ["CSE Sem 5 · 2025 PYQs", "PYQ · 3.4 MB", "Approved"],
        ["DBMS · complete notes", "Notes · 6.1 MB", "Pending"],
        ["OS · unit 2 only", "Notes · 1.1 MB", "Rejected"],
      ].map(([t, m, st]) => (
        <Card key={t} className="p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-bold truncate">{t}</div>
            <div className="text-[9px] text-slate-500">{m}</div>
          </div>
          <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold ${UPLOAD_TONE[st]}`}>{st}</span>
        </Card>
      ))}
      <div className="rounded-xl bg-[#EEF5FF] p-3 text-[9.5px] text-[#2F55B0] leading-relaxed flex gap-2">
        <IndianRupee className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        Approved uploads earn a reward in your wallet. Incomplete material (like a single unit) isn't rewarded.
      </div>
    </div>
  </>
);

const StudentWithdraw = () => (
  <>
    <StudentWallet />
    <Sheet>
      <div>
        <div className="text-[13px] font-extrabold">Withdraw Money</div>
        <div className="text-[9.5px] text-slate-500">Transfer your earnings to your UPI</div>
      </div>
      <Field label="Amount" value="₹ 100" focus />
      <Field label="UPI ID" value="aarav@okaxis" />
      <div className="rounded-lg bg-amber-50 text-amber-800 text-[9px] p-2 leading-relaxed">Minimum ₹10 · usually processed within 24 hours · double-check your UPI ID</div>
      <Btn>Withdraw ₹100</Btn>
    </Sheet>
  </>
);

const StudentSettings = () => (
  <>
    <AppBar title="Settings" sub="Manage your app preferences" />
    <div className="p-4 space-y-2">
      <Card className="p-3 flex items-center gap-2.5">
        <Avatar name="Aarav Sharma" className="w-10 h-10 !text-[11px]" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold">Aarav Sharma</div>
          <div className="text-[9px] text-slate-500">Roll No: 21CS045 · 5th Semester</div>
        </div>
        <span className="text-[9.5px] font-bold text-[#4B7BE3]">Edit Profile</span>
      </Card>
      {[
        [KeyRound, "Change Password", "Update your password", false],
        [LifeBuoy, "Help & Support", "WhatsApp, email or call us", false],
        [ShieldCheck, "Privacy Policy", "View privacy policy", false],
        [Trash2, "Delete Account", "Data removed within 30 days", true],
      ].map(([Icon, t, sub, danger]) => (
        <Card key={t} className="p-2.5 flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? "bg-red-50 text-red-500" : "bg-[#EEF5FF] text-[#4B7BE3]"}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className={`text-[10.5px] font-bold ${danger ? "text-red-600" : ""}`}>{t}</div>
            <div className="text-[9px] text-slate-500">{sub}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-300" />
        </Card>
      ))}
      <Card className="p-3 text-[9.5px]">
        <div className="font-bold mb-1">Support Hours</div>
        <div className="flex justify-between text-slate-500">
          <span>Mon – Fri</span>
          <span>9:00 AM – 6:00 PM</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Saturday</span>
          <span>10:00 AM – 4:00 PM</span>
        </div>
      </Card>
    </div>
  </>
);

/* ---------- more teacher screens ---------- */

const TeacherSignup = () => (
  <>
    <AppBar title="Create Teacher Account" sub="Join Present-Me to manage your classes" />
    <div className="p-4 space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        <Field label="First name" value="Rahul" />
        <Field label="Last name" value="Mehta" />
      </div>
      <Field label="Email address" value="rahul.m@iot.edu" />
      <Field label="Institute" value="Institute of Technology" trailing={<ChevronDown className="w-3.5 h-3.5 text-slate-400" />} />
      <div>
        <Field label="Hotspot name" value={SAMPLE_SSID} focus trailing={<Wifi className="w-3.5 h-3.5 text-[#4B7BE3]" />} />
        <div className="mt-1 text-[8.5px] text-[#4B7BE3] font-semibold">Exactly as it appears in your phone's hotspot settings</div>
      </div>
      <Field label="Password" value="••••••••••" />
      <Btn className="mt-1">Create Account</Btn>
    </div>
  </>
);

const TeacherHome = () => (
  <>
    <HomeHeader name="Prof. Rahul Mehta" line="Thursday, October 1, 2026" />
    <div className="px-4 -mt-8 space-y-3">
      <Card className="p-3 grid grid-cols-3 divide-x divide-slate-100 text-center">
        {[
          ["87%", "Avg Attendance"],
          ["3", "Classes"],
          ["52", "Classes Held"],
        ].map(([v, l]) => (
          <div key={l}>
            <div className="text-[16px] font-extrabold">{v}</div>
            <div className="text-[8.5px] text-slate-500">{l}</div>
          </div>
        ))}
      </Card>
      <div>
        <div className="text-[10px] font-bold mb-1.5">Quick Actions</div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            [Fingerprint, "Mark Attendance"],
            [Plus, "Create Class"],
            [Download, "Download Attendance"],
          ].map(([Icon, l], i) => (
            <div key={l} className={`rounded-xl p-2 text-center text-[8.5px] font-bold leading-tight ${i === 0 ? "bg-gradient-to-br from-[#7CC8E0] to-[#4B7BE3] text-white" : "bg-white border border-slate-100 shadow-sm"}`}>
              <Icon className={`w-4 h-4 mx-auto mb-1 ${i === 0 ? "" : "text-[#4B7BE3]"}`} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold mb-1.5">Today's classes</div>
        <div className="space-y-1.5">
          {[
            ["Data Structures", "Room 301 · 10:00 AM", "40 students", true],
            ["Operating Systems", "Room 210 · 2:00 PM", "42 students", false],
          ].map(([n, m, c, live]) => (
            <Card key={n} className="p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EEF5FF] text-[#4B7BE3] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-bold truncate">{n}</div>
                <div className="text-[9px] text-slate-500">
                  {m} · {c}
                </div>
              </div>
              {live && <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">Active</span>}
            </Card>
          ))}
        </div>
      </div>
    </div>
    <BottomNav active="Home" />
  </>
);

const TeacherClasses = () => (
  <>
    <AppBar title="My Classes" sub="Total active classes 3" />
    <div className="p-4 space-y-2">
      <Tabs items={["Active (3)", "Inactive (1)"]} />
      {[
        ["Data Structures", "Room 301 · Mon, Wed, Fri · 10–11 AM", SAMPLE_CODE, 40],
        ["DBMS", "Room 204 · Tue, Thu · 12–1 PM", "730264", 38],
        ["Operating Systems", "Room 210 · Mon, Thu · 2–3 PM", "159380", 42],
      ].map(([n, m, c, k], i) => (
        <Card key={c} className="p-3 relative">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-bold">{n}</div>
              <div className="text-[9px] text-slate-500 truncate">{m}</div>
            </div>
            <EllipsisVertical className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[9px]">
            <span className="px-1.5 py-0.5 rounded bg-[#EEF5FF] text-[#4B7BE3] font-bold tracking-wider">{c}</span>
            <span className="text-slate-500">{k} students</span>
          </div>
          {i === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute right-3 top-8 z-10 w-[132px] rounded-xl bg-white shadow-xl ring-1 ring-slate-100 py-1 text-[10px]"
            >
              {[
                [Pencil, "Edit Class", ""],
                [Eye, "View Class", ""],
                [Archive, "Move to Inactive", "bg-[#EEF5FF] text-[#4B7BE3] font-bold"],
                [Trash2, "Delete Class", "text-red-600"],
              ].map(([Icon, l, cls]) => (
                <div key={l} className={`px-2.5 py-1.5 flex items-center gap-2 ${cls}`}>
                  <Icon className="w-3 h-3" /> {l}
                </div>
              ))}
            </motion.div>
          )}
        </Card>
      ))}
    </div>
  </>
);

const TeacherTrack = () => {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <>
      <AppBar title="Aarav Sharma" sub="Data Structures · 21CS045" />
      <div className="p-4">
        <Card className="p-3 flex items-center gap-3">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90 shrink-0">
            <circle cx="32" cy="32" r={r} fill="none" stroke="#FCA5A5" strokeWidth="9" />
            <motion.circle
              cx="32"
              cy="32"
              r={r}
              fill="none"
              stroke="#10B981"
              strokeWidth="9"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: c * 0.1 }}
              transition={{ duration: 0.9 }}
            />
          </svg>
          <div className="text-[10px] space-y-0.5">
            <div className="text-[9px] text-slate-500">Overall Attendance</div>
            <div className="text-[18px] font-extrabold text-emerald-600 leading-none">90%</div>
            <div className="flex gap-2.5 pt-1 text-[9px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 18 Present
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-300" /> 2 Absent
              </span>
            </div>
          </div>
        </Card>
        <div className="mt-3 mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-bold">Attendance History</span>
          <span className="text-[8.5px] text-slate-400">Long Press to edit</span>
        </div>
        <div className="space-y-1.5">
          {[
            ["Wed, 30 Sep", 1],
            ["Mon, 28 Sep", 1],
            ["Fri, 25 Sep", 0],
            ["Wed, 23 Sep", 1],
          ].map(([d, p]) => (
            <Card key={d} className={`px-3 py-2 flex items-center justify-between ${!p ? "ring-2 ring-[#4B7BE3]/40" : ""}`}>
              <span className="text-[10.5px] font-semibold">{d}</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{p ? "Present" : "Absent"}</span>
            </Card>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="absolute inset-0 bg-[#0B1B34]/40 flex items-center justify-center p-6">
        <div className="w-full rounded-2xl bg-white p-4 text-center shadow-xl">
          <div className="text-[12px] font-extrabold">Update Attendance</div>
          <div className="mt-1 text-[10px] text-slate-500">Mark this student as Present for Fri, 25 Sep?</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Btn tone="light" className="!h-8">
              Cancel
            </Btn>
            <Btn className="!h-8">Update</Btn>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const TeacherNotice = () => (
  <>
    <AppBar title="Send Notice" sub="Data Structures · 40 students" />
    <div className="p-4 space-y-2.5">
      <Field label="Notice Title" value="Lab test moved to Friday" />
      <div>
        <div className="text-[9px] font-semibold text-slate-500 mb-1">Message</div>
        <Card className="p-3 text-[10.5px] leading-relaxed min-h-[84px]">
          The lab test is now on <b>Friday, 11 AM</b> in Lab 2. Bring your record files.
        </Card>
      </div>
      <PriorityPicker value="Important" />
      <Btn className="mt-1">
        <Megaphone className="w-3.5 h-3.5" /> Send Notice
      </Btn>
    </div>
  </>
);

const TeacherGeneral = () => (
  <>
    <AppBar title="Send General Notice" sub="Visible to all teachers & students" />
    <div className="p-4 space-y-2.5">
      <Field label="Notice Title" value="Holiday on 2 October" />
      <div>
        <div className="text-[9px] font-semibold text-slate-500 mb-1">Message</div>
        <Card className="p-3 text-[10.5px] leading-relaxed min-h-[84px]">College stays closed on Friday for Gandhi Jayanti. Classes resume on Saturday.</Card>
      </div>
      <PriorityPicker value="Normal" />
      <Btn className="mt-1">
        <Send className="w-3.5 h-3.5" /> Send to All
      </Btn>
    </div>
  </>
);

/* ---------- more admin screens ---------- */

const AdminStudents = () => (
  <AdminShell active="Students">
    <div className="flex items-center justify-between">
      <div className="text-[14px] font-extrabold">Students</div>
      <span className="text-[9.5px] font-bold px-2.5 py-1 rounded-md border border-slate-200 bg-white flex items-center gap-1">
        <FileSpreadsheet className="w-3 h-3 text-emerald-600" /> Export to Excel
      </span>
    </div>
    <div className="mt-2 flex gap-2">
      <div className="flex-1 h-7 rounded-md bg-white border border-slate-200 px-2 flex items-center gap-1.5 text-[9.5px] text-slate-400">
        <Search className="w-3 h-3" /> Search by name, email, phone or roll number
      </div>
      <div className="h-7 rounded-md bg-white border border-slate-200 px-2 flex items-center gap-1 text-[9.5px]">
        5th Semester <ChevronDown className="w-3 h-3 text-slate-400" />
      </div>
    </div>
    <div className="mt-3 rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden text-[10px]">
      <div className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.9fr] px-3 py-2 bg-slate-50 text-[9px] font-bold text-slate-500">
        <span>Name</span>
        <span>Roll no</span>
        <span>Sem</span>
        <span>Email</span>
      </div>
      {SAMPLE_STUDENTS.map(([n, r], i) => (
        <div key={r} className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.9fr] items-center px-3 py-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5 font-semibold truncate">
            <Avatar name={n} className="w-5 h-5 !text-[7px]" /> {n}
          </span>
          <span className="text-slate-500">{r}</span>
          <span className="text-slate-500">5</span>
          <span className={`text-[8.5px] font-bold w-fit px-1.5 py-0.5 rounded ${i === 3 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
            {i === 3 ? "Not verified" : "Verified"}
          </span>
        </div>
      ))}
    </div>
  </AdminShell>
);

const SCREENS = {
  "s-signup": StudentSignup,
  "s-join": StudentJoin,
  "s-hotspot": StudentHotspot,
  "s-verify": StudentVerify,
  "s-marked": StudentMarked,
  "s-stats": StudentStats,
  "s-notes": StudentNotes,
  "s-wallet": StudentWallet,
  "t-pending": TeacherPending,
  "t-create": TeacherCreate,
  "t-requests": TeacherRequests,
  "t-session": TeacherSession,
  "t-manual": TeacherManual,
  "t-report": TeacherReport,
  "t-notice": TeacherNotice,
  "t-general": TeacherGeneral,
  "t-signup": TeacherSignup,
  "t-home": TeacherHome,
  "t-classes": TeacherClasses,
  "t-track": TeacherTrack,
  "s-verify-email": StudentVerifyEmail,
  "s-home": StudentHome,
  "s-pending": StudentPending,
  "s-history": StudentHistory,
  "s-notices": StudentNotices,
  "s-pdf": StudentPdf,
  "s-upload": StudentUpload,
  "s-uploads": StudentUploads,
  "s-withdraw": StudentWithdraw,
  "s-settings": StudentSettings,
  "a-students": AdminStudents,
  "a-register": AdminRegister,
  "a-approve": AdminApprove,
  "a-dashboard": AdminDashboard,
  "a-report": AdminReport,
};

/* Cross-fades between app screens inside a phone or browser frame. */
export const Screen = ({ id }) => {
  const Comp = SCREENS[id];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        className="absolute inset-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        {Comp ? <Comp /> : null}
      </motion.div>
    </AnimatePresence>
  );
};

export const PhoneScreen = ({ id, className }) => (
  <PhoneFrame className={className}>
    <Screen id={id} />
  </PhoneFrame>
);

export const BrowserScreen = ({ id, className }) => (
  <BrowserFrame className={className}>
    <ScaledStage width={640} height={400}>
      <div className="relative w-[640px] h-[400px]">
        <Screen id={id} />
      </div>
    </ScaledStage>
  </BrowserFrame>
);
