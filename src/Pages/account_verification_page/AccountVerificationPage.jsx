import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Building2,
  Check,
  Clock,
  FileCheck2,
  FileSearch,
  FileSpreadsheet,
  FileX2,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { BaseUrl } from "../../utils/constants";
import { BrandMark } from "../../components/common/Brand";
import { BrowserScreen } from "../Present-Me landingPage/mockups";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "../Present-Me landingPage/landingContent";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
// Reviews normally finish within two days; past this we suggest getting in touch
const SLOW_REVIEW_HOURS = 72;

const UNLOCKS = [
  [UserCheck, "Approve teachers as they sign up under your institute"],
  [Users, "See every student's classes and attendance"],
  [FileSpreadsheet, "Download attendance as PDF, Excel or CSV"],
];

/* ---------- helpers ---------- */

const hoursSince = (iso) => {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? (Date.now() - t) / 36e5 : null;
};

const timeAgo = (iso) => {
  const h = hoursSince(iso);
  if (h === null || h < 0) return null;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (h < 1 / 60) return "just now";
  if (h < 1) return rtf.format(-Math.round(h * 60), "minute");
  if (h < 24) return rtf.format(-Math.round(h), "hour");
  return rtf.format(-Math.round(h / 24), "day");
};

const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

const formatPhone = (phone) => {
  const d = String(phone || "").replace(/\D/g, "");
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return phone || null;
};

const formatCount = (n) => {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString("en-IN") : null;
};

