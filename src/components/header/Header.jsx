import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { ArrowRight, Bell, Building2, ChevronDown, LifeBuoy, Loader2, LogOut, Menu, RotateCw, UserRound, WifiOff } from "lucide-react";
import Sidebar from "../sidebar/Sidebar";
import QuickSearch from "./QuickSearch";
import Avatar from "../common/Avatar";
import logo from "../../assets/image.png";
import { pageFor } from "../sidebar/nav";
import { addUser, removeUser } from "../../utils/userSlice";
import { BaseUrl } from "../../utils/constants";
import { fullName } from "../../utils/people";
import useTeacherData from "../../customHooks/useTeacherData";
import useStudentData from "../../customHooks/useStudentData";
import { SUPPORT_EMAIL } from "../../Pages/Present-Me landingPage/landingContent";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
const COLLAPSE_KEY = "pm_sidebar_collapsed";
const EMPTY = [];

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

const timeAgo = (iso) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

/* Open/close state for a dropdown that closes on outside click or Escape */
const usePopover = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return [open, setOpen, ref];
};

const Dropdown = ({ className = "", children }) => (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.15 }}
    className={`z-50 rounded-2xl bg-white shadow-xl shadow-[#0B1B34]/10 ring-1 ring-slate-200 overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

/* ---------- pending approvals ---------- */

const PendingBell = () => {
  const pending = useSelector((s) => s.teacher.pendingTeachers) || EMPTY;
  const [open, setOpen, ref] = usePopover();
  const count = pending.length;
  const recent = [...pending].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4);

  return (
    <div ref={ref} className="sm:relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={count ? `${count} teacher${count > 1 ? "s" : ""} waiting for approval` : "No pending approvals"}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${open ? "bg-white shadow-sm text-[#0B1B34]" : "text-slate-600 hover:bg-white hover:shadow-sm"}`}
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 ring-2 ring-[#F7FAFF] text-[10px] font-extrabold text-[#0B1B34] flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <Dropdown className="fixed inset-x-3 top-[68px] sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[22rem]">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="text-sm font-bold text-[#0B1B34]">Waiting for approval</div>
              {count > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">{count}</span>}
            </div>
            {count === 0 ? (
              <div className="px-4 pb-6 pt-2 text-center">
                <div className="mx-auto w-11 h-11 rounded-full bg-[#EEF5FF] text-[#0A80F5] flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="mt-3 text-sm font-semibold text-[#0B1B34]">You're all caught up</div>
                <p className="mt-1 text-xs text-slate-500">Teachers who sign up under your institute will show up here.</p>
              </div>
            ) : (
              <>
                <ul className="px-2 pb-2">
                  {recent.map((t) => (
                    <li key={t.teacherId}>
                      <Link
                        to={`/admin/teachers?teacher=${encodeURIComponent(t.teacherId)}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-[#F7FAFF] transition"
                      >
                        <Avatar person={t} className="w-9 h-9 text-xs" />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-[#0B1B34] truncate">{fullName(t) || t.emailId}</span>
                          <span className="block text-xs text-slate-500 truncate">
                            {[t.department, t.createdAt && `signed up ${timeAgo(t.createdAt)}`].filter(Boolean).join(" · ") || t.emailId}
                          </span>
                        </span>
                        <span className="text-xs font-bold text-[#0A80F5] opacity-70 group-hover:opacity-100">Review</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/admin/teachers?tab=pending"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 border-t border-slate-100 px-4 py-3 text-sm font-semibold text-[#0A80F5] hover:bg-[#F7FAFF]"
                >
                  {count > recent.length ? `See all ${count} requests` : "Open pending teachers"} <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </Dropdown>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- account menu ---------- */

const AccountMenu = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen, ref] = usePopover();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const signOut = async () => {
    setSigningOut(true);
    setError("");
    try {
      await axios.post(BaseUrl + "/admin/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/signin", { replace: true });
    } catch {
      // the session cookie is still set, so staying here is more honest than pretending to sign out
      setError("Couldn't sign out. Check your connection and try again.");
      setSigningOut(false);
    }
  };

  const item = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 h-10 rounded-xl pl-1 pr-1 sm:pr-2 transition ${open ? "bg-white shadow-sm" : "hover:bg-white hover:shadow-sm"}`}
      >
        <Avatar person={user} className="w-8 h-8 text-[11px]" />
        <span className="hidden lg:block text-left max-w-[150px]">
          <span className="block text-sm font-bold leading-tight text-[#0B1B34] truncate">{fullName(user) || "Admin"}</span>
          <span className="block text-[11px] leading-tight text-slate-500 truncate">{user?.Role || "Admin"}</span>
        </span>
        <ChevronDown className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <Dropdown className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)]">
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <Avatar person={user} className="w-11 h-11 text-sm" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#0B1B34] truncate">{fullName(user) || "Admin"}</div>
                <div className="text-xs text-slate-500 truncate">{user?.emailId}</div>
              </div>
            </div>
            {user?.InstitutionName && (
              <div className="mx-4 mb-2 flex items-start gap-2 rounded-lg bg-[#F7FAFF] px-3 py-2 text-xs leading-5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 mt-0.5 text-[#0A80F5] shrink-0" />
                <span className="line-clamp-2">
                  {user.Role ? `${user.Role}, ` : ""}
                  {user.InstitutionName}
                </span>
              </div>
            )}
            <div className="px-2 pb-2" role="menu">
              <Link to="/admin/profile" role="menuitem" onClick={() => setOpen(false)} className={`${item} text-slate-700 hover:bg-[#F7FAFF]`}>
                <UserRound className="w-4 h-4 text-slate-400" /> Your profile
              </Link>
              <a href={`mailto:${SUPPORT_EMAIL}`} role="menuitem" className={`${item} text-slate-700 hover:bg-[#F7FAFF]`}>
                <LifeBuoy className="w-4 h-4 text-slate-400" /> Help & support
              </a>
              <div className="my-1.5 mx-3 h-px bg-slate-100" />
              <button type="button" role="menuitem" onClick={signOut} disabled={signingOut} className={`${item} text-red-600 hover:bg-red-50 disabled:opacity-60`}>
                {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
              {error && <p className="px-3 pb-1 pt-1 text-xs font-medium text-red-600">{error}</p>}
            </div>
          </Dropdown>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- layout ---------- */

const Header = () => {
  useTeacherData();
  useStudentData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const page = pageFor(location.pathname);

  // Load the signed-in admin on every visit so a refresh doesn't lose them
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get(BaseUrl + "/admin/profile", { withCredentials: true });
      dispatch(addUser(res.data));
      // Only verified institutes may use the panel
      if (res.data?.status === "pending") {
        navigate("/pending_verification", { replace: true });
        return;
      }
      if (res.data?.status === "rejected") {
        await axios.post(BaseUrl + "/admin/logout", {}, { withCredentials: true }).catch(() => {});
        dispatch(removeUser());
        navigate("/signin", { replace: true });
        return;
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/signin", { replace: true });
        return;
      }
      setFetchError(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    document.title = `${page.label} · Present-Me Admin`;
  }, [page.label]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {
        /* storage unavailable, the choice just won't persist */
      }
      return !c;
    });
  };

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  if (fetchError) {
    const offline = !fetchError.response;
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAFF] px-4" style={FONT}>
        <div className="w-full max-w-sm rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <WifiOff className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-[#0B1B34]">Couldn't load your dashboard</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {offline ? "We couldn't reach the server. Check your internet connection." : "The server had a problem. It's usually fixed in a moment."}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={fetchUserData}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] font-bold text-white shadow-md shadow-[#0A80F5]/25"
            >
              <RotateCw className="w-4 h-4" /> Try again
            </button>
            <Link to="/signin" className="inline-flex items-center justify-center h-11 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Sign in again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#F7FAFF]" style={FONT}>
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-[#0BCCEB]/30 animate-ping" />
          <img src={logo} alt="" className="relative w-14 h-14 rounded-full object-cover bg-white ring-4 ring-white shadow-lg" />
        </div>
        <p className="text-sm font-semibold text-slate-500">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-slate-800 antialiased" style={FONT}>
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} mobileOpen={mobileOpen} onClose={closeMobile} />

      <div className={`transition-[padding] duration-200 ease-out ${collapsed ? "md:pl-[76px]" : "md:pl-64"}`}>
        <header className="sticky top-0 z-30 h-16 bg-[#F7FAFF]/85 backdrop-blur-xl border-b border-slate-200/70">
          <div className="h-full px-3 sm:px-6 lg:px-8 flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/admin" className="md:hidden shrink-0" aria-label="Dashboard">
              <img src={logo} alt="" className="w-8 h-8 rounded-full object-cover bg-white ring-1 ring-slate-200" />
            </Link>

            {/* pages carry their own heading, so the bar leads with search instead of repeating it */}
            <div className="min-w-0 flex-1 flex justify-end sm:justify-start sm:pl-2 md:pl-0">
              <QuickSearch />
            </div>
            <PendingBell />
            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />
            <AccountMenu user={user} />
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Header;
