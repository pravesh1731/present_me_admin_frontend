import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
  Check,
  FileText,
  KeyRound,
  Loader2,
  Mail,
  Trash2,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { BaseUrl } from "../../utils/constants";
import { BrandMark } from "../../components/common/Brand";
import { SUPPORT_EMAIL } from "../Present-Me landingPage/landingContent";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches the deadline the backend stores with each request
const DELETE_WITHIN_DAYS = 30;

const DELETED = [
  [User, "Profile information"],
  [CalendarCheck, "Attendance records"],
  [FileText, "Uploaded notes & PYQs"],
  [Users, "Class history & enrollments"],
  [KeyRound, "All account credentials"],
];

// Values are what the backend stores, so keep them stable
const REASONS = [
  ["no_longer_using", "No longer using the app"],
  ["privacy_concerns", "Privacy concerns"],
  ["switching_institution", "Switching institution"],
  ["found_better", "Found a better alternative"],
  ["technical_issues", "Technical issues"],
  ["other", "Other"],
];

const deadline = () =>
  new Date(Date.now() + DELETE_WITHIN_DAYS * 864e5).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const supportMail = (email) =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Account deletion request")}&body=${encodeURIComponent(
    `Please delete my Present-Me account.\n\nEmail on the account: ${email || ""}`
  )}`;

/* ---------- pieces ---------- */

const Step = ({ n, title, children, last }) => (
  <li className="relative flex gap-4 pb-6 last:pb-0">
    {!last && <span className="absolute left-[15px] top-9 bottom-1 w-px bg-slate-200" />}
    <span className="w-8 h-8 rounded-full bg-white ring-1 ring-slate-200 text-sm font-bold text-[#0A80F5] flex items-center justify-center shrink-0">{n}</span>
    <div className="pt-1">
      <div className="text-sm font-bold text-[#0B1B34]">{title}</div>
      <p className="mt-0.5 text-sm leading-6 text-slate-500">{children}</p>
    </div>
  </li>
);

const Shell = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#F7FAFF] text-slate-800 antialiased" style={FONT}>
    <header className="max-w-5xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <Link to="/">
        <BrandMark tone="light" />
      </Link>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#0B1B34]">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
    </header>
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 lg:py-12">{children}</main>
    <footer className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
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

/* ---------- page ---------- */

const DeleteAccount = () => {
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(null);

  const emailError = (value) => {
    const v = value.trim();
    if (!v) return "Enter the email on your account";
    if (!EMAIL_RE.test(v)) return "That doesn't look like a valid email";
    return "";
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    if (touched) setErrors((err) => ({ ...err, email: emailError(e.target.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const next = { email: emailError(email), agree: agreed ? "" : "Please confirm you understand this can't be undone" };
    setErrors(next);
    setTouched(true);
    if (next.email) {
      emailRef.current?.focus();
      return;
    }
    if (next.agree) return;

    const cleanEmail = email.trim().toLowerCase();
    const note = otherText.trim();
    setLoading(true);
    try {
      await axios.post(BaseUrl + "/delete-request", {
        email: cleanEmail,
        reason: reason === "other" && note ? `other: ${note}` : reason,
      });
      setDone({ email: cleanEmail, by: deadline() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (!err.response) setServerError("We couldn't reach our server. Check your internet connection and try again.");
      else if (err.response.status === 400) setServerError(err.response.data?.message || "Please check your details and try again.");
      else setServerError("Something went wrong on our side. Please try again in a minute.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDone(null);
    setEmail("");
    setReason("");
    setOtherText("");
    setAgreed(false);
    setErrors({});
    setTouched(false);
  };

  if (done) {
    return (
      <Shell>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center py-6 sm:py-10">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25"
          >
            <Check className="w-8 h-8" strokeWidth={3} />
          </motion.div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#0B1B34]">Request received</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            We'll permanently delete the account for <span className="font-semibold text-[#0B1B34] break-all">{done.email}</span> and its data by{" "}
            <span className="font-semibold text-[#0B1B34]">{done.by}</span>.
          </p>

          <ol className="mt-8 text-left rounded-2xl bg-white ring-1 ring-slate-200 p-5">
            <Step n={1} title="Your request is in our queue">
              We've saved it along with the reason you gave, if any.
            </Step>
            <Step n={2} title={`Deleted by ${done.by}`}>
              Your profile, attendance, uploads, class history and login details are removed.
            </Step>
            <Step n={3} title="This email stops working on Present-Me" last>
              To use the app again after that, you'd need to sign up as a new user.
            </Step>
          </ol>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] font-bold text-white shadow-lg shadow-[#0A80F5]/25"
            >
              Back to home
            </Link>
            <button type="button" onClick={reset} className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white ring-1 ring-slate-200 font-semibold text-slate-700 hover:ring-slate-300 transition">
              Send another request
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Typed the wrong email? Tell us at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Cancel deletion request")}&body=${encodeURIComponent(`Please cancel the deletion request for ${done.email}.`)}`}
              className="font-semibold text-[#0A80F5] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            so we don't act on it.
          </p>
        </motion.div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-x-14 gap-y-8 items-start">
        {/* what this means */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-start-1 lg:row-start-1 min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
            <Trash2 className="w-3.5 h-3.5 text-red-500" /> Account deletion
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1B34] leading-tight">Delete your Present-Me account</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Use this page to permanently delete your student or teacher account. In the app, you'll find it under{" "}
            <span className="font-semibold text-[#0B1B34]">Settings → Delete account</span>.
          </p>

          <div className="mt-8">
            <h2 className="text-sm font-bold text-[#0B1B34]">What gets deleted</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2">
              {DELETED.map(([Icon, text]) => (
                <li key={text} className="flex items-center gap-3 rounded-xl bg-white ring-1 ring-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700">
                  <Icon className="w-4 h-4 text-red-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-slate-500">
              It's permanent. Once deleted, this data can't be recovered.
            </p>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl bg-amber-50 ring-1 ring-amber-200 p-4">
            <Wallet className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm leading-6 text-amber-900">
              <span className="font-semibold">Have rewards in your wallet?</span> Withdraw them to UPI first (the minimum is ₹10). Balances can't be paid out once the
              account is gone.
            </p>
          </div>
        </motion.section>

        {/* the form */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-8 min-w-0"
        >
          <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_20px_50px_-30px_rgba(11,27,52,0.3)] p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-[#0B1B34]">Request deletion</h2>
            <p className="mt-1 text-sm text-slate-500">It takes under a minute.</p>

            <div className="mt-6">
              <label htmlFor="del-email" className="block text-sm font-semibold text-[#0B1B34]">
                Email on your account
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={emailRef}
                  id="del-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={onEmailChange}
                  placeholder="you@college.edu"
                  aria-invalid={!!errors.email}
                  aria-describedby="del-email-hint"
                  className={`w-full h-12 rounded-xl bg-white pl-10 pr-4 text-[15px] outline-none ring-1 transition ${
                    errors.email ? "ring-red-400 focus:ring-2 focus:ring-red-400" : "ring-slate-200 hover:ring-slate-300 focus:ring-2 focus:ring-[#0A80F5]"
                  }`}
                />
              </div>
              <p id="del-email-hint" className={`mt-1.5 text-xs ${errors.email ? "text-red-600 font-medium" : "text-slate-500"}`}>
                {errors.email || "The one you use to sign in to the app."}
              </p>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-[#0B1B34]">
                Why are you leaving? <span className="font-normal text-slate-400">Optional</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {REASONS.map(([value, label]) => {
                  const on = reason === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setReason(on ? "" : value)}
                      className={`rounded-full px-3.5 py-2 text-sm transition ring-1 ${
                        on ? "bg-[#EEF5FF] ring-[#0A80F5] font-semibold text-[#0A80F5]" : "bg-white ring-slate-200 text-slate-600 hover:ring-slate-300"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {reason === "other" && (
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  maxLength={200}
                  placeholder="Tell us a little more (optional)"
                  className="mt-3 w-full h-11 rounded-xl bg-white px-4 text-sm outline-none ring-1 ring-slate-200 hover:ring-slate-300 focus:ring-2 focus:ring-[#0A80F5] transition"
                />
              )}
            </fieldset>

            <label className={`mt-6 flex gap-3 rounded-xl p-3.5 cursor-pointer ring-1 transition ${errors.agree && !agreed ? "bg-red-50 ring-red-200" : "bg-[#F7FAFF] ring-slate-200"}`}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-red-600"
              />
              <span className="text-sm leading-6 text-slate-700">
                I understand my account and all its data will be permanently deleted within {DELETE_WITHIN_DAYS} days and can't be recovered.
              </span>
            </label>
            {errors.agree && !agreed && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.agree}</p>}

            {serverError && (
              <div role="alert" className="mt-5 flex gap-3 rounded-xl bg-red-50 ring-1 ring-red-200 p-3.5 text-sm text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {serverError}{" "}
                  <a href={supportMail(email.trim())} className="font-semibold underline underline-offset-2">
                    Or email us instead.
                  </a>
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending request…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Request account deletion
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Rather talk to someone?{" "}
              <a href={supportMail(email.trim())} className="font-semibold text-[#0A80F5] hover:underline">
                Email {SUPPORT_EMAIL}
              </a>
            </p>
          </form>
        </motion.section>

        {/* what happens next */}
        <section className="lg:col-start-1 lg:row-start-2 min-w-0">
          <h2 className="text-sm font-bold text-[#0B1B34]">What happens after you send it</h2>
          <ol className="mt-4">
            <Step n={1} title="We log your request">
              It's saved straight away with the email you entered.
            </Step>
            <Step n={2} title={`Deleted within ${DELETE_WITHIN_DAYS} days`}>
              If you send it today, your account and data are gone by {deadline()}.
            </Step>
            <Step n={3} title="Starting again" last>
              You'd need to sign up as a new user to use Present-Me after that.
            </Step>
          </ol>
          <p className="mt-6 text-sm text-slate-500">
            Want to know how we handle your data? Read our{" "}
            <Link to="/privacy-policy" className="font-semibold text-[#0A80F5] hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
};

export default DeleteAccount;
