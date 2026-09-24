import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Pencil,
  X,
  Check,
  Loader2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  BadgeCheck,
  Clock,
  ShieldCheck,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  CalendarDays,
  Users,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { addUser } from "../../utils/userSlice";
import { BaseUrl } from "../../utils/constants";

const MAX_PHOTO_MB = 5;
const BIO_MAX = 500;
const EMPTY = [];

const EDITABLE_FIELDS = ["firstName", "lastName", "InstitutionName", "address", "website", "bio"];

const formFromUser = (u) =>
  Object.fromEntries(EDITABLE_FIELDS.map((k) => [k, u?.[k] || ""]));

const initials = (u) =>
  `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.toUpperCase() || "?";

const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const validateProfile = (f) => {
  const errors = {};
  const first = f.firstName.trim();
  const last = f.lastName.trim();
  if (first.length < 2 || first.length > 30) errors.firstName = "Must be 2–30 characters";
  if (last.length < 2 || last.length > 30) errors.lastName = "Must be 2–30 characters";
  const inst = f.InstitutionName.trim();
  if (inst && (inst.length < 2 || inst.length > 100)) errors.InstitutionName = "Must be 2–100 characters";
  if (f.website.trim()) {
    try {
      const u = new URL(normalizeUrl(f.website.trim()));
      if (!u.hostname.includes(".")) throw new Error();
    } catch {
      errors.website = "Enter a valid website, e.g. example.edu";
    }
  }
  if (f.bio.length > BIO_MAX) errors.bio = `Bio can be at most ${BIO_MAX} characters`;
  return errors;
};

const passwordChecks = (pw) => [
  { label: "At least 8 characters", ok: pw.length >= 8 },
  { label: "An uppercase letter", ok: /[A-Z]/.test(pw) },
  { label: "A lowercase letter", ok: /[a-z]/.test(pw) },
  { label: "A number", ok: /\d/.test(pw) },
  { label: "A special character", ok: /[^A-Za-z0-9]/.test(pw) },
];

const STRENGTH = [
  { label: "Too weak", color: "bg-red-500", text: "text-red-600" },
  { label: "Weak", color: "bg-orange-500", text: "text-orange-600" },
  { label: "Fair", color: "bg-yellow-500", text: "text-yellow-600" },
  { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", color: "bg-green-500", text: "text-green-600" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const errorMessage = (err, fallback) =>
  err?.response?.data?.message || (err?.request && !err?.response ? "Network error — check your connection" : fallback);

/* ---------- Small building blocks ---------- */

const Card = ({ children, className = "", i = 0 }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={i}
    className={`bg-white rounded-xl shadow-md border border-gray-100 ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
    <div className="flex items-start gap-3">
      <div className="bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-2 rounded-xl text-white shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

const Field = ({ label, htmlFor, error, hint, children, className = "" }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700 mb-1.5 block">
      {label}
    </label>
    {children}
    {error ? (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" /> {error}
      </p>
    ) : (
      hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>
    )}
  </div>
);

