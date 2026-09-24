import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Loader2,
  Lock,
  Mail,
  Smartphone,
  UserCheck,
  Users,
  Check,
} from "lucide-react";
import { addUser } from "../../utils/userSlice";
import { BaseUrl } from "../../utils/constants";
import { BrandMark, PlayIcon } from "../../components/common/Brand";
import { PLAY_STORE_URL } from "../../utils/brand";
import { BrowserScreen } from "../Present-Me landingPage/mockups";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
const REMEMBER_KEY = "pm_admin_email";
const SUPPORT_EMAIL = "support@presentme.in";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readRememberedEmail = () => {
  try {
    return localStorage.getItem(REMEMBER_KEY) || "";
  } catch {
    return "";
  }
};

const saveRememberedEmail = (email, remember) => {
  try {
    if (remember) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* storage unavailable — nothing to remember */
  }
};

// Turn a failed login into something the admin can act on
const describeError = (err) => {
  if (!err?.response) return { title: "Can't reach Present-Me", text: "Check your internet connection and try again." };
  const { status, data } = err.response;
  if (status === 404) return { title: "No account with this email", text: "Check the spelling, or register your institute if you haven't yet.", action: "register" };
  if (status === 401) return { title: "Incorrect password", text: "Try again, or reset it if you've forgotten it.", action: "reset" };
  if (status === 400) return { title: "Missing details", text: data?.message || "Enter your email and password." };
  return { title: "Something went wrong", text: "Please try again in a moment." };
};

const HIGHLIGHTS = [
  [UserCheck, "Approve the teachers who sign up under your institute"],
  [Users, "Look up any student's classes and attendance"],
  [FileSpreadsheet, "Download attendance for any class as PDF, Excel or CSV"],
];

/* ---------- left panel (desktop) ---------- */