const supportMail = (subject) => `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

/* ---------- left panel (desktop) ---------- */

const PreviewPanel = ({ institute }) => (
  <aside className="hidden lg:flex relative m-3 mr-0 rounded-[1.75rem] overflow-hidden border border-white/15 bg-[#132A4A] text-white flex-col">
    <div className="pointer-events-none absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#0BCCEB]/20 blur-3xl" />
    <div className="pointer-events-none absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#0A80F5]/25 blur-3xl" />
    <div
      className="pointer-events-none absolute inset-0 opacity-50"
      style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)", backgroundSize: "26px 26px" }}
    />

    <div className="relative px-10 xl:px-14 pt-10">
      <Link to="/" className="inline-block">
        <BrandMark />
      </Link>
    </div>

    <div className="relative px-10 xl:px-14 mt-12 xl:mt-16 max-w-xl">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[0.18em] text-[#0BCCEB]">
        Almost there
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-4 text-4xl xl:text-[2.75rem] font-extrabold tracking-tight leading-[1.1]"
      >
        Your admin panel is nearly ready.
      </motion.h1>
      <p className="mt-4 text-slate-300 leading-relaxed">
        As soon as {institute ? <span className="font-semibold text-white">{institute}</span> : "your institute"} is verified, you'll be able to:
      </p>
      <ul className="mt-6 space-y-3.5">
        {UNLOCKS.map(([Icon, text], i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="flex items-center gap-3 text-slate-200"
          >
            <span className="w-8 h-8 rounded-lg bg-white/[0.07] ring-1 ring-white/10 flex items-center justify-center text-[#0BCCEB] shrink-0">
              <Icon className="w-4 h-4" />
            </span>
            {text}
          </motion.li>
        ))}
      </ul>
    </div>

    {/* the screen they'll land on first, still locked */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-auto h-[240px] xl:h-[300px] pl-10 xl:pl-14 translate-x-10"
    >
      <div className="relative w-[640px] max-w-none rotate-[-2deg] origin-top-left">
        <BrowserScreen id="a-approve" />
        <div className="absolute inset-x-0 top-8 bottom-0 bg-gradient-to-b from-[#132A4A]/10 to-[#132A4A]/60" />
      </div>
      <span className="absolute left-10 xl:left-14 -top-12 inline-flex items-center gap-2 rounded-full bg-white/[0.07] ring-1 ring-white/15 px-3.5 py-1.5 text-xs font-bold text-slate-200">
        <Lock className="w-3.5 h-3.5 text-[#0BCCEB]" /> Unlocks after verification
      </span>
    </motion.div>
  </aside>
);

/* ---------- review timeline ---------- */

const TimelineStep = ({ state, icon: Icon, title, meta, children, last }) => (
  <li className="relative flex gap-4 pb-6 last:pb-0">
    {!last && <span className={`absolute left-[19px] top-11 bottom-1 w-0.5 rounded-full ${state === "done" ? "bg-[#0BCCEB]" : "bg-slate-200"}`} />}
    <span className="relative shrink-0 w-10 h-10">
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          state === "done"
            ? "bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white shadow-md shadow-[#0A80F5]/25"
            : state === "current"
            ? "bg-amber-50 text-amber-600 ring-2 ring-amber-300 shadow-[0_0_0_6px_rgba(251,191,36,0.15)]"
            : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
        }`}
      >
        {state === "done" ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
      </span>
    </span>
    <div className="min-w-0 pt-1.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className={`text-sm font-bold ${state === "upcoming" ? "text-slate-500" : "text-[#0B1B34]"}`}>{title}</span>
        {state === "current" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">In progress</span>}
        {meta && <span className="text-xs text-slate-400">{meta}</span>}
      </div>
      <p className="mt-1 text-sm text-slate-500 leading-relaxed">{children}</p>
    </div>
  </li>
);

/* ---------- submitted details ---------- */

const Detail = ({ icon: Icon, label, children, className = "" }) => (
  <div className={`flex gap-3 min-w-0 ${className}`}>
    <span className="w-8 h-8 rounded-lg bg-[#EEF5FF] text-[#0A80F5] flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4" />
    </span>
    <div className="min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-[#0B1B34] break-words">{children}</div>
    </div>
  </div>
);

const DocChip = ({ label, uploaded }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${
      uploaded ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-800 ring-amber-200"
    }`}
  >
    {uploaded ? <FileCheck2 className="w-3.5 h-3.5" /> : <FileX2 className="w-3.5 h-3.5" />}
    {label}
    <span className="font-normal opacity-80">{uploaded ? "received" : "missing"}</span>
  </span>
);

const SubmittedDetails = ({ app }) => {
  const name = [app.firstName, app.lastName].filter(Boolean).join(" ");
  const phone = formatPhone(app.phone);
  const site = app.website ? app.website.replace(/^https?:\/\//i, "").replace(/\/$/, "") : null;
  const students = formatCount(app.expectedStudents);
  const teachers = formatCount(app.expectedTeachers);
  const submitted = timeAgo(app.createdAt);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="mt-5 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <h3 className="text-sm font-bold text-[#0B1B34]">What you sent us</h3>
        {submitted && <span className="text-xs text-slate-400">Submitted {submitted}</span>}
      </div>

      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4 p-5">
        {name && (
          <Detail icon={User} label="Applicant">
            {name}
            {app.Role && <span className="font-normal text-slate-500"> · {app.Role}</span>}
          </Detail>
        )}
        {app.InstitutionName && (
          <Detail icon={Building2} label="Institute">
            {app.InstitutionName}
          </Detail>
        )}
        {app.emailId && (
          <Detail icon={AtSign} label="Email">
            {app.emailId}
          </Detail>
        )}
        {phone && (
          <Detail icon={Phone} label="Mobile">
            {phone}
          </Detail>
        )}
        {site && (
          <Detail icon={Globe} label="Website">
            <a
              href={/^https?:\/\//i.test(app.website) ? app.website : `https://${app.website}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#0A80F5] hover:underline"
            >
              {site}
            </a>
          </Detail>
        )}
        {(students || teachers) && (
          <Detail icon={Users} label="Expected size">
            {[students && `${students} students`, teachers && `${teachers} teachers`].filter(Boolean).join(" · ")}
          </Detail>
        )}
        {app.address && (
          <Detail icon={MapPin} label="Address" className="sm:col-span-2">
            <span className="font-medium">{app.address}</span>
          </Detail>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">ID documents</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <DocChip label="Aadhaar" uploaded={!!app.aadharUrl} />
          <DocChip label="Designation ID" uploaded={!!app.designationIDUrl} />
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3.5 text-sm text-slate-500">
        Something wrong here?{" "}
        <a
          href={supportMail(`Correction to registration: ${app.emailId || app.InstitutionName || ""}`)}
          className="font-semibold text-[#0A80F5] hover:text-[#0B1B34]"
        >
          Email us the correction
        </a>{" "}
        and we'll update it before approving.
      </div>
    </motion.section>
  );
};

/* ---------- page ---------- */

const AccountVerificationPage = () => {
  const navigate = useNavigate();
  const stored = useSelector((store) => store.user);
  // Sign-in puts the institution in the store before sending pending accounts here.
  // After a refresh the store is empty, so the page falls back to a generic view.
  const [app, setApp] = useState(() => (stored?.status === "pending" ? stored : null));

  useEffect(() => {
    let alive = true;

    const logout = () => axios.post(BaseUrl + "/admin/logout", {}, { withCredentials: true }).catch(() => {});

    const run = async () => {
      if (stored?.status === "verified") {
        navigate("/admin", { replace: true });
        return;
      }
      if (!stored) {
        // Opened directly: see whose session this is before clearing it
        try {
          const res = await axios.get(BaseUrl + "/admin/profile", { withCredentials: true });
          if (!alive) return;
          if (res.data?.status === "verified") {
            navigate("/admin", { replace: true });
            return;
          }
          if (res.data?.status === "pending") setApp(res.data);
        } catch {
          /* not signed in */
        }
      }
      // A pending account can't use the panel yet, so don't leave a session behind
      logout();
    };

    run();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = app?.firstName?.trim();
  const institute = app?.InstitutionName?.trim();
  const submittedAt = app?.createdAt ? formatDate(app.createdAt) : null;
  const waited = app?.createdAt ? hoursSince(app.createdAt) : null;
  const slow = waited !== null && waited > SLOW_REVIEW_HOURS;
  const missingDocs = app ? [!app.aadharUrl && "Aadhaar", !app.designationIDUrl && "designation ID"].filter(Boolean) : [];

  const checkStatus = () => navigate("/signin", { state: app?.emailId ? { email: app.emailId } : undefined });

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-slate-800 antialiased grid lg:grid-cols-[0.95fr_1.05fr]" style={FONT}>
      <PreviewPanel institute={institute} />

      <main className="relative flex flex-col min-h-screen px-5 sm:px-10">
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-[#0BCCEB]/10 blur-3xl" />

        {/* top bar */}
        <div className="relative flex items-center justify-between pt-6 lg:pt-8">
          <Link to="/" className="lg:invisible">
            <BrandMark tone="light" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-[#0B1B34] hover:bg-white hover:shadow-sm transition">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[540px] mx-auto my-auto py-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 ring-1 ring-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-amber-400 opacity-75 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-amber-500" />
            </span>
            Under review
          </span>

          <h2 className="mt-4 text-3xl sm:text-[2rem] font-extrabold tracking-tight text-[#0B1B34] leading-tight">
            {firstName ? `Thanks, ${firstName}. We're checking your details.` : "Your registration is under review"}
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {institute ? (
              <>
                We verify every institute before its admin panel opens. <span className="font-semibold text-[#0B1B34]">{institute}</span> is in the queue, and most
                reviews finish within 24–48 hours.
              </>
            ) : (
              "We verify every institute before its admin panel opens. Most reviews finish within 24–48 hours, and you can sign in any time to check."
            )}
          </p>

          {/* where the review is up to */}
          <section className="mt-7 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-5">
            <ol>
              <TimelineStep state="done" icon={Check} title="Registration received" meta={submittedAt}>
                {missingDocs.length ? (
                  <>
                    Your details reached us, but we didn't receive your {missingDocs.join(" or ")}.{" "}
                    <a
                      href={supportMail(`Missing ID document: ${app.emailId || institute || ""}`)}
                      className="font-semibold text-[#0A80F5] hover:text-[#0B1B34]"
                    >
                      Email it to us
                    </a>{" "}
                    so the review isn't held up.
                  </>
                ) : (
                  "Your details and ID documents reached us safely."
                )}
              </TimelineStep>
              <TimelineStep state="current" icon={FileSearch} title="Checking your documents">
                We match your Aadhaar and designation ID with the role you applied for
                {app?.Role ? <span className="font-semibold text-slate-700"> ({app.Role})</span> : null}. If anything is unclear, we'll contact you on the email or
                mobile number you gave us.
              </TimelineStep>
              <TimelineStep state="upcoming" icon={Lock} title="Admin panel unlocks" last>
                Sign in{app?.emailId ? <> with <span className="font-semibold text-slate-700">{app.emailId}</span></> : null} and your dashboard opens. Teachers can then pick{" "}
                {institute || "your institute"} when they sign up in the app.
              </TimelineStep>
            </ol>

            {slow && (
              <div className="mt-5 flex gap-3 rounded-xl bg-amber-50 ring-1 ring-amber-200 p-3.5 text-sm text-amber-900">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  This is taking longer than usual.{" "}
                  <a href={supportMail(`Registration review: ${app.emailId || institute || ""}`)} className="font-semibold underline underline-offset-2">
                    Email us
                  </a>{" "}
                  and we'll look into it.
                </span>
              </div>
            )}
          </section>

          {app && <SubmittedDetails app={app} />}

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={checkStatus}
              className="group inline-flex sm:flex-1 items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white font-bold shadow-lg shadow-[#0A80F5]/25 hover:shadow-[#0A80F5]/40 transition-shadow"
            >
              Sign in to check status
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white ring-1 ring-slate-200 font-semibold text-slate-700 hover:ring-slate-300 transition"
            >
              Back to home
            </Link>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-x-5 gap-y-2 rounded-xl bg-[#EEF5FF] px-4 py-3 text-sm">
            <span className="font-semibold text-[#0B1B34]">Questions?</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0A80F5]">
              <Mail className="w-4 h-4 text-[#0A80F5]" /> {SUPPORT_EMAIL}
            </a>
            <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0A80F5]">
              <Phone className="w-4 h-4 text-[#0A80F5]" /> {SUPPORT_PHONE}
            </a>
          </div>
        </motion.div>

        <footer className="relative pb-6 text-xs text-slate-500 flex flex-wrap items-center justify-center lg:justify-between gap-x-4 gap-y-2">
          <span>© {new Date().getFullYear()} Present-Me</span>
          <span className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-[#0B1B34]">
              Privacy policy
            </Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#0B1B34]">
              Need help?
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
};

export default AccountVerificationPage;
