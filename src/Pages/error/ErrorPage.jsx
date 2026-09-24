import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, isRouteErrorResponse, useLocation, useNavigate, useRouteError } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Copy, Home, Mail, RotateCw, X } from "lucide-react";
import { BrandMark } from "../../components/common/Brand";
import { SUPPORT_EMAIL } from "../Present-Me landingPage/landingContent";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };

const ADMIN_LINKS = [
  ["/admin", "Dashboard"],
  ["/admin/teachers", "Teachers"],
  ["/admin/students", "Students"],
  ["/admin/attendance", "Attendance reports"],
];

const SITE_LINKS = [
  ["/", "Home"],
  ["/signin", "Admin sign in"],
  ["/signup", "Register your institute"],
  ["/privacy-policy", "Privacy policy"],
];

const shorten = (path, max = 30) => (path.length > max ? `${path.slice(0, max - 1)}…` : path);

/* A page of the attendance register, with the missing URL marked absent */
const Register = ({ path, known }) => (
  <motion.div
    initial={{ opacity: 0, y: 16, rotate: 0 }}
    animate={{ opacity: 1, y: 0, rotate: -2 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-sm rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_30px_60px_-30px_rgba(11,27,52,0.35)] overflow-hidden"
  >
    <div className="flex items-center justify-between bg-[#132A4A] px-5 py-3.5 text-white">
      <span className="text-sm font-bold">Page register</span>
      <span className="text-xs text-slate-300">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
    </div>
    <ol className="divide-y divide-slate-100">
      {known.map(([to], i) => (
        <li key={to} className="flex items-center gap-3 px-5 py-3">
          <span className="w-5 text-xs tabular-nums text-slate-400">{i + 1}</span>
          <code className="flex-1 truncate text-sm text-slate-600">{to}</code>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
            <Check className="w-3 h-3" strokeWidth={3} /> Present
          </span>
        </li>
      ))}
      <motion.li
        initial={{ backgroundColor: "rgba(254,242,242,0)" }}
        animate={{ backgroundColor: "rgba(254,242,242,1)" }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex items-center gap-3 px-5 py-3"
      >
        <span className="w-5 text-xs tabular-nums text-slate-400">{known.length + 1}</span>
        <code className="flex-1 truncate text-sm font-semibold text-[#0B1B34]" title={path}>
          {shorten(path)}
        </code>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.75, type: "spring", stiffness: 400, damping: 18 }}
          className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700"
        >
          <X className="w-3 h-3" strokeWidth={3} /> Absent
        </motion.span>
      </motion.li>
    </ol>
  </motion.div>
);

