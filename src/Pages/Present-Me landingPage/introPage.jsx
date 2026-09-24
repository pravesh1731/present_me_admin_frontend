import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useInView, useReducedMotion, animate } from "framer-motion";
import {
  ArrowRight,
  Wifi,
  Fingerprint,
  CheckCircle2,
  Hand,
  FileText,
  FileSpreadsheet,
  FileDown,
  Hash,
  Megaphone,
  BookOpen,
  IndianRupee,
  BarChart3,
  LayoutDashboard,
  GraduationCap,
  Presentation,
  Building2,
  Play,
  Pause,
  Plus,
  Minus,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  UserCheck,
  Users,
  Download,
  RotateCcw,
  LayoutGrid,
  CirclePlay,
  CircleHelp,
  LogIn,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { BrandMark, GetAppButton } from "../../components/common/Brand";
import { useSvgId } from "../../utils/brand";
import { BaseUrl } from "../../utils/constants";
import { PhoneScreen, BrowserScreen, ScaledStage, PhoneFrame, BrowserFrame, Screen } from "./mockups";
import { PLAY_STORE_URL, SUPPORT_EMAIL, SUPPORT_PHONE, LOCATION, VIDEOS, GUIDES, FAQS } from "./landingContent";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
const INK = "text-[#0B1B34]";

const NAV = [
  ["how", "How it works", Wifi],
  ["features", "Features", LayoutGrid],
  ["guide", "Guides", BookOpen],
  ["videos", "Videos", CirclePlay],
  ["faq", "FAQ", CircleHelp],
];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/* ---------- live numbers ---------- */

const useLiveStats = () => {
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  useEffect(() => {
    let alive = true;
    axios
      .get(`${BaseUrl}/public/stats`)
      .then((r) => alive && setStats(r.data?.data || null))
      .catch(() => {});
    axios
      .get(`${BaseUrl}/getColleges`)
      .then((r) => alive && setColleges(Array.isArray(r.data?.data) ? r.data.data : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    const institutions = stats?.institutions ?? (colleges.length || 0);
    return [
      { key: "students", value: stats?.students || 0, label: "students signed up" },
      { key: "institutions", value: institutions, label: institutions === 1 ? "verified institute" : "verified institutes" },
      { key: "teachers", value: stats?.teachers || 0, label: "approved teachers" },
      { key: "classes", value: stats?.classes || 0, label: "classes created" },
      { key: "sessions", value: stats?.sessions || 0, label: "attendance sessions" },
    ].filter((s) => s.value > 0); // only show real, non-zero numbers
  }, [stats, colleges]);

  return { items, colleges };
};

const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setN(value);
    const controls = animate(0, value, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, reduce]);
  return <span ref={ref}>{n.toLocaleString("en-IN")}</span>;
};

/* ---------- small pieces ---------- */

const PlayStoreButton = ({ size = "md", light = false }) => {
  const gid = useSvgId("gp");
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-3 rounded-xl transition ${
        light ? "bg-white text-[#0B1B34] hover:bg-slate-50" : "bg-[#0B1B34] text-white hover:bg-black"
      } ${size === "sm" ? "px-3.5 py-2" : "px-5 py-3"}`}
    >
      <svg viewBox="0 0 24 24" className={size === "sm" ? "w-5 h-5" : "w-6 h-6"} aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00D7FE" />
            <stop offset="0.45" stopColor="#00F076" />
            <stop offset="0.7" stopColor="#FFD500" />
            <stop offset="1" stopColor="#FF3A44" />
          </linearGradient>
        </defs>
        <path d="M4.2 2.3c-.3.2-.5.6-.5 1.1v17.2c0 .5.2.9.5 1.1l9.6-9.7-9.6-9.7Zm10.7 8.6 2.9-2.9-11-6.3c-.4-.2-.8-.2-1.1-.1l9.2 9.3Zm0 2.2-9.2 9.3c.3.1.7.1 1.1-.1l11-6.3-2.9-2.9Zm3.9-4.5-3.1 3.4 3.1 3.4 3.1-1.8c.9-.5.9-2.7 0-3.2l-3.1-1.8Z" fill={`url(#${gid})`} />
      </svg>
      <span className="text-left leading-tight">
        <span className={`block uppercase tracking-wider ${size === "sm" ? "text-[8.5px]" : "text-[10px]"} opacity-70`}>Get it on</span>
        <span className={`block font-bold ${size === "sm" ? "text-sm" : "text-base"}`}>Google Play</span>
      </span>
    </a>
  );
};

const Eyebrow = ({ n, children, light }) => (
  <div className={`flex items-center gap-3 text-xs font-bold tracking-[0.18em] uppercase ${light ? "text-[#0BCCEB]" : "text-[#0A80F5]"}`}>
    <span className={`tabular-nums ${light ? "text-white/40" : "text-slate-300"}`}>{n}</span>
    <span className={`h-px w-8 ${light ? "bg-white/20" : "bg-slate-200"}`} />
    {children}
  </div>
);

const SectionTitle = ({ n, eyebrow, title, text, light, className = "" }) => (
  <motion.div {...reveal} className={`max-w-2xl ${className}`}>
    <Eyebrow n={n} light={light}>
      {eyebrow}
    </Eyebrow>
    <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.1] ${light ? "text-white" : INK}`}>{title}</h2>
    {text && <p className={`mt-4 text-base sm:text-lg leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>{text}</p>}
  </motion.div>
);