const ShowcasePanel = () => (
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
        Admin panel for HODs & Deans
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-4 text-4xl xl:text-[2.75rem] font-extrabold tracking-tight leading-[1.1]"
      >
        Your whole institute's attendance, in one place.
      </motion.h1>
      <ul className="mt-8 space-y-3.5">
        {HIGHLIGHTS.map(([Icon, text], i) => (
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

    {/* dashboard preview bleeding off the bottom-right corner */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-auto h-[240px] xl:h-[300px] pl-10 xl:pl-14 translate-x-10"
    >
      <div className="w-[640px] max-w-none rotate-[-2deg] origin-top-left">
        <BrowserScreen id="a-dashboard" />
      </div>
    </motion.div>
  </aside>
);

/* ---------- page ---------- */

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const location = useLocation();

  // The pending-verification page passes the applicant's email so they only need their password
  const [emailId, setEmailId] = useState(() => location.state?.email || readRememberedEmail());
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => !!readRememberedEmail());
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Put the cursor where the admin needs it (desktop only — on phones it would pop the keyboard open)
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    (emailId ? passwordRef : emailRef).current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Already signed in? Skip the form.
  useEffect(() => {
    let alive = true;
    axios
      .get(BaseUrl + "/admin/profile", { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        if (res.data?.status === "verified") navigate("/admin", { replace: true });
        else if (res.data?.status === "pending") navigate("/pending_verification", { replace: true });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [navigate]);

  const validate = (email) => {
    const errs = {};
    if (!email) errs.email = "Enter your email address";
    else if (!EMAIL_RE.test(email)) errs.email = "That doesn't look like a valid email";
    if (!password) errs.password = "Enter your password";
    setFieldErrors(errs);
    if (errs.email) emailRef.current?.focus();
    else if (errs.password) passwordRef.current?.focus();
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Accounts are stored with lowercase emails
    const email = emailId.trim().toLowerCase();
    setError(null);
    if (!validate(email)) return;

    setIsLoading(true);
    try {
      const response = await axios.post(BaseUrl + "/admin/login", { emailId: email, password }, { withCredentials: true });
      const institution = response.data?.institution;
      saveRememberedEmail(email, remember);

      if (institution?.status === "verified") {
        dispatch(addUser(institution));
        navigate("/admin", { replace: true });
      } else if (institution?.status === "pending") {
        dispatch(addUser(institution));
        navigate("/pending_verification", { replace: true });
      } else if (institution?.status === "rejected") {
        // Login set a session cookie; clear it since this account can't use the panel
        axios.post(BaseUrl + "/admin/logout", {}, { withCredentials: true }).catch(() => {});
        setError({
          title: "Registration not approved",
          text: "Your institute's registration didn't pass verification. Contact us if you think this is a mistake.",
          action: "support",
        });
      } else {
        setError({ title: "Something went wrong", text: "Please try again in a moment." });
      }
    } catch (err) {
      const info = describeError(err);
      setError(info);
      if (err?.response?.status === 401) {
        passwordRef.current?.focus();
        passwordRef.current?.select();
      } else if (err?.response?.status === 404) {
        emailRef.current?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkCaps = (e) => setCapsLock(!!e.getModifierState?.("CapsLock"));

  const inputBase =
    "block w-full h-12 rounded-xl border bg-white pl-11 text-[15px] text-[#0B1B34] placeholder:text-slate-400 outline-none transition focus:ring-4";
  const inputTone = (bad) =>
    bad ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 hover:border-slate-300 focus:border-[#0A80F5] focus:ring-[#0A80F5]/15";

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-slate-800 antialiased grid lg:grid-cols-[1.05fr_1fr]" style={FONT}>
      <ShowcasePanel />

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
          className="relative w-full max-w-[420px] mx-auto my-auto py-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-[#0A80F5]/15 px-3 py-1 text-xs font-bold text-[#0A80F5] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A80F5]" /> Admin sign in
          </span>
          <h2 className="mt-4 text-3xl sm:text-[2rem] font-extrabold tracking-tight text-[#0B1B34] leading-tight">Sign in to your institute</h2>
          <p className="mt-2 text-slate-600">Use the email you registered your institute with.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <AnimatePresence initial={false}>
              {error && (
                <motion.div
                  key={error.title}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div role="alert" className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-bold text-red-800">{error.title}</div>
                      <p className="mt-0.5 text-red-700">{error.text}</p>
                      {error.action === "register" && (
                        <Link to="/signup" className="mt-2 inline-flex items-center gap-1 font-semibold text-red-800 underline underline-offset-2">
                          Register your institute <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {error.action === "reset" && (
                        <Link to="/forget_password" className="mt-2 inline-flex items-center gap-1 font-semibold text-red-800 underline underline-offset-2">
                          Reset your password <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {error.action === "support" && (
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-2 inline-flex items-center gap-1 font-semibold text-red-800 underline underline-offset-2">
                          Email {SUPPORT_EMAIL}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0B1B34] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${fieldErrors.email ? "text-red-400" : "text-slate-400"}`} />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={emailId}
                  onChange={(e) => {
                    setEmailId(e.target.value);
                    if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
                  }}
                  placeholder="hod@yourcollege.edu"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`${inputBase} pr-4 ${inputTone(fieldErrors.email)}`}
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0B1B34]">
                  Password
                </label>
                <Link to="/forget_password" className="text-sm font-semibold text-[#0A80F5] hover:text-[#0B1B34] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${fieldErrors.password ? "text-red-400" : "text-slate-400"}`} />
                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
                  }}
                  onKeyDown={checkCaps}
                  onKeyUp={checkCaps}
                  onBlur={() => setCapsLock(false)}
                  placeholder="Your password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className={`${inputBase} pr-12 ${inputTone(fieldErrors.password)}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0B1B34] hover:bg-slate-100 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="mt-1.5 text-xs font-medium text-red-600">
                  {fieldErrors.password}
                </p>
              ) : (
                capsLock && <p className="mt-1.5 text-xs font-medium text-amber-600">Caps Lock is on</p>
              )}
            </div>

            {/* remember email */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="peer sr-only" />
              <span className="w-5 h-5 rounded-md border border-slate-300 bg-white flex items-center justify-center transition peer-checked:bg-[#0A80F5] peer-checked:border-[#0A80F5] peer-focus-visible:ring-4 peer-focus-visible:ring-[#0A80F5]/15 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </span>
              <span className="text-sm text-slate-600">Remember my email on this device</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-12 overflow-hidden rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white font-bold shadow-lg shadow-[#0A80F5]/25 hover:shadow-xl hover:shadow-[#0A80F5]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-shadow"
            >
              <span className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/25 blur-sm translate-x-[-150%] group-hover:translate-x-[500%] transition-transform duration-700" />
              <span className="relative inline-flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> New here? <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            to="/signup"
            className="group flex items-center justify-between rounded-xl bg-white ring-1 ring-slate-200 px-4 py-3.5 hover:ring-[#0A80F5]/40 hover:shadow-md transition"
          >
            <span>
              <span className="block text-sm font-bold text-[#0B1B34]">Register your institute</span>
              <span className="block text-xs text-slate-500 mt-0.5">For HODs and Deans · verified before activation</span>
            </span>
            <span className="w-9 h-9 rounded-lg bg-[#EEF5FF] text-[#0A80F5] flex items-center justify-center group-hover:bg-[#0A80F5] group-hover:text-white transition">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <div className="mt-3 flex items-start gap-3 rounded-xl bg-[#EEF5FF]/70 px-4 py-3.5">
            <Smartphone className="w-4 h-4 text-[#0A80F5] mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Teachers and students sign in from the Present-Me app, not here.{" "}
              <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#0A80F5] hover:underline">
                <PlayIcon className="w-3 h-3" /> Get it on Google Play
              </a>
            </p>
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

export default SignInPage;
