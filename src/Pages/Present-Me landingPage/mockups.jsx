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
} from "lucide-react";

/* Illustrative sample data used inside the mockups only. */
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
    className={`relative w-[260px] h-[540px] shrink-0 rounded-[2.6rem] bg-[#0B1B34] p-[10px] shadow-[0_40px_80px_-30px_rgba(10,128,245,0.55)] ring-1 ring-black/5 ${className}`}
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
  <div className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white px-4 pt-10 pb-4">
    {sub && <div className="text-[10px] opacity-85">{sub}</div>}
    <div className="font-bold text-[15px] leading-tight">{title}</div>
  </div>
);

const Field = ({ label, value, focus, trailing }) => (
  <div>
    <div className="text-[9px] font-semibold text-slate-500 mb-1">{label}</div>
    <div
      className={`h-8 rounded-lg bg-white border px-2.5 flex items-center justify-between text-[11px] ${
        focus ? "border-[#0A80F5] ring-2 ring-[#0A80F5]/15" : "border-slate-200"
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
        ? "bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white shadow-md shadow-[#0A80F5]/25"
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
  <div className={`${className} rounded-full bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
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
        className={`absolute inset-0 rounded-full border-2 ${connected ? "border-emerald-400" : "border-[#0A80F5]"}`}
        initial={{ scale: 0.4, opacity: 0.7 }}
        animate={{ scale: 1.15, opacity: 0 }}
        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
      />
    ))}
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${connected ? "bg-emerald-500" : "bg-[#0A80F5]"}`}>
      <Wifi className="w-7 h-7" />
    </div>
  </div>
);

/* ---------- student screens ---------- */

const StudentSignup = () => (
  <>
    <AppBar title="Create your account" sub="Student sign up" />
    <div className="p-4 space-y-2.5">
      <Field label="Full name" value="Aarav Sharma" />
      <Field label="College email" value="aarav@college.edu" />
      <div>
        <Field label="College" value="Select your college" focus trailing={<ChevronDown className="w-3.5 h-3.5 text-slate-400" />} />
        <div className="mt-1 rounded-lg bg-white border border-slate-200 shadow-lg overflow-hidden text-[10.5px]">
          <div className="px-2.5 py-2 bg-[#EEF5FF] text-[#0A80F5] font-semibold">Institute of Technology</div>
          <div className="px-2.5 py-2 text-slate-600">City Engineering College</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Roll no" value="21CS045" />
        <Field label="Semester" value="5" />
      </div>
      <Btn className="mt-1">Sign up</Btn>
      <p className="text-[9.5px] text-center text-slate-500">We'll email you a link to verify your account</p>
    </div>
  </>
);

const StudentJoin = () => (
  <>
    <AppBar title="Join a class" sub="Ask your teacher for the code" />
    <div className="p-4">
      <div className="text-[10px] font-semibold text-slate-500 mb-2">Class code</div>
      <div className="grid grid-cols-6 gap-1.5">
        {"K7P2QX".split("").map((c, i) => (
          <div key={i} className="h-10 rounded-lg bg-white border-2 border-[#0A80F5]/40 flex items-center justify-center font-extrabold text-[15px]">
            {c}
          </div>
        ))}
      </div>
      <Btn className="mt-4">Send join request</Btn>
      <Card className="mt-5 p-3 flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Hourglass className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[11px] font-bold">Request sent</div>
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
          <Wifi className="w-3 h-3" /> DS-Room301
        </div>
        <p className="mt-2 text-[10px] text-slate-500">Attendance is open. Your teacher started the session at 10:00.</p>
      </Card>
      <Btn className="mt-4">
        <Fingerprint className="w-3.5 h-3.5" /> Mark attendance
      </Btn>
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
          className="mt-4 w-16 h-16 mx-auto rounded-full bg-[#EEF5FF] text-[#0A80F5] flex items-center justify-center"
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
          <stop offset="0" stopColor="#0BCCEB" />
          <stop offset="1" stopColor="#0A80F5" />
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

const StudentNotes = () => (
  <>
    <AppBar title="Notes & PYQs" sub="Shared by students of your college" />
    <div className="p-4 space-y-2">
      <div className="h-8 rounded-lg bg-white border border-slate-200 flex items-center gap-2 px-2.5 text-[10.5px] text-slate-400">
        <Search className="w-3.5 h-3.5" /> Search notes, subjects…
      </div>
      {[
        ["DBMS · Unit 3 notes", "PDF · 2.1 MB", false],
        ["Maths · 2024 end-sem PYQ", "PDF · 860 KB", true],
        ["OS · Scheduling cheat sheet", "PDF · 1.4 MB", false],
        ["DS · 2023 mid-sem PYQ", "PDF · 640 KB", true],
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
            <Download className="w-3.5 h-3.5 text-[#0A80F5]" />
          )}
        </Card>
      ))}
      <div className="absolute right-4 bottom-5 h-10 px-4 rounded-full bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
        <Upload className="w-3.5 h-3.5" /> Upload
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
                  on ? "bg-[#0A80F5] text-white" : "bg-white border border-slate-200 text-slate-500"
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
          <div className="text-[16px] font-extrabold tracking-[0.2em]">K7P2QX</div>
        </div>
        <span className="text-[10px] font-bold text-[#0A80F5]">Share</span>
      </Card>
    </div>
  </>
);

const TeacherRequests = () => (
  <>
    <AppBar title="Join requests" sub="Data Structures · 4 waiting" />
    <div className="p-4 space-y-2">
      <Btn tone="light" className="!h-8">
        <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Approve all
      </Btn>
      {SAMPLE_STUDENTS.slice(0, 4).map(([n, r]) => (
        <Card key={r} className="p-2.5 flex items-center gap-2.5">
          <Avatar name={n} />
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-bold truncate">{n}</div>
            <div className="text-[9px] text-slate-500">{r} · Sem 5</div>
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
      <AppBar title="Smart attendance" sub="Data Structures · Room 301" />
      <div className="p-4">
        <Card className="p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wifi className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1">
            <div className="text-[9px] text-slate-500">Your hotspot</div>
            <div className="text-[11px] font-bold">DS-Room301</div>
          </div>
          <span className="w-9 h-5 rounded-full bg-emerald-500 relative">
            <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
          </span>
        </Card>
        <Card className="mt-3 p-4 text-center">
          <div className="text-[10px] text-slate-500">Marked present</div>
          <div className="text-[30px] font-extrabold leading-none mt-1">
            {count}
            <span className="text-[14px] text-slate-400 font-bold"> / 40</span>
          </div>
          <div className="mt-3">
            <Bar pct={(count / 40) * 100} tone="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5]" />
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
          End session
        </Btn>
      </div>
    </>
  );
};

const TeacherManual = () => (
  <>
    <AppBar title="Manual attendance" sub="Data Structures · Today" />
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
      <Btn className="mt-2">Save attendance</Btn>
    </div>
  </>
);

const TeacherReport = () => (
  <>
    <AppBar title="Download attendance" sub="Data Structures" />
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="From" value="1 Sep 2026" trailing={<CalendarDays className="w-3.5 h-3.5 text-slate-400" />} />
        <Field label="To" value="30 Sep 2026" trailing={<CalendarDays className="w-3.5 h-3.5 text-slate-400" />} />
      </div>
      <div>
        <div className="text-[9px] font-semibold text-slate-500 mb-1.5">Format</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            [FileText, "PDF", false],
            [FileSpreadsheet, "Excel", true],
            [FileDown, "CSV", false],
          ].map(([Icon, l, on]) => (
            <div
              key={l}
              className={`rounded-xl p-2.5 flex flex-col items-center gap-1 text-[10px] font-bold ${
                on ? "bg-[#EEF5FF] border-2 border-[#0A80F5] text-[#0A80F5]" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              {l}
            </div>
          ))}
        </div>
      </div>
      <Card className="p-3 space-y-1.5 text-[10px]">
        {[
          ["Sessions", "13"],
          ["Students", "40"],
          ["Class average", "87%"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-slate-500">{k}</span>
            <span className="font-bold">{v}</span>
          </div>
        ))}
      </Card>
      <Btn>
        <Download className="w-3.5 h-3.5" /> Download Excel
      </Btn>
    </div>
  </>
);