/* What went wrong, in a form that's easy to pass on to support */
const ErrorReport = ({ path, message, time, copied, onCopy, mailto }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-md rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_30px_60px_-30px_rgba(11,27,52,0.35)] overflow-hidden"
  >
    <div className="flex items-center justify-between bg-[#132A4A] px-5 py-3.5 text-white">
      <span className="text-sm font-bold">Error report</span>
      <span className="text-xs text-slate-300">{time}</span>
    </div>
    <dl className="divide-y divide-slate-100">
      <div className="px-5 py-3">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Page</dt>
        <dd className="mt-0.5 font-mono text-sm text-slate-700 break-all">{path}</dd>
      </div>
      <div className="px-5 py-3 bg-red-50/70">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-red-400">What went wrong</dt>
        <dd className="mt-0.5 font-mono text-sm text-red-700 break-words">{message}</dd>
      </div>
    </dl>
    <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 px-5 py-3.5 text-sm">
      <button type="button" onClick={onCopy} className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-[#0A80F5]">
        {copied === "ok" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        {copied === "ok" ? "Copied" : copied === "fail" ? "Couldn't copy" : "Copy details"}
      </button>
      <a href={mailto} className="inline-flex items-center gap-1.5 font-semibold text-[#0A80F5] hover:text-[#0B1B34]">
        <Mail className="w-4 h-4" /> Email this to support
      </a>
    </div>
  </motion.div>
);

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(null);
  const [time] = useState(() => new Date());

  const status = isRouteErrorResponse(error) ? error.status : null;
  const notFound = status === 404;
  const inAdmin = location.pathname.startsWith("/admin");
  const links = inAdmin ? ADMIN_LINKS : SITE_LINKS;
  // "default" is the first entry of this visit, so there's nothing of ours to go back to
  const canGoBack = location.key !== "default";

  const message = isRouteErrorResponse(error) ? error.data?.message || error.statusText || `Error ${error.status}` : error?.message || String(error ?? "Unknown error");
  const report = [`Page: ${window.location.href}`, `Error: ${message}`, `Time: ${time.toISOString()}`, `Browser: ${navigator.userAgent}`].join("\n");

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    setTimeout(() => setCopied(null), 1800);
  };

  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(notFound ? "Broken link on Present-Me" : "Error on Present-Me")}&body=${encodeURIComponent(
    `${notFound ? "I followed a link that doesn't work." : "I ran into an error."}\n\n${report}`
  )}`;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip bg-[#F7FAFF] text-slate-800 antialiased" style={FONT}>
      <div className="pointer-events-none absolute -top-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-[#0BCCEB]/10 blur-3xl" />

      <header className="relative max-w-6xl w-full mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/">
          <BrandMark tone="light" />
        </Link>
        <a href={mailto} className="text-sm font-semibold text-slate-600 hover:text-[#0B1B34]">
          Need help?
        </a>
      </header>

      <main className="relative flex-1 flex items-center">
        <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 py-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className={`min-w-0 lg:order-1 ${notFound ? "order-2" : "order-1"}`}>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                notFound ? "bg-white text-[#0A80F5] ring-[#0A80F5]/15" : "bg-red-50 text-red-700 ring-red-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${notFound ? "bg-[#0A80F5]" : "bg-red-500"}`} />
              {notFound ? "Error 404" : status ? `Error ${status}` : "Unexpected error"}
            </span>

            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0B1B34] leading-[1.08]">
              {notFound ? "This page is marked absent." : "Something broke on our side."}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600 leading-relaxed">
              {notFound ? (
                <>
                  We couldn't find{" "}
                  <code className="rounded-md bg-white ring-1 ring-slate-200 px-1.5 py-0.5 text-[0.9em] text-[#0B1B34] break-all">{location.pathname}</code>. The link may be
                  old, or there could be a typo in the address.
                </>
              ) : (
                "This page hit an error while loading. Reloading usually sorts it out. If it keeps happening, send us the details and we'll fix it."
              )}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {notFound ? (
                <Link
                  to={inAdmin ? "/admin" : "/"}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] font-bold text-white shadow-lg shadow-[#0A80F5]/25 hover:shadow-[#0A80F5]/40 transition-shadow"
                >
                  <Home className="w-4 h-4" /> {inAdmin ? "Go to dashboard" : "Go to home"}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] font-bold text-white shadow-lg shadow-[#0A80F5]/25 hover:shadow-[#0A80F5]/40 transition-shadow"
                >
                  <RotateCw className="w-4 h-4" /> Reload page
                </button>
              )}
              {canGoBack ? (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white ring-1 ring-slate-200 font-semibold text-slate-700 hover:ring-slate-300 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Go back
                </button>
              ) : (
                !notFound && (
                  <Link
                    to={inAdmin ? "/admin" : "/"}
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white ring-1 ring-slate-200 font-semibold text-slate-700 hover:ring-slate-300 transition"
                  >
                    <Home className="w-4 h-4" /> {inAdmin ? "Go to dashboard" : "Go to home"}
                  </Link>
                )
              )}
            </div>

            {notFound && (
              <div className="mt-10">
                <div className="text-sm font-bold text-[#0B1B34]">Maybe you were looking for</div>
                <div className="mt-3 grid grid-cols-2 gap-2 max-w-lg">
                  {links.map(([to, label]) => (
                    <Link
                      key={to}
                      to={to}
                      className="group flex items-center justify-between gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:ring-[#0A80F5]/40 hover:text-[#0A80F5] transition"
                    >
                      {label}
                      <ArrowRight className="w-4 h-4 text-slate-300 transition group-hover:text-[#0A80F5] group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className={`min-w-0 lg:order-2 flex justify-center lg:justify-end ${notFound ? "order-1" : "order-2"}`}>
            {notFound ? (
              <Register path={location.pathname} known={links.slice(0, 2)} />
            ) : (
              <ErrorReport
                path={location.pathname}
                message={message}
                time={time.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                copied={copied}
                onCopy={copyDetails}
                mailto={mailto}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="relative max-w-6xl w-full mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} Present-Me</span>
        <span className="flex items-center gap-4">
          <Link to="/privacy-policy" className="hover:text-[#0B1B34]">
            Privacy policy
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#0B1B34]">
            {SUPPORT_EMAIL}
          </a>
        </span>
      </footer>
    </div>
  );
};

export default ErrorPage;