// Hand-drawn underline for one word in the hero headline
const Squiggle = () => (
  <svg className="absolute left-0 -bottom-2 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
    <motion.path
      d="M2 8 C 40 2, 70 12, 100 6 S 160 2, 198 7"
      fill="none"
      stroke="url(#sq)"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient id="sq" x1="0" x2="1">
        <stop offset="0" stopColor="#0BCCEB" />
        <stop offset="1" stopColor="#0A80F5" />
      </linearGradient>
    </defs>
  </svg>
);

/* ---------- shared navbar / footer pieces ---------- */

// Navbar and footer share this navy (#132A4A) and a white/15 border so they read as a pair.

/* ---------- navigation ---------- */

// Which section is on screen right now (for highlighting the nav link)
const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => window.scrollY < 300 && setActive(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);
  return active;
};

const NAV_IDS = NAV.map(([id]) => id);

const MenuIcon = ({ open }) => (
  <span className="relative block w-5 h-5" aria-hidden="true">
    <motion.span
      className="absolute left-0 top-1/2 -mt-px w-5 h-0.5 rounded-full bg-current"
      animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
    <motion.span
      className="absolute left-0 top-1/2 -mt-px h-0.5 rounded-full bg-current"
      animate={open ? { rotate: -45, y: 0, width: 20 } : { rotate: 0, y: 4, width: 14 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
  </span>
);

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Esc closes it, page behind doesn't scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    // let the menu close before scrolling so the body is scrollable again
    setTimeout(() => scrollTo(id), open ? 60 : 0);
  };

  const solid = scrolled || open;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#0B1B34]/25 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`relative mx-auto flex items-center justify-between gap-3 h-14 sm:h-16 pl-2.5 pr-2 sm:pl-3 rounded-2xl border border-white/15 bg-[#132A4A]/95 backdrop-blur-xl transition-[max-width,box-shadow] duration-500 ${
            solid ? "max-w-5xl shadow-[0_16px_40px_-14px_rgba(11,27,52,0.6)]" : "max-w-6xl shadow-[0_12px_32px_-16px_rgba(11,27,52,0.45)]"
          }`}
        >
          <BrandMark onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

          {/* Desktop links */}
          <div
            className="hidden lg:flex items-center gap-0.5 rounded-full p-1 bg-white/[0.06] ring-1 ring-white/10"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV.map(([id, label]) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => go(id)}
                  onMouseEnter={() => setHovered(id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {hovered === id && !isActive && (
                    <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] shadow-[0_4px_14px_-4px_rgba(11,204,235,0.7)]"
                      transition={{ type: "spring", stiffness: 450, damping: 36 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/signin" className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition">
              <LogIn className="w-4 h-4" /> Admin login
            </Link>
            <GetAppButton className="hidden sm:inline-flex" />
            <button
              onClick={() => setOpen((o) => !o)}
              className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-white transition ${open ? "bg-white/15" : "hover:bg-white/10"}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <MenuIcon open={open} />
            </button>
          </div>

        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden mx-auto max-w-5xl mt-2 rounded-2xl bg-white shadow-2xl shadow-[#0B1B34]/15 ring-1 ring-[#0B1B34]/5 overflow-hidden origin-top"
            >
              <nav className="p-2">
                {NAV.map(([id, label, Icon], i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                    onClick={() => go(id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${active === id ? "bg-[#EEF5FF]" : "hover:bg-slate-50"}`}
                  >
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${active === id ? "bg-[#0A80F5] text-white" : "bg-slate-100 text-[#0A80F5]"}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <span className={`flex-1 font-semibold ${active === id ? "text-[#0A80F5]" : INK}`}>{label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </motion.button>
                ))}
              </nav>
              <div className="p-3 pt-1 grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/60">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#0A80F5]/25"
                >
                  <Download className="w-4 h-4" /> Get the app
                </a>
                <Link to="/signin" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
                  <LogIn className="w-4 h-4" /> Admin login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

