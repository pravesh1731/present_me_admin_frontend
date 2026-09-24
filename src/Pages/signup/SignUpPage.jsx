import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  FileText,
  Globe,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { BaseUrl } from "../../utils/constants";
import { BrandMark } from "../../components/common/Brand";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
const DRAFT_KEY = "pm_signup_draft";
const SUPPORT_EMAIL = "support@presentme.in";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const STEPS = [
  { title: "About you", sub: "Who is setting up Present-Me", icon: User, fields: ["firstName", "lastName", "Role", "emailId", "phone"] },
  { title: "Your institute", sub: "What teachers and students will see", icon: Building2, fields: ["InstitutionName", "address", "website", "expectedStudents", "expectedTeachers"] },
  { title: "ID verification", sub: "So we can confirm you're staff", icon: ShieldCheck, fields: ["aadhar", "designationID"] },
  { title: "Password & review", sub: "Secure your account and submit", icon: KeyRound, fields: ["password", "confirmPassword", "agree"] },
];

const ROLES = [
  { value: "Dean", icon: GraduationCap, hint: "Runs a faculty or college" },
  { value: "HOD", icon: Building2, hint: "Heads a department" },
  { value: "Class Incharge", icon: Users, hint: "Manages a class or batch" },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  Role: "",
  emailId: "",
  phone: "",
  InstitutionName: "",
  address: "",
  website: "",
  expectedStudents: "",
  expectedTeachers: "",
};

/* ---------- helpers ---------- */

// Text fields survive a refresh; files and passwords never leave memory
const readDraft = () => {
  try {
    return { ...EMPTY_FORM, ...(JSON.parse(sessionStorage.getItem(DRAFT_KEY)) || {}) };
  } catch {
    return EMPTY_FORM;
  }
};