const inputClass = (error) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors bg-white focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-[#0A80F5] focus:ring-blue-100"
  }`;

const InfoRow = ({ icon: Icon, label, value, href, locked }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        {label}
        {locked && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Locked</span>}
      </div>
      {value ? (
        href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#0A80F5] hover:underline break-all">
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

const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  const approved = ["approved", "verified", "active"].includes(s);
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
        approved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {approved ? <BadgeCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        role="status"
        className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm text-white max-w-sm ${
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

/* ---------- Password input with show/hide ---------- */

const PasswordInput = ({ id, value, onChange, error, autoComplete, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass(error)} pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

/* ---------- Security tab ---------- */

const SecurityTab = ({ notify }) => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const checks = passwordChecks(form.newPassword);
  const score = checks.filter((c) => c.ok).length;
  const strength = STRENGTH[Math.max(0, score - 1)];

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!form.oldPassword) er.oldPassword = "Enter your current password";
    if (score < checks.length) er.newPassword = "Password doesn't meet all requirements";
    if (form.newPassword && form.newPassword === form.oldPassword)
      er.newPassword = "New password must differ from the current one";
    if (form.confirmPassword !== form.newPassword) er.confirmPassword = "Passwords do not match";
    setErrors(er);
    if (Object.keys(er).length) return;

    setSaving(true);
    try {
      await axios.post(
        BaseUrl + "/admin/change-password",
        { oldPassword: form.oldPassword, newPassword: form.newPassword },
        { withCredentials: true }
      );
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      notify("success", "Password updated successfully");
    } catch (err) {
      if (err?.response?.status === 401) setErrors({ oldPassword: "Current password is incorrect" });
      notify("error", errorMessage(err, "Couldn't update password"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <SectionHeader icon={KeyRound} title="Change Password" subtitle="Use a strong password you don't use elsewhere" />
      <form onSubmit={submit} className="p-6 grid gap-6 md:grid-cols-2" noValidate>
        <div className="space-y-4">
          <Field label="Current password" htmlFor="oldPassword" error={errors.oldPassword}>
            <PasswordInput
              id="oldPassword"
              value={form.oldPassword}
              onChange={set("oldPassword")}
              error={errors.oldPassword}
              autoComplete="current-password"
            />
          </Field>
          <Field label="New password" htmlFor="newPassword" error={errors.newPassword}>
            <PasswordInput
              id="newPassword"
              value={form.newPassword}
              onChange={set("newPassword")}
              error={errors.newPassword}
              autoComplete="new-password"
            />
          </Field>
          {form.newPassword && (
            <div>
              <div className="flex gap-1">
                {STRENGTH.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${idx < score ? strength.color : "bg-gray-100"}`}
                  />
                ))}
              </div>
              <div className={`text-xs mt-1 font-medium ${strength.text}`}>{strength.label}</div>
            </div>
          )}
          <Field label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword}>
            <PasswordInput
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </Field>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] hover:opacity-95 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 h-fit">
          <div className="text-sm font-medium text-gray-800 mb-3">Password requirements</div>
          <ul className="space-y-2">
            {checks.map((c) => (
              <li key={c.label} className={`flex items-center gap-2 text-sm ${c.ok ? "text-green-700" : "text-gray-500"}`}>
                {c.ok ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                {c.label}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            Forgot your current password?{" "}
            <Link to="/forget_password" className="text-[#0A80F5] hover:underline">
              Reset it here
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
};

/* ---------- Page ---------- */

const ProfilePage = () => {
  const user = useSelector((store) => store.user);
  const pendingTeachers = useSelector((store) => store.teacher.pendingTeachers) || EMPTY;
  const verifiedTeachers = useSelector((store) => store.teacher.verifiedTeachers) || EMPTY;
  const students = useSelector((store) => store.student) || EMPTY;
  const dispatch = useDispatch();

  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => formFromUser(user));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  // Keep the form in sync when the user object refreshes (and we're not mid-edit)
  useEffect(() => {
    if (!editing) setForm(formFromUser(user));
  }, [user, editing]);

  // Release the preview blob when it changes / on unmount
  useEffect(() => () => photoPreview && URL.revokeObjectURL(photoPreview), [photoPreview]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (type, message) => {
    clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const changedFields = useMemo(() => {
    const original = formFromUser(user);
    return EDITABLE_FIELDS.filter((k) => form[k].trim() !== original[k].trim());
  }, [form, user]);

  const isDirty = changedFields.length > 0 || !!photoFile;

  // Warn before leaving the page with unsaved edits
  useEffect(() => {
    if (!editing || !isDirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [editing, isDirty]);

  const completeness = useMemo(() => {
    const items = [
      { label: "Profile photo", ok: !!user?.profilePicUrl },
      { label: "Institution name", ok: !!user?.InstitutionName },
      { label: "Address", ok: !!user?.address },
      { label: "Website", ok: !!user?.website },
      { label: "Bio", ok: !!user?.bio },
    ];
    const pct = Math.round(((items.filter((i) => i.ok).length + 2) / (items.length + 2)) * 100); // name + email always set
    return { items, pct };
  }, [user]);

  if (!user) return null;

  const setField = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const startEdit = () => {
    setForm(formFromUser(user));
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    if (isDirty && !window.confirm("Discard your unsaved changes?")) return;
    setForm(formFromUser(user));
    setErrors({});
    setPhotoFile(null);
    setPhotoPreview(null);
    setEditing(false);
  };

  const onPhotoSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("error", "Please choose an image file (JPG, PNG, GIF or WebP)");
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      notify("error", `Profile photo must be smaller than ${MAX_PHOTO_MB}MB`);
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    if (!editing) startEdit();
  };

  const save = async () => {
    const er = validateProfile(form);
    setErrors(er);
    if (Object.keys(er).length) {
      notify("error", "Please fix the highlighted fields");
      return;
    }
    if (!isDirty) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      changedFields.forEach((k) => {
        const v = form[k].trim();
        formData.append(k, k === "website" && v ? normalizeUrl(v) : v);
      });
      // field name must match multer.single("profilePicUrl")
      if (photoFile) formData.append("profilePicUrl", photoFile);

      const res = await axios.patch(BaseUrl + "/admin/profile", formData, { withCredentials: true });
      const updated = res.data?.data;
      if (updated) dispatch(addUser({ ...user, ...updated }));

      setPhotoFile(null);
      setPhotoPreview(null);
      setEditing(false);
      notify("success", "Profile updated successfully");
    } catch (err) {
      notify("error", errorMessage(err, "Couldn't save your profile"));
    } finally {
      setSaving(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.institutionId);
      notify("success", "Institution ID copied");
    } catch {
      notify("error", "Couldn't copy to clipboard");
    }
  };

  const avatarSrc = photoPreview || user.profilePicUrl;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="h-28 sm:h-32 bg-gradient-to-r from-[#0BCCEB] via-[#0A80F5] to-[#6b46c1]" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              {avatarSrc ? (
                <img src={avatarSrc} alt={fullName} className="w-full h-full rounded-full object-cover ring-4 ring-white bg-white" />
              ) : (
                <div className="w-full h-full rounded-full ring-4 ring-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white flex items-center justify-center text-3xl font-bold">
                  {initials(user)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#0A80F5] transition-colors"
                aria-label="Change profile photo"
                title="Change photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoSelected} />
            </div>

            <div className="flex-1 min-w-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900 truncate">{fullName || "Your profile"}</h2>
                <StatusBadge status={user.status} />
              </div>
              <div className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                {user.Role && (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-4 h-4" /> {user.Role}
                  </span>
                )}
                {user.InstitutionName && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> {user.InstitutionName}
                  </span>
                )}
                {user.emailId && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> {user.emailId}
                  </span>
                )}
              </div>
            </div>

            {tab === "profile" && (
              <div className="flex gap-2 sm:pb-1">
                {editing ? (
                  <>
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      onClick={save}
                      disabled={saving || !isDirty}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startEdit}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {photoFile && (
            <div className="mt-4 text-xs text-[#0A80F5] bg-blue-50 rounded-lg px-3 py-2 inline-flex items-center gap-2">
              New photo selected — click <b>Save Changes</b> to upload it.
              <button
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                className="underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div role="tablist" className="inline-flex p-1 bg-white rounded-xl shadow-sm border border-gray-100">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              if (tab === "profile" && editing && isDirty && !window.confirm("Discard your unsaved changes?")) return;
              if (editing) {
                setEditing(false);
                setPhotoFile(null);
                setPhotoPreview(null);
              }
              setTab(id);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? "bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white shadow" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "security" ? (
        <SecurityTab notify={notify} />
      ) : (
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Main column */}
          <div className="col-span-12 lg:col-span-8">
            <Card i={1}>
              <SectionHeader
                icon={User}
                title="Personal Information"
                subtitle={editing ? "Update your details, then save your changes" : "Your personal and institution details"}
              />

              {editing ? (
                <form
                  className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    save();
                  }}
                  noValidate
                >
                  <Field label="First name" htmlFor="firstName" error={errors.firstName}>
                    <input id="firstName" value={form.firstName} onChange={setField("firstName")} className={inputClass(errors.firstName)} />
                  </Field>
                  <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
                    <input id="lastName" value={form.lastName} onChange={setField("lastName")} className={inputClass(errors.lastName)} />
                  </Field>
                  <Field label="Institution name" htmlFor="InstitutionName" error={errors.InstitutionName} className="sm:col-span-2">
                    <input
                      id="InstitutionName"
                      value={form.InstitutionName}
                      onChange={setField("InstitutionName")}
                      className={inputClass(errors.InstitutionName)}
                    />
                  </Field>
                  <Field label="Address" htmlFor="address" error={errors.address}>
                    <input id="address" value={form.address} onChange={setField("address")} className={inputClass(errors.address)} />
                  </Field>
                  <Field label="Website" htmlFor="website" error={errors.website}>
                    <input
                      id="website"
                      value={form.website}
                      onChange={setField("website")}
                      placeholder="example.edu"
                      className={inputClass(errors.website)}
                    />
                  </Field>
                  <Field label="Email" hint="Contact support to change your email">
                    <input value={user.emailId || ""} disabled className={`${inputClass()} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                  </Field>
                  <Field label="Phone" hint="Phone number can't be changed here">
                    <input value={user.phone || ""} disabled className={`${inputClass()} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                  </Field>
                  <Field label="Bio" htmlFor="bio" error={errors.bio} className="sm:col-span-2">
                    <textarea
                      id="bio"
                      rows={4}
                      value={form.bio}
                      onChange={setField("bio")}
                      placeholder="Tell teachers and students a little about your institution…"
                      className={`${inputClass(errors.bio)} resize-y`}
                    />
                    <div className={`text-xs text-right mt-1 ${form.bio.length > BIO_MAX ? "text-red-600" : "text-gray-400"}`}>
                      {form.bio.length}/{BIO_MAX}
                    </div>
                  </Field>
                  {/* lets Enter submit the form */}
                  <button type="submit" className="hidden" />
                </form>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-gray-100">
                    <InfoRow icon={User} label="Full name" value={fullName} />
                    <InfoRow icon={Building2} label="Institution" value={user.InstitutionName} />
                    <InfoRow icon={Mail} label="Email" value={user.emailId} href={user.emailId && `mailto:${user.emailId}`} locked />
                    <InfoRow icon={Phone} label="Phone" value={user.phone} locked />
                    <InfoRow icon={MapPin} label="Address" value={user.address} />
                    <InfoRow icon={Globe} label="Website" value={user.website} href={user.website && normalizeUrl(user.website)} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Bio</div>
                    {user.bio ? (
                      <p className="text-sm text-gray-800 whitespace-pre-line">{user.bio}</p>
                    ) : (
                      <button onClick={startEdit} className="text-sm text-[#0A80F5] hover:underline">
                        + Add a short bio
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Side column */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card i={2} className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Account Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-900">{user.Role || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 inline-flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" /> Joined
                  </span>
                  <span className="font-medium text-gray-900">{formatDate(user.createdAt)}</span>
                </div>
                {user.institutionId && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-gray-500 mb-1">Institution ID</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-50 border border-gray-100 rounded px-2 py-1.5 truncate">{user.institutionId}</code>
                      <button onClick={copyId} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100" aria-label="Copy institution ID">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <Link to="/admin/teachers" className="rounded-lg bg-blue-50 p-3 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs text-[#0A80F5]">
                    <Users className="w-4 h-4" /> Teachers
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mt-1">{verifiedTeachers.length}</div>
                  <div className="text-[11px] text-gray-500">
                    {pendingTeachers.length} pending
                    {user.expectedTeachers ? ` · ${user.expectedTeachers} expected` : ""}
                  </div>
                </Link>
                <Link to="/admin/students" className="rounded-lg bg-purple-50 p-3 hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs text-[#6b46c1]">
                    <GraduationCap className="w-4 h-4" /> Students
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mt-1">{students.length}</div>
                  <div className="text-[11px] text-gray-500">
                    {user.expectedStudents ? `${user.expectedStudents} expected` : "enrolled"}
                  </div>
                </Link>
              </div>
            </Card>

            {completeness.pct < 100 && (
              <Card i={3} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Profile completeness</h4>
                  <span className="text-sm font-semibold text-[#0A80F5]">{completeness.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5]"
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness.pct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <ul className="mt-4 space-y-2">
                  {completeness.items.map((it) => (
                    <li key={it.label} className={`flex items-center gap-2 text-sm ${it.ok ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {it.ok ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                      {it.label}
                    </li>
                  ))}
                </ul>
                {!editing && (
                  <button onClick={startEdit} className="mt-4 w-full text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                    Complete profile
                  </button>
                )}
              </Card>
            )}
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ProfilePage;