/* ---------- hero ---------- */

const HERO_SCENES = ["s-hotspot", "s-verify", "s-marked"];
const HERO_CAPTIONS = ["Connected to the class hotspot", "Fingerprint check", "Marked present"];

const Hero = ({ stats }) => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % HERO_SCENES.length), 2800);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      {/* faint blueprint grid */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,128,245,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,128,245,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
      <div className="absolute -z-10 top-24 right-[-10%] w-[520px] h-[520px] rounded-full bg-[#0BCCEB]/15 blur-[110px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-8 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A80F5]/20 bg-white/80 pl-1.5 pr-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#0A80F5] shadow-sm"
          >
            <span className="w-6 h-6 rounded-full bg-[#0A80F5] text-white flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </span>
            Hotspot + fingerprint attendance for colleges
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className={`mt-6 text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-[-0.03em] ${INK}`}
          >
            Attendance without the{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent">roll call.</span>
              <Squiggle />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl"
          >
            Students mark themselves present from their own phones, but only while connected to the teacher's classroom hotspot, and only after a
            fingerprint check. No names called. No proxies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <PlayStoreButton />
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white font-bold shadow-lg shadow-[#0A80F5]/25 hover:shadow-xl hover:shadow-[#0A80F5]/30 transition"
            >
              Register your institute
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button onClick={() => scrollTo("videos")} className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-slate-700 hover:bg-white/80 transition">
              <span className="w-8 h-8 rounded-full bg-white shadow ring-1 ring-slate-200 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-[#0A80F5] ml-0.5" fill="currentColor" />
              </span>
              See how it works
            </button>
          </motion.div>

          {stats.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                Live numbers from Present-Me
              </div>
              <div className="mt-4 flex flex-wrap gap-x-10 gap-y-5">
                {stats.map((s) => (
                  <div key={s.key}>
                    <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${INK}`}>
                      <CountUp value={s.value} />
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* phone demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <PhoneScreen id={HERO_SCENES[i]} />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="hidden sm:flex absolute -left-24 top-24 items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3 shadow-xl ring-1 ring-slate-100"
            >
              <span className="w-9 h-9 rounded-xl bg-[#EEF5FF] text-[#0A80F5] flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </span>
              <span className="text-xs leading-tight">
                <span className="block font-bold text-[#0B1B34]">Only in the room</span>
                <span className="text-slate-500">Needs the class hotspot</span>
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="hidden sm:flex absolute -right-36 bottom-28 items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3 shadow-xl ring-1 ring-slate-100"
            >
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Fingerprint className="w-5 h-5" />
              </span>
              <span className="text-xs leading-tight">
                <span className="block font-bold text-[#0B1B34]">Only the owner</span>
                <span className="text-slate-500">Fingerprint or phone lock</span>
              </span>
            </motion.div>
            <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
              {HERO_SCENES.map((s, idx) => (
                <button
                  key={s}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[#0A80F5]" : "w-3 bg-slate-300 hover:bg-slate-400"}`}
                  tabIndex={-1}
                />
              ))}
            </div>
            <div className="mt-2 text-center text-xs font-semibold text-slate-500 h-4">{HERO_CAPTIONS[i]}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


/* ---------- how it works ---------- */

const HOW = [
  {
    icon: Wifi,
    title: "Teacher opens the session",
    text: "The teacher turns on their phone's hotspot and starts attendance for the class. That hotspot becomes the classroom's boundary.",
  },
  {
    icon: Fingerprint,
    title: "Students connect and verify",
    text: "The app sees each student's phone join the teacher's hotspot, then asks for the owner's fingerprint or screen lock.",
  },
  {
    icon: CheckCircle2,
    title: "Attendance is saved instantly",
    text: "Marks show up on the teacher's screen live. Anyone missed can be marked manually, and records can be corrected later.",
  },
];

const HowItWorks = () => (
  <section id="how" className="scroll-mt-20 py-20 sm:py-28">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <SectionTitle
        n="01"
        eyebrow="How it works"
        title="Present only if you're actually in the room."
        text="Every mark has to pass two checks that a friend sitting at home can't fake."
      />

      <div className="mt-14 grid md:grid-cols-3 gap-5 relative">
        <div className="hidden md:block absolute top-9 left-[16%] right-[16%] border-t-2 border-dashed border-[#0A80F5]/25" />
        {HOW.map((s, i) => (
          <motion.div key={s.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }} className="relative">
            <div className="relative z-10 w-[72px] h-[72px] rounded-2xl bg-white shadow-lg shadow-[#0A80F5]/10 ring-1 ring-slate-100 flex items-center justify-center">
              <s.icon className="w-8 h-8 text-[#0A80F5]" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0B1B34] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
            </div>
            <h3 className={`mt-6 text-xl font-bold ${INK}`}>{s.title}</h3>
            <p className="mt-2 text-slate-600 leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div {...reveal} className="mt-14 rounded-2xl bg-white ring-1 ring-slate-200 p-6 sm:p-8 grid sm:grid-cols-[auto_1fr] gap-5 items-start">
        <div className="w-12 h-12 rounded-xl bg-[#0B1B34] text-white flex items-center justify-center">
          <Hand className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${INK}`}>No hotspot today? Nothing breaks.</h3>
          <p className="mt-1.5 text-slate-600 leading-relaxed">
            Teachers can switch to manual attendance with a tap, mark students present or absent from a list, and fix any record after class.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ---------- features ---------- */

const Tile = ({ className = "", children, i = 0 }) => (
  <motion.div
    {...reveal}
    transition={{ ...reveal.transition, delay: (i % 3) * 0.07 }}
    className={`rounded-3xl bg-white ring-1 ring-slate-200/80 p-6 sm:p-7 hover:ring-[#0A80F5]/30 hover:shadow-xl hover:shadow-[#0A80F5]/5 transition-all ${className}`}
  >
    {children}
  </motion.div>
);

const TileHead = ({ icon: Icon, title, text }) => (
  <>
    <Icon className="w-6 h-6 text-[#0A80F5]" />
    <h3 className={`mt-4 text-lg font-bold ${INK}`}>{title}</h3>
    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{text}</p>
  </>
);

const Features = () => (
  <section id="features" className="scroll-mt-20 py-20 sm:py-28 bg-white/60 border-y border-slate-200/70">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <SectionTitle
        n="02"
        eyebrow="Features"
        title="Everything a class needs, in one app."
        text="Attendance is the core, but students and teachers also get notices, a notes library and reports in the same place."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5">
        {/* big tile */}
        <Tile className="md:col-span-6 lg:col-span-4 lg:row-span-2 overflow-hidden relative !p-0 lg:min-h-[480px]" i={0}>
          <div className="p-6 sm:p-8 max-w-md relative z-10">
            <TileHead
              icon={Wifi}
              title="Hotspot attendance"
              text="Students can only mark present while connected to the teacher's hotspot, and every mark is confirmed with a fingerprint or screen lock."
            />
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {["Live count for the teacher", "Biometric check", "Manual fallback"].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-[#EEF5FF] text-[#0A80F5]">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:absolute lg:right-8 lg:-bottom-28 flex justify-center pb-8 lg:pb-0">
            <PhoneScreen id="t-session" />
          </div>
        </Tile>

        <Tile className="md:col-span-3 lg:col-span-2" i={1}>
          <TileHead icon={FileSpreadsheet} title="Reports in any format" text="Export attendance for any date range. Teachers export from the app, admins from the web panel." />
          <div className="mt-4 flex gap-2">
            {[
              [FileText, "PDF"],
              [FileSpreadsheet, "Excel"],
              [FileDown, "CSV"],
            ].map(([I, l]) => (
              <span key={l} className="flex-1 rounded-xl bg-slate-50 ring-1 ring-slate-100 py-2.5 flex flex-col items-center gap-1 text-xs font-bold text-slate-700">
                <I className="w-4 h-4 text-[#0A80F5]" />
                {l}
              </span>
            ))}
          </div>
        </Tile>

        <Tile className="md:col-span-3 lg:col-span-2" i={2}>
          <TileHead icon={Hash} title="Classes with join codes" text="Each class gets a 6-character code. Students ask to join and the teacher approves." />
          <div className="mt-4 flex gap-1.5">
            {"K7P2QX".split("").map((c, i) => (
              <span key={i} className={`flex-1 h-10 rounded-lg ring-1 ring-slate-200 flex items-center justify-center text-lg font-extrabold ${INK}`}>
                {c}
              </span>
            ))}
          </div>
        </Tile>

        <Tile className="md:col-span-2" i={0}>
          <TileHead icon={Megaphone} title="Class notices" text="Teachers post updates to a class and every enrolled student sees them in the app." />
        </Tile>

        <Tile className="md:col-span-2" i={1}>
          <TileHead icon={BookOpen} title="Notes & PYQs" text="A shared library of notes and previous-year papers, with offline downloads and a built-in PDF viewer." />
        </Tile>

        <Tile className="md:col-span-2 bg-gradient-to-br from-[#0B1B34] to-[#12305A] !ring-0 text-white" i={2}>
          <IndianRupee className="w-6 h-6 text-[#0BCCEB]" />
          <h3 className="mt-4 text-lg font-bold text-white">Earn from your notes</h3>
          <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">Approved uploads earn wallet rewards that students can withdraw to UPI from ₹10.</p>
        </Tile>

        <Tile className="md:col-span-3" i={0}>
          <TileHead icon={BarChart3} title="Attendance at a glance" text="Students see their percentage for every class and know early if they're slipping below the limit." />
          <div className="mt-5 space-y-2.5">
            {[
              ["Data Structures", 90],
              ["DBMS", 82],
              ["Discrete Maths", 71],
            ].map(([n, p]) => (
              <div key={n}>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>{n}</span>
                  <span className={p >= 75 ? "text-emerald-600" : "text-amber-600"}>{p}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${p >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Tile>

        <Tile className="md:col-span-3" i={1}>
          <TileHead icon={LayoutDashboard} title="Admin panel for HODs and Deans" text="Approve teachers, see every class and student, and download reports from the browser." />
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              [UserCheck, "Approve teachers"],
              [Users, "Student records"],
              [Download, "Class reports"],
            ].map(([I, l]) => (
              <span key={l} className="rounded-xl bg-slate-50 ring-1 ring-slate-100 p-3 text-xs font-semibold text-slate-700">
                <I className="w-4 h-4 text-[#0A80F5] mb-1.5" />
                {l}
              </span>
            ))}
          </div>
        </Tile>
      </div>
    </div>
  </section>
);

/* ---------- step-by-step guides ---------- */

const ROLE_ICON = { student: GraduationCap, teacher: Presentation, institute: Building2 };

const Guides = () => {
  const [role, setRole] = useState("student");
  const [step, setStep] = useState(0);
  const guide = GUIDES[role];
  const active = guide.steps[step];

  const pickRole = (r) => {
    setRole(r);
    setStep(0);
  };

  return (
    <section id="guide" className="scroll-mt-20 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <SectionTitle n="03" eyebrow="How to use" title="Up and running in a few minutes." text="Pick who you are and follow the steps." />
          <div role="tablist" className="inline-flex p-1.5 rounded-2xl bg-white ring-1 ring-slate-200 w-fit">
            {Object.entries(GUIDES).map(([id, g]) => {
              const Icon = ROLE_ICON[id];
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={role === id}
                  onClick={() => pickRole(id)}
                  className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    role === id ? "text-white" : "text-slate-600 hover:text-[#0B1B34]"
                  }`}
                >
                  {role === id && <motion.span layoutId="role-pill" className="absolute inset-0 rounded-xl bg-[#0B1B34]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <Icon className="relative w-4 h-4" />
                  <span className="relative">{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start">
          <ol className="space-y-3">
            {guide.steps.map((s, i) => {
              const on = i === step;
              return (
                <li key={s.title}>
                  <button
                    onClick={() => setStep(i)}
                    className={`w-full text-left rounded-2xl p-5 transition-all flex gap-4 ${
                      on ? "bg-white ring-2 ring-[#0A80F5] shadow-lg shadow-[#0A80F5]/10" : "ring-1 ring-slate-200 hover:bg-white/70"
                    }`}
                    aria-current={on ? "step" : undefined}
                  >
                    <span
                      className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                        on ? "bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className={`block font-bold ${on ? INK : "text-slate-700"}`}>{s.title}</span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="block overflow-hidden"
                          >
                            <span className="block pt-1.5 text-slate-600 leading-relaxed">{s.text}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </li>
              );
            })}
            <li className="pt-4 flex flex-wrap items-center gap-3">
              {guide.cta === "store" ? (
                <PlayStoreButton />
              ) : (
                <>
                  <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white font-bold shadow-lg shadow-[#0A80F5]/25">
                    Register your institute <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/signin" className="px-5 py-3 rounded-xl ring-1 ring-slate-300 font-semibold text-slate-700 hover:bg-white">
                    Admin login
                  </Link>
                </>
              )}
            </li>
          </ol>

          <div className={`lg:sticky lg:top-24 flex justify-center ${guide.frame === "browser" ? "lg:w-[560px]" : "lg:w-[320px]"}`}>
            {guide.frame === "browser" ? <BrowserScreen id={active.scene} className="max-w-[560px]" /> : <PhoneScreen id={active.scene} />}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- videos ---------- */

const SCENE_MS = 3600;

const YouTubePlayer = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="group absolute inset-0 w-full h-full" aria-label={`Play video: ${video.title}`}>
          <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-20 h-20 rounded-full bg-white/95 shadow-2xl flex items-center justify-center group-hover:scale-105 transition">
              <Play className="w-8 h-8 text-[#0A80F5] ml-1" fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

// Plays the app screens for a walkthrough like a short video, with chapter controls.
const WalkthroughPlayer = ({ video }) => {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const total = video.scenes.length;
  const done = idx === total - 1 && elapsed >= SCENE_MS;

  useEffect(() => {
    setIdx(0);
    setElapsed(0);
  }, [video.id]);

  useEffect(() => {
    if (!playing || !inView || done) return;
    const t = setInterval(() => setElapsed((e) => Math.min(e + 100, SCENE_MS)), 100);
    return () => clearInterval(t);
  }, [playing, inView, done]);

  // Move to the next step when the current one finishes
  useEffect(() => {
    if (elapsed >= SCENE_MS && idx < total - 1) {
      setIdx((i) => i + 1);
      setElapsed(0);
    }
  }, [elapsed, idx, total]);

  const jump = (i) => {
    setIdx(i);
    setElapsed(0);
  };
  const toggle = () => {
    if (done) {
      jump(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  };

  const scene = video.scenes[idx];
  const seconds = Math.floor((idx * SCENE_MS + elapsed) / 1000);
  const totalSeconds = Math.round((total * SCENE_MS) / 1000);

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden bg-[#0B1B34] ring-1 ring-white/10">
      <div className="relative aspect-video">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 20%, rgba(11,204,235,0.35), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(10,128,245,0.45), transparent 60%)",
          }}
        />
        <ScaledStage width={960} height={540} maxScale={2} className="absolute inset-0">
          <div className="relative w-[960px] h-[540px] flex items-center justify-center gap-14 px-14">
            {video.frame === "browser" ? (
              <div className="w-[760px]">
                <BrowserFrame>
                  <div className="relative w-[760px] h-[475px]">
                    <div className="relative w-[640px] h-[400px] origin-top-left" style={{ transform: "scale(1.1875)" }}>
                      <Screen id={scene.scene} />
                    </div>
                  </div>
                </BrowserFrame>
              </div>
            ) : (
              <>
                <div className="scale-[0.9]">
                  <PhoneFrame>
                    <Screen id={scene.scene} />
                  </PhoneFrame>
                </div>
                <div className="hidden sm:block w-[380px] text-white">
                  <div className="text-sm font-bold tracking-[0.18em] uppercase text-[#0BCCEB]">
                    Step {idx + 1} of {total}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={scene.caption}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-[28px] font-bold leading-snug"
                    >
                      {scene.caption}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </ScaledStage>
        {video.frame === "browser" && (
          <div className="absolute bottom-3 inset-x-3 sm:bottom-5 sm:inset-x-5">
            <AnimatePresence mode="wait">
              <motion.p
                key={scene.caption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto w-fit max-w-full rounded-lg bg-[#0B1B34]/85 backdrop-blur px-3 py-2 text-xs sm:text-sm font-semibold text-white text-center"
              >
                {scene.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>

      {video.frame !== "browser" && (
        <div className="sm:hidden px-4 pt-3 min-h-[3.5rem]">
          <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#0BCCEB]">
            Step {idx + 1} of {total}
          </div>
          <p className="mt-1 text-sm font-semibold text-white leading-snug">{scene.caption}</p>
        </div>
      )}

      {/* controls */}
      <div className="px-4 py-3 flex items-center gap-3 border-t border-white/10">
        <button onClick={toggle} className="w-9 h-9 rounded-full bg-white text-[#0B1B34] flex items-center justify-center shrink-0" aria-label={done ? "Replay" : playing ? "Pause" : "Play"}>
          {done ? <RotateCcw className="w-4 h-4" /> : playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
        </button>
        <div className="flex-1 flex gap-1">
          {video.scenes.map((s, i) => (
            <button key={i} onClick={() => jump(i)} className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden" aria-label={`Go to step ${i + 1}`}>
              <span
                className="block h-full bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5]"
                style={{ width: i < idx ? "100%" : i === idx ? `${Math.min(100, (elapsed / SCENE_MS) * 100)}%` : "0%" }}
              />
            </button>
          ))}
        </div>
        <span className="text-xs tabular-nums text-slate-400 shrink-0">
          0:{String(Math.min(seconds, totalSeconds)).padStart(2, "0")} / 0:{String(totalSeconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

const Videos = () => {
  const [active, setActive] = useState(VIDEOS[0].id);
  const video = VIDEOS.find((v) => v.id === active);

  return (
    <section id="videos" className="scroll-mt-20 py-20 sm:py-28 bg-[#0B1B34] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle n="04" eyebrow="Watch" light title="See Present-Me in action." text="Short walkthroughs for students, teachers and institute admins. Pick one and press play." />

        <div className="mt-12 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <motion.div {...reveal}>{video.youtubeId ? <YouTubePlayer key={video.id} video={video} /> : <WalkthroughPlayer key={video.id} video={video} />}</motion.div>

          <motion.ul {...reveal} className="space-y-2">
            {VIDEOS.map((v) => {
              const on = v.id === active;
              return (
                <li key={v.id}>
                  <button
                    onClick={() => setActive(v.id)}
                    className={`w-full text-left rounded-xl p-4 flex gap-3.5 items-center transition ${on ? "bg-white/10 ring-1 ring-[#0BCCEB]/60" : "hover:bg-white/5 ring-1 ring-white/10"}`}
                  >
                    <span className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${on ? "bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5]" : "bg-white/10"}`}>
                      <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0BCCEB]">{v.audience}</span>
                      <span className="block font-semibold leading-snug">{v.title}</span>
                      <span className="block text-xs text-slate-400 mt-0.5">
                        {v.youtubeId ? "Video" : `${v.scenes.length} steps · ${Math.round((v.scenes.length * SCENE_MS) / 1000)} sec`}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

/* ---------- institutes ---------- */

const ForInstitutes = () => (
  <section id="institutes" className="scroll-mt-20 py-20 sm:py-28">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div>
        <SectionTitle
          n="05"
          eyebrow="For institutes"
          title="One dashboard for the whole department."
          text="HODs and Deans get a web panel to approve teachers, look up any student, and pull attendance for any class without asking anyone for a spreadsheet."
        />
        <motion.ul {...reveal} className="mt-8 space-y-3">
          {[
            "Only teachers you approve can create classes",
            "Every institute is verified with ID proof before it goes live",
            "Class-wise attendance with Good / Average / Poor breakdowns",
            "Exports as PDF, Excel or CSV for any date range",
          ].map((t) => (
            <li key={t} className="flex gap-3 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-[#0A80F5] shrink-0 mt-0.5" />
              {t}
            </li>
          ))}
        </motion.ul>
        <motion.div {...reveal} className="mt-9 flex flex-wrap gap-3">
          <Link to="/signup" className="group inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white font-bold shadow-lg shadow-[#0A80F5]/25">
            Register your institute <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/signin" className="px-5 py-3.5 rounded-xl ring-1 ring-slate-300 font-semibold text-slate-700 hover:bg-white">
            Admin login
          </Link>
        </motion.div>
      </div>
      <motion.div {...reveal} className="relative">
        <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-[#0BCCEB]/15 to-[#0A80F5]/10 blur-2xl" />
        <BrowserScreen id="a-dashboard" />
      </motion.div>
    </div>
  </section>
);

/* ---------- FAQ ---------- */

const Faq = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28 bg-white/60 border-t border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <div>
          <SectionTitle n="06" eyebrow="FAQ" title="Questions we get asked a lot." />
          <motion.div {...reveal} className="mt-8 rounded-2xl bg-[#0B1B34] text-white p-6">
            <div className="font-bold text-lg">Still unsure about something?</div>
            <p className="mt-1.5 text-sm text-slate-300">Talk to us. We usually reply within a day.</p>
            <div className="mt-5 space-y-2.5 text-sm">
              <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2.5 hover:text-[#0BCCEB]">
                <Mail className="w-4 h-4 text-[#0BCCEB]" /> {SUPPORT_EMAIL}
              </a>
              <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-[#0BCCEB]">
                <Phone className="w-4 h-4 text-[#0BCCEB]" /> {SUPPORT_PHONE}
              </a>
            </div>
          </motion.div>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q}>
                <button onClick={() => setOpen(on ? -1 : i)} className="w-full flex items-center justify-between gap-6 py-5 text-left" aria-expanded={on}>
                  <span className={`text-base sm:text-lg font-semibold ${on ? "text-[#0A80F5]" : INK}`}>{f.q}</span>
                  <span className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition ${on ? "bg-[#0A80F5] text-white" : "bg-slate-100 text-slate-600"}`}>
                    {on ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="pb-5 pr-12 text-slate-600 leading-relaxed">
                        {f.a}
                        {f.q.startsWith("Can I delete") && (
                          <>
                            {" "}
                            <Link to="/delete_account" className="text-[#0A80F5] font-semibold hover:underline">
                              Go to Delete account
                            </Link>
                          </>
                        )}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ---------- final CTA + footer ---------- */

const FinalCta = () => (
  <section className="py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-8 sm:p-12 lg:p-14 text-white">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full border-[40px] border-white/10" />
        <div className="absolute right-24 -bottom-24 w-56 h-56 rounded-full border-[30px] border-white/10" />
        <div className="relative grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">Take your next class's attendance with Present-Me.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 p-5">
              <GraduationCap className="w-6 h-6" />
              <div className="mt-3 font-bold">Students & teachers</div>
              <p className="mt-1 text-sm text-white/80">Download the Android app and sign up under your college.</p>
              <div className="mt-4">
                <PlayStoreButton size="sm" light />
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 p-5">
              <Building2 className="w-6 h-6" />
              <div className="mt-3 font-bold">HODs & Deans</div>
              <p className="mt-1 text-sm text-white/80">Register your institute on the web and start approving teachers.</p>
              <Link to="/signup" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#0A80F5] text-sm font-bold">
                Register <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const FooterHeading = ({ children }) => <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#0BCCEB]">{children}</div>;

const footerLink = "text-slate-300 hover:text-white transition-colors";

const Footer = () => (
  <footer id="contact" className="relative overflow-hidden border-t border-white/15 bg-[#132A4A]">
    {/* soft brand glow */}
    <div className="pointer-events-none absolute -top-28 left-[5%] w-96 h-96 rounded-full bg-[#0BCCEB]/15 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-40 right-[5%] w-[32rem] h-[32rem] rounded-full bg-[#0A80F5]/20 blur-3xl" />

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10 grid sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.3fr] gap-10">
      <div>
        <BrandMark />
        <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-xs">Proxy-proof attendance for colleges, with notices, notes and reports built in.</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <GetAppButton className="inline-flex" />
          <Link to="/signin" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition">
            <LogIn className="w-4 h-4" /> Admin login
          </Link>
        </div>
      </div>

      <div>
        <FooterHeading>Product</FooterHeading>
        <ul className="mt-5 space-y-1 text-sm">
          {NAV.map(([id, label, Icon]) => (
            <li key={id}>
              <button onClick={() => scrollTo(id)} className={`group flex items-center gap-2.5 py-1 ${footerLink}`}>
                <span className="w-7 h-7 rounded-lg bg-white/[0.06] ring-1 ring-white/10 flex items-center justify-center text-[#0BCCEB] group-hover:bg-gradient-to-br group-hover:from-[#0BCCEB] group-hover:to-[#0A80F5] group-hover:text-white group-hover:ring-transparent transition">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <FooterHeading>Account</FooterHeading>
        <ul className="mt-5 space-y-3 text-sm">
          {[
            ["/signup", "Register institute"],
            ["/signin", "Admin login"],
            ["/privacy-policy", "Privacy policy"],
            ["/delete_account", "Delete account"],
          ].map(([to, label]) => (
            <li key={to}>
              <Link to={to} className={`group inline-flex items-center gap-1.5 ${footerLink}`}>
                {label}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <FooterHeading>Contact</FooterHeading>
        <ul className="mt-5 space-y-3 text-sm">
          <li>
            <a href={`mailto:${SUPPORT_EMAIL}`} className={`flex items-center gap-2.5 ${footerLink}`}>
              <Mail className="w-4 h-4 text-[#0BCCEB] shrink-0" /> {SUPPORT_EMAIL}
            </a>
          </li>
          <li>
            <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className={`flex items-center gap-2.5 ${footerLink}`}>
              <Phone className="w-4 h-4 text-[#0BCCEB] shrink-0" /> {SUPPORT_PHONE}
            </a>
          </li>
          <li className="flex items-center gap-2.5 text-slate-300">
            <MapPin className="w-4 h-4 text-[#0BCCEB] shrink-0" /> {LOCATION}
          </li>
        </ul>
      </div>
    </div>

    <div className="relative border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
        <span>© {new Date().getFullYear()} Present-Me · Made in Gorakhpur, India</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3.5 py-1.5 font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowUp className="w-3.5 h-3.5" /> Back to top
        </button>
      </div>
    </div>
  </footer>
);

/* ---------- page ---------- */

const IntroPage = () => {
  const { items, colleges } = useLiveStats();

  // Support links like /#faq
  const jumpToHash = useCallback(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => scrollTo(id), 50);
  }, []);
  useEffect(jumpToHash, [jumpToHash]);

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-slate-800 overflow-x-clip antialiased" style={FONT}>
      <Nav />
      <main>
        <Hero stats={items} />
      
        <HowItWorks />
        <Features />
        <Guides />
        <Videos />
        <ForInstitutes />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export default IntroPage;