const normalizeWebsite = (w) => {
  const v = w.trim();
  return !v || /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

const formatSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const passwordChecks = (pw) => [
  { label: "At least 8 characters", ok: pw.length >= 8, required: true },
  { label: "A letter and a number", ok: /[a-z]/i.test(pw) && /\d/.test(pw), required: true },
  { label: "Upper and lower case", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { label: "A symbol (like ! @ #)", ok: /[^A-Za-z0-9]/.test(pw) },
];

const STRENGTH = [
  { label: "Too weak", bar: "bg-red-500", text: "text-red-600" },
  { label: "Weak", bar: "bg-orange-500", text: "text-orange-600" },
  { label: "Okay", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Good", bar: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
];

const validateField = (name, form, files, extra) => {
  const v = typeof form[name] === "string" ? form[name].trim() : form[name];
  switch (name) {
    case "firstName":
    case "lastName":
      if (!v) return name === "firstName" ? "Enter your first name" : "Enter your last name";
      if (v.length < 2 || v.length > 30) return "Must be 2–30 characters";
      return null;
    case "Role":
      return v ? null : "Choose your role";
    case "emailId":
      if (!v) return "Enter your email address";
      return EMAIL_RE.test(v) ? null : "That doesn't look like a valid email";
    case "phone":
      return /^\d{10}$/.test(v) ? null : "Enter a 10-digit mobile number";
    case "InstitutionName":
      if (!v) return "Enter your institute's name";
      return v.length < 2 || v.length > 100 ? "Must be 2–100 characters" : null;
    case "address":
      if (!v) return "Enter your institute's address";
      return v.length < 10 ? "Add a little more detail (at least 10 characters)" : v.length > 200 ? "Keep it under 200 characters" : null;
    case "website": {
      if (!v) return "Enter your institute's website";
      const full = normalizeWebsite(v);
      if (full.length > 50) return "Website must be under 50 characters";
      try {
        const u = new URL(full);
        return u.hostname.includes(".") ? null : "Enter a valid website, like yourcollege.edu";
      } catch {
        return "Enter a valid website, like yourcollege.edu";
      }
    }
    case "expectedStudents":
    case "expectedTeachers":
      return v === "" ? "Enter an approximate number" : null;
    case "aadhar":
      return files.aadhar ? null : "Upload your Aadhaar card";
    case "designationID":
      return files.designationID ? null : "Upload your staff / designation ID";
    case "password": {
      const failed = passwordChecks(extra.password).filter((c) => c.required && !c.ok);
      return failed.length ? "Use at least 8 characters with a letter and a number" : null;
    }
    case "confirmPassword":
      if (!extra.confirmPassword) return "Re-enter your password";
      return extra.confirmPassword === extra.password ? null : "Passwords don't match";
    case "agree":
      return extra.agree ? null : "Please confirm to continue";
    default:
      return null;
  }
};

const FIELD_STEP = Object.fromEntries(STEPS.flatMap((s, i) => s.fields.map((f) => [f, i])));

/* ---------- field building blocks ---------- */

const inputBase =
  "block w-full h-12 rounded-xl border bg-white text-[15px] text-[#0B1B34] placeholder:text-slate-400 outline-none transition focus:ring-4";
const inputTone = (bad) =>
  bad ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 hover:border-slate-300 focus:border-[#0A80F5] focus:ring-[#0A80F5]/15";

const Field = ({ id, label, hint, error, className = "", children }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-semibold text-[#0B1B34] mb-1.5">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
    )}
  </div>
);

const IconInput = ({ icon: Icon, error, className = "", prefix, suffix, ...props }) => (
  <div className="relative">
    {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${error ? "text-red-400" : "text-slate-400"}`} />}
    {prefix && <span className="absolute left-11 top-1/2 -translate-y-1/2 text-[15px] font-medium text-slate-500">{prefix}</span>}
    <input
      aria-invalid={!!error}
      aria-describedby={error ? `${props.id}-error` : undefined}
      className={`${inputBase} ${Icon ? (prefix ? "pl-[4.6rem]" : "pl-11") : "pl-4"} ${suffix ? "pr-24" : "pr-4"} ${inputTone(error)} ${className}`}
      {...props}
    />
    {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>}
  </div>
);

const FileDrop = ({ id, label, hint, file, error, onPick, onClear }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const take = (f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) return onPick(null, "Upload a JPG, PNG or PDF file");
    if (f.size > MAX_FILE_MB * 1024 * 1024) return onPick(null, `File must be under ${MAX_FILE_MB} MB`);
    onPick(f, null);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-[#0B1B34]">{label}</span>
        <span className="text-xs text-slate-400">JPG, PNG or PDF · up to {MAX_FILE_MB} MB</span>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-white ring-1 ring-emerald-100 flex items-center justify-center shrink-0">
            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <FileText className="w-6 h-6 text-red-500" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-[#0B1B34] truncate">{file.name}</div>
            <div className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready · {formatSize(file.size)}
            </div>
          </div>
          <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-semibold text-[#0A80F5] hover:underline px-2">
            Replace
          </button>
          <button type="button" onClick={onClear} className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white flex items-center justify-center" aria-label={`Remove ${label}`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            take(e.dataTransfer.files?.[0]);
          }}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border-2 border-dashed px-4 py-6 flex flex-col items-center text-center transition ${
            dragging
              ? "border-[#0A80F5] bg-[#EEF5FF]"
              : error
              ? "border-red-300 bg-red-50/40 hover:border-red-400"
              : "border-slate-300 bg-white hover:border-[#0A80F5] hover:bg-[#F4F8FF]"
          }`}
        >
          <span className={`w-10 h-10 rounded-full flex items-center justify-center ${dragging ? "bg-[#0A80F5] text-white" : "bg-[#EEF5FF] text-[#0A80F5]"}`}>
            <Upload className="w-5 h-5" />
          </span>
          <span className="mt-2.5 text-sm font-semibold text-[#0B1B34]">
            {dragging ? "Drop it here" : (
              <>
                Drag a file here or <span className="text-[#0A80F5]">browse</span>
              </>
            )}
          </span>
          <span className="mt-0.5 text-xs text-slate-500">{hint}</span>
        </button>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const PasswordInput = ({ id, value, onChange, show, onToggle, error, placeholder, autoComplete }) => (
  <div className="relative">
    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${error ? "text-red-400" : "text-slate-400"}`} />
    <input
      id={id}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${inputBase} pl-11 pr-12 ${inputTone(error)}`}
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0B1B34] hover:bg-slate-100 transition"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
    </button>
  </div>
);

const ReviewCard = ({ title, onEdit, rows }) => (
  <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
    <div className="flex items-center justify-between">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{title}</div>
      <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A80F5] hover:underline">
        <Pencil className="w-3 h-3" /> Edit
      </button>
    </div>
    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-slate-500">{k}</dt>
          <dd className="text-[#0B1B34] font-medium truncate">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  </div>
);

/* ---------- left panel (desktop) ---------- */

const StepperPanel = ({ step, maxStep, onJump }) => (
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
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0BCCEB]">Register your institute</p>
      <h1 className="mt-4 text-4xl xl:text-[2.6rem] font-extrabold tracking-tight leading-[1.1]">Bring Present-Me to your institute.</h1>
      <p className="mt-4 text-slate-300 leading-relaxed">
        Sign up once as a Dean, HOD or Class Incharge. After we verify your ID, your teachers and students can join from the app.
      </p>
    </div>

    {/* progress */}
    <ol className="relative px-10 xl:px-14 mt-10 space-y-1">
      {STEPS.map((s, i) => {
        const done = i < step;
        const current = i === step;
        const reachable = i <= maxStep && i !== step;
        return (
          <li key={s.title} className="relative">
            {i < STEPS.length - 1 && <span className={`absolute left-[19px] top-11 w-0.5 h-5 rounded-full ${done ? "bg-[#0BCCEB]" : "bg-white/10"}`} />}
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onJump(i)}
              className={`w-full flex items-center gap-4 rounded-2xl p-1.5 pr-4 text-left transition ${current ? "bg-white/[0.07] ring-1 ring-white/10" : reachable ? "hover:bg-white/5" : ""}`}
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                  done
                    ? "bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white"
                    : current
                    ? "bg-white text-[#0A80F5] ring-4 ring-[#0BCCEB]/25"
                    : "bg-white/[0.06] text-slate-400 ring-1 ring-white/10"
                }`}
              >
                {done ? <Check className="w-4 h-4" strokeWidth={3} /> : <s.icon className="w-4 h-4" />}
              </span>
              <span>
                <span className={`block text-sm font-bold ${current || done ? "text-white" : "text-slate-400"}`}>{s.title}</span>
                <span className="block text-xs text-slate-400">{s.sub}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>

    <div className="relative mt-auto px-10 xl:px-14 pb-10">
      <div className="rounded-2xl bg-white/[0.05] ring-1 ring-white/10 p-5">
        <div className="text-sm font-bold">What happens after you submit</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {["We review your ID documents", "Your admin panel unlocks", "Teachers and students join from the app"].map((t, i) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-white/10 text-[11px] font-bold text-[#0BCCEB] flex items-center justify-center">{i + 1}</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </aside>
);

/* ---------- page ---------- */

const SignUpPage = () => {
  const [form, setForm] = useState(readDraft);
  const [files, setFiles] = useState({ aadhar: null, designationID: null });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const topRef = useRef(null);

  // Keep a draft of the text fields so a refresh doesn't wipe the form
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* storage unavailable */
    }
  }, [form]);

  const extra = { password, confirmPassword, agree };

  const setField = (name) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const clearError = (name) => errors[name] && setErrors((er) => ({ ...er, [name]: undefined }));

  const errorsFor = (stepIndex) => {
    const out = {};
    STEPS[stepIndex].fields.forEach((f) => {
      const msg = validateField(f, form, files, extra);
      if (msg) out[f] = msg;
    });
    return out;
  };

  const focusFirst = (errs) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    setTimeout(() => {
      const el = document.getElementById(first === "Role" ? "role-Dean" : first);
      el?.focus({ preventScroll: false });
    }, 60);
  };

  const goTo = (i) => {
    setStep(i);
    setSubmitError(null);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    const errs = errorsFor(step);
    if (Object.keys(errs).length) {
      setErrors((er) => ({ ...er, ...errs }));
      focusFirst(errs);
      return;
    }
    const n = step + 1;
    setMaxStep((m) => Math.max(m, n));
    goTo(n);
  };

  const submit = async () => {
    // Check every step; send the admin back to the first one with a problem
    for (let i = 0; i < STEPS.length; i++) {
      const errs = errorsFor(i);
      if (Object.keys(errs).length) {
        setErrors((er) => ({ ...er, ...errs }));
        if (i !== step) goTo(i);
        focusFirst(errs);
        return;
      }
    }

    setIsLoading(true);
    setSubmitError(null);
    try {
      const data = new FormData();
      data.append("firstName", form.firstName.trim());
      data.append("lastName", form.lastName.trim());
      data.append("emailId", form.emailId.trim().toLowerCase());
      data.append("phone", form.phone.trim());
      data.append("Role", form.Role);
      data.append("InstitutionName", form.InstitutionName.trim());
      data.append("address", form.address.trim());
      data.append("website", normalizeWebsite(form.website));
      data.append("expectedStudents", form.expectedStudents);
      data.append("expectedTeachers", form.expectedTeachers);
      data.append("password", password);
      data.append("aadhar", files.aadhar);
      data.append("designationID", files.designationID);

      await axios.post(BaseUrl + "/admin/signup", data, { withCredentials: true });

      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setDone(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "";
      if (status === 409) {
        setErrors((er) => ({ ...er, emailId: "An account with this email already exists" }));
        goTo(0);
        focusFirst({ emailId: true });
      } else if (status === 400) {
        // Server validation messages look like: "address" length must be at least 10 characters long
        const field = message.match(/"(\w+)"/)?.[1];
        if (field && FIELD_STEP[field] !== undefined) {
          setErrors((er) => ({ ...er, [field]: message.replace(/"/g, "") }));
          goTo(FIELD_STEP[field]);
          focusFirst({ [field]: true });
        } else {
          setSubmitError(message || "Some details weren't accepted. Please check the form.");
        }
      } else if (!err?.response) {
        setSubmitError("Can't reach Present-Me. Check your internet connection and try again.");
      } else {
        setSubmitError("Something went wrong while creating your account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) next();
    else submit();
  };

  const checks = passwordChecks(password);
  const score = password ? checks.filter((c) => c.ok).length : 0;
  const strength = STRENGTH[score];
  const current = STEPS[step];

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-slate-800 antialiased grid lg:grid-cols-[0.95fr_1.05fr]" style={FONT}>
      <StepperPanel step={done ? STEPS.length : step} maxStep={done ? -1 : maxStep} onJump={goTo} />

      <main className="relative flex flex-col min-h-screen px-5 sm:px-10">
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-[#0BCCEB]/10 blur-3xl" />

        {/* top bar */}
        <div ref={topRef} className="relative flex items-center justify-between pt-6 lg:pt-8 scroll-mt-4">
          <Link to="/" className="lg:invisible">
            <BrandMark tone="light" />
          </Link>
          <span className="text-sm text-slate-600">
            <span className="hidden sm:inline">Already registered? </span>
            <Link to="/signin" className="font-semibold text-[#0A80F5] hover:text-[#0B1B34]">
              Sign in
            </Link>
          </span>
        </div>

        <div className="relative w-full max-w-[520px] mx-auto my-auto py-10">
          {done ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white flex items-center justify-center shadow-xl shadow-[#0A80F5]/30"
              >
                <Check className="w-10 h-10" strokeWidth={3} />
              </motion.div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[#0B1B34]">Registration submitted</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Thanks, {form.firstName.trim() || "there"}. We'll review your documents and activate{" "}
                <span className="font-semibold text-[#0B1B34]">{form.InstitutionName.trim() || "your institute"}</span>. You can sign in any time to check the status.
              </p>
              <div className="mt-8 text-left rounded-2xl bg-white ring-1 ring-slate-200 p-5 space-y-3">
                {[
                  [ShieldCheck, "We verify your ID", "Your Aadhaar and designation ID are only used to confirm you're staff."],
                  [KeyRound, "Sign in to your admin panel", "Once approved, sign in with the email and password you just set."],
                  [Users, "Invite your teachers", "They install the app, pick your institute, and you approve them."],
                ].map(([Icon, t, d]) => (
                  <div key={t} className="flex gap-3">
                    <span className="w-9 h-9 rounded-lg bg-[#EEF5FF] text-[#0A80F5] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[#0B1B34]">{t}</span>
                      <span className="block text-sm text-slate-500">{d}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white font-bold shadow-lg shadow-[#0A80F5]/25"
                >
                  Go to sign in <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/" className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white ring-1 ring-slate-200 font-semibold text-slate-700 hover:ring-slate-300">
                  Back to home
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* mobile progress */}
              <div className="lg:hidden mb-6">
                <div className="flex gap-1.5">
                  {STEPS.map((s, i) => (
                    <span key={s.title} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5]" : "bg-slate-200"}`} />
                  ))}
                </div>
              </div>

              <div className="text-sm font-semibold text-[#0A80F5]">
                Step {step + 1} of {STEPS.length}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                  <h2 className="mt-2 text-3xl sm:text-[2rem] font-extrabold tracking-tight text-[#0B1B34] leading-tight">{current.title}</h2>
                  <p className="mt-2 text-slate-600">{current.sub}.</p>

                  <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
                    {step === 0 && (
                      <>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field id="firstName" label="First name" error={errors.firstName}>
                            <IconInput id="firstName" icon={User} value={form.firstName} onChange={setField("firstName")} autoComplete="given-name" placeholder="Meera" error={errors.firstName} />
                          </Field>
                          <Field id="lastName" label="Last name" error={errors.lastName}>
                            <IconInput id="lastName" value={form.lastName} onChange={setField("lastName")} autoComplete="family-name" placeholder="Iyer" error={errors.lastName} />
                          </Field>
                        </div>

                        <fieldset>
                          <legend className="block text-sm font-semibold text-[#0B1B34] mb-1.5">Your role</legend>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="radiogroup">
                            {ROLES.map(({ value, icon: Icon, hint }) => {
                              const on = form.Role === value;
                              return (
                                <button
                                  key={value}
                                  id={`role-${value.replace(/\s/g, "")}`}
                                  type="button"
                                  role="radio"
                                  aria-checked={on}
                                  onClick={() => setField("Role")(value)}
                                  className={`relative text-left rounded-xl px-3.5 py-3 sm:py-3.5 flex items-center gap-3 sm:block transition ${
                                    on ? "bg-[#EEF5FF] ring-2 ring-[#0A80F5]" : errors.Role ? "bg-white ring-1 ring-red-300" : "bg-white ring-1 ring-slate-200 hover:ring-slate-300"
                                  }`}
                                >
                                  <Icon className={`w-5 h-5 shrink-0 ${on ? "text-[#0A80F5]" : "text-slate-400"}`} />
                                  <span className="block">
                                    <span className="sm:mt-2 block text-sm font-bold text-[#0B1B34]">{value}</span>
                                    <span className="block text-xs text-slate-500">{hint}</span>
                                  </span>
                                  {on && (
                                    <span className="absolute top-1/2 -translate-y-1/2 sm:translate-y-0 sm:top-3 right-3 w-5 h-5 rounded-full bg-[#0A80F5] text-white flex items-center justify-center">
                                      <Check className="w-3 h-3" strokeWidth={3} />
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {errors.Role && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.Role}</p>}
                        </fieldset>

                        <Field id="emailId" label="Official email" hint="You'll use this to sign in. Your institute email works best." error={errors.emailId}>
                          <IconInput id="emailId" type="email" inputMode="email" icon={Mail} value={form.emailId} onChange={setField("emailId")} autoComplete="email" placeholder="hod@yourcollege.edu" error={errors.emailId} />
                        </Field>
                        {errors.emailId === "An account with this email already exists" && (
                          <p className="-mt-3 text-xs text-slate-600">
                            <Link to="/signin" className="font-semibold text-[#0A80F5] hover:underline">
                              Sign in instead
                            </Link>{" "}
                            or use a different email.
                          </p>
                        )}

                        <Field id="phone" label="Mobile number" error={errors.phone}>
                          <IconInput
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            icon={Phone}
                            prefix="+91"
                            value={form.phone}
                            onChange={(e) => setField("phone")(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            autoComplete="tel-national"
                            placeholder="98765 43210"
                            error={errors.phone}
                            className="tabular-nums"
                          />
                        </Field>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <Field id="InstitutionName" label="Institute name" hint="Teachers and students pick this name when they sign up, so use the official one." error={errors.InstitutionName}>
                          <IconInput id="InstitutionName" icon={Building2} value={form.InstitutionName} onChange={setField("InstitutionName")} autoComplete="organization" placeholder="Institute of Technology, Gorakhpur" error={errors.InstitutionName} />
                        </Field>
                        <Field id="address" label="Address" error={errors.address}>
                          <IconInput id="address" icon={MapPin} value={form.address} onChange={setField("address")} autoComplete="street-address" placeholder="Campus road, city, state, PIN" error={errors.address} />
                        </Field>
                        <Field id="website" label="Website" error={errors.website}>
                          <IconInput id="website" icon={Globe} value={form.website} onChange={setField("website")} autoComplete="url" placeholder="yourcollege.edu" error={errors.website} />
                        </Field>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field id="expectedStudents" label="Students (approx.)" error={errors.expectedStudents}>
                            <IconInput
                              id="expectedStudents"
                              inputMode="numeric"
                              icon={GraduationCap}
                              value={form.expectedStudents}
                              onChange={(e) => setField("expectedStudents")(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder="1200"
                              suffix="students"
                              error={errors.expectedStudents}
                              className="tabular-nums"
                            />
                          </Field>
                          <Field id="expectedTeachers" label="Teachers (approx.)" error={errors.expectedTeachers}>
                            <IconInput
                              id="expectedTeachers"
                              inputMode="numeric"
                              icon={Users}
                              value={form.expectedTeachers}
                              onChange={(e) => setField("expectedTeachers")(e.target.value.replace(/\D/g, "").slice(0, 5))}
                              placeholder="60"
                              suffix="teachers"
                              error={errors.expectedTeachers}
                              className="tabular-nums"
                            />
                          </Field>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="flex gap-3 rounded-xl bg-[#EEF5FF]/80 p-4 text-sm text-slate-700">
                          <ShieldCheck className="w-5 h-5 text-[#0A80F5] shrink-0" />
                          <p>
                            We check every institute by hand before it goes live, so students and teachers only ever join real institutions. Your documents are used only for this check.
                          </p>
                        </div>
                        <FileDrop
                          id="aadhar"
                          label="Aadhaar card"
                          hint="Front side, with your name clearly visible"
                          file={files.aadhar}
                          error={errors.aadhar}
                          onPick={(f, err) => {
                            if (f) setFiles((x) => ({ ...x, aadhar: f }));
                            setErrors((er) => ({ ...er, aadhar: err || undefined }));
                          }}
                          onClear={() => setFiles((x) => ({ ...x, aadhar: null }))}
                        />
                        <FileDrop
                          id="designationID"
                          label="Staff / designation ID"
                          hint="Your institute ID card or appointment letter"
                          file={files.designationID}
                          error={errors.designationID}
                          onPick={(f, err) => {
                            if (f) setFiles((x) => ({ ...x, designationID: f }));
                            setErrors((er) => ({ ...er, designationID: err || undefined }));
                          }}
                          onClear={() => setFiles((x) => ({ ...x, designationID: null }))}
                        />
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <Field id="password" label="Create a password" error={errors.password}>
                          <PasswordInput
                            id="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              clearError("password");
                            }}
                            show={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            error={errors.password}
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                          />
                        </Field>
                        {password && (
                          <div className="-mt-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((n) => (
                                <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= score ? strength.bar : "bg-slate-200"}`} />
                              ))}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className={`text-xs font-bold ${strength.text}`}>{strength.label}</span>
                              {checks.map((c) => (
                                <span key={c.label} className={`inline-flex items-center gap-1 text-xs ${c.ok ? "text-emerald-600" : "text-slate-500"}`}>
                                  {c.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                  {c.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
                          <PasswordInput
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              clearError("confirmPassword");
                            }}
                            show={showConfirm}
                            onToggle={() => setShowConfirm((v) => !v)}
                            error={errors.confirmPassword}
                            placeholder="Type it again"
                            autoComplete="new-password"
                          />
                        </Field>

                        <div className="pt-2 space-y-3">
                          <div className="text-sm font-semibold text-[#0B1B34]">Check your details</div>
                          <ReviewCard
                            title="About you"
                            onEdit={() => goTo(0)}
                            rows={[
                              ["Name", `${form.firstName} ${form.lastName}`.trim()],
                              ["Role", form.Role],
                              ["Email", form.emailId.trim().toLowerCase()],
                              ["Mobile", `+91 ${form.phone}`],
                            ]}
                          />
                          <ReviewCard
                            title="Institute"
                            onEdit={() => goTo(1)}
                            rows={[
                              ["Name", form.InstitutionName],
                              ["Website", normalizeWebsite(form.website)],
                              ["Size", `${form.expectedStudents || 0} students · ${form.expectedTeachers || 0} teachers`],
                            ]}
                          />
                          <ReviewCard
                            title="Documents"
                            onEdit={() => goTo(2)}
                            rows={[
                              ["Aadhaar", files.aadhar?.name || "Missing"],
                              ["Staff ID", files.designationID?.name || "Missing"],
                            ]}
                          />
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => {
                              setAgree(e.target.checked);
                              clearError("agree");
                            }}
                            id="agree"
                            className="peer sr-only"
                          />
                          <span
                            className={`mt-0.5 w-5 h-5 rounded-md border bg-white flex items-center justify-center shrink-0 transition peer-checked:bg-[#0A80F5] peer-checked:border-[#0A80F5] peer-focus-visible:ring-4 peer-focus-visible:ring-[#0A80F5]/15 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100 ${
                              errors.agree ? "border-red-400" : "border-slate-300"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </span>
                          <span className="text-sm text-slate-600 leading-relaxed">
                            I confirm these details are accurate and I agree to the{" "}
                            <Link to="/privacy-policy" target="_blank" className="font-semibold text-[#0A80F5] hover:underline">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>
                        {errors.agree && <p className="-mt-3 text-xs font-medium text-red-600">{errors.agree}</p>}
                      </>
                    )}

                    <AnimatePresence>
                      {submitError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div role="alert" className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <div>
                              <p className="text-red-800 font-medium">{submitError}</p>
                              <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-1 inline-block text-red-800 underline underline-offset-2">
                                Contact support
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-3 flex items-center gap-3">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => goTo(step - 1)}
                          className="inline-flex items-center justify-center gap-1.5 h-12 px-5 rounded-xl bg-white ring-1 ring-slate-200 font-semibold text-slate-700 hover:ring-slate-300 transition"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex-1 h-12 overflow-hidden rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white font-bold shadow-lg shadow-[#0A80F5]/25 hover:shadow-xl hover:shadow-[#0A80F5]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-shadow"
                      >
                        <span className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/25 blur-sm translate-x-[-150%] group-hover:translate-x-[500%] transition-transform duration-700" />
                        <span className="relative inline-flex items-center justify-center gap-2">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" /> Creating your account…
                            </>
                          ) : step < STEPS.length - 1 ? (
                            <>
                              Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          ) : (
                            <>
                              Create account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>

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

export default SignUpPage;