/* ---------- admin (browser) screens ---------- */

const AdminShell = ({ active, children }) => (
  <div className="flex h-[400px]">
    <div className="w-[150px] bg-white border-r border-slate-100 p-3 space-y-1 text-[10.5px]">
      <div className="flex items-center gap-1.5 font-extrabold text-[12px] mb-3">
        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5]" /> Present-Me
      </div>
      {[
        [LayoutDashboard, "Dashboard"],
        [Users, "Teachers"],
        [BookOpen, "Students"],
        [Download, "Attendance"],
      ].map(([Icon, l]) => (
        <div key={l} className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${active === l ? "bg-[#EEF5FF] text-[#0A80F5] font-bold" : "text-slate-500"}`}>
          <Icon className="w-3.5 h-3.5" /> {l}
        </div>
      ))}
    </div>
    <div className="flex-1 p-4 overflow-hidden">{children}</div>
  </div>
);

const AdminRegister = () => (
  <div className="h-[400px] flex">
    <div className="w-[230px] bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white p-6 flex flex-col justify-end">
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
              className={`w-full rounded-t-md ${p >= 75 ? "bg-gradient-to-t from-[#0A80F5] to-[#0BCCEB]" : "bg-amber-400"}`}
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
        ["Data Structures", "K7P2QX", "Rahul Mehta", 40],
        ["DBMS", "M3Q8ZT", "Sneha Kapoor", 38],
        ["Operating Systems", "P9L2WE", "Vikram Rao", 42],
        ["Discrete Maths", "R4T7YU", "Anil Joshi", 36],
      ].map(([n, c, t, s], i) => (
        <div key={c} className={`rounded-xl bg-white border shadow-sm p-3 ${i === 0 ? "border-[#0A80F5] ring-2 ring-[#0A80F5]/15" : "border-slate-100"}`}>
          <div className="text-[11px] font-bold">{n}</div>
          <div className="text-[9px] text-[#0A80F5] font-semibold">{c}</div>
          <div className="text-[9.5px] text-slate-500 mt-1.5">
            {t} · {s} students
          </div>
          <div className="mt-2 flex gap-1.5">
            <span className="flex-1 h-6 rounded-md bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white text-[9px] font-bold flex items-center justify-center">View report</span>
            <span className="w-7 h-6 rounded-md border border-slate-200 flex items-center justify-center">
              <FileText className="w-3 h-3 text-slate-500" />
            </span>
            <span className="w-7 h-6 rounded-md border border-slate-200 flex items-center justify-center">
              <FileSpreadsheet className="w-3 h-3 text-slate-500" />
            </span>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-3 flex gap-1.5 text-[9.5px]">
      {["All time", "Last 7 days", "Last 30 days", "This month"].map((p, i) => (
        <span key={p} className={`px-2.5 py-1 rounded-full border ${i === 2 ? "bg-[#0A80F5] text-white border-[#0A80F5]" : "border-slate-200 text-slate-600"}`}>
          {p}
        </span>
      ))}
    </div>
  </AdminShell>
);

const TeacherNotice = () => (
  <>
    <AppBar title="Post notice" sub="Data Structures" />
    <div className="p-4 space-y-3">
      <Card className="p-3 text-[11px] leading-relaxed min-h-[110px]">
        Lab test moved to <b>Friday, 11 AM</b> in Lab 2. Bring your record files.
      </Card>
      <Btn>
        <Megaphone className="w-3.5 h-3.5" /> Send to 40 students
      </Btn>
    </div>
  </>
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
