import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import logo from "../../assets/image.png";
import { BrandMark } from "../common/Brand";
import { NAV_ACCOUNT, NAV_MAIN } from "./nav";

/* Label shown beside an icon when the sidebar is collapsed */
const Tip = ({ children }) => (
  <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#0B1B34] px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg ring-1 ring-white/10 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100">
    {children}
  </span>
);

const NavItem = ({ item, collapsed, counts, onNavigate }) => {
  const Icon = item.icon;
  const badge = item.badge ? counts[item.badge] : 0;
  const count = item.count ? counts[item.count] : null;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 h-11 rounded-xl text-sm font-semibold transition ${collapsed ? "justify-center" : "px-3"} ${
          isActive ? "bg-white/[0.09] text-white" : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-gradient-to-b from-[#0BCCEB] to-[#0A80F5]" />}
          <Icon className={`w-[18px] h-[18px] shrink-0 transition ${isActive ? "text-[#0BCCEB]" : "text-slate-400 group-hover:text-slate-200"}`} />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

          {!collapsed && badge > 0 && (
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-[11px] font-extrabold text-[#0B1B34] flex items-center justify-center" title={`${badge} waiting for approval`}>
              {badge}
            </span>
          )}
          {!collapsed && !badge && count != null && <span className="text-xs font-medium tabular-nums text-slate-500">{count}</span>}
          {collapsed && badge > 0 && <span className="absolute top-2 right-3.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#132A4A]" />}

          {collapsed && (
            <Tip>
              {item.label}
              {badge > 0 && <span className="ml-1.5 text-amber-300">{badge} pending</span>}
            </Tip>
          )}
        </>
      )}
    </NavLink>
  );
};

const SidebarBody = ({ collapsed = false, onToggleCollapse, onClose, mobile = false }) => {
  const user = useSelector((s) => s.user);
  const pendingTeachers = useSelector((s) => s.teacher.pendingTeachers)?.length || 0;
  const students = useSelector((s) => s.student);
  const counts = { pendingTeachers, students: Array.isArray(students) ? students.length : null };

  return (
    <div className="relative h-full flex flex-col bg-[#132A4A] text-white">
      {/* glow, clipped on its own layer so collapsed tooltips can overflow the sidebar */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-[#0BCCEB]/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#0A80F5]/20 blur-3xl" />
      </div>

      <div className={`relative h-16 shrink-0 flex items-center ${collapsed ? "justify-center" : "justify-between px-4"}`}>
        {collapsed ? (
          <img src={logo} alt="Present-Me" className="w-9 h-9 rounded-full object-cover bg-white ring-2 ring-white/90" />
        ) : (
          <BrandMark />
        )}
        {mobile && (
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!collapsed && user?.InstitutionName && (
        <div className="relative mx-3 mt-1 rounded-xl bg-white/[0.06] ring-1 ring-white/10 px-3.5 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0BCCEB]">Your institute</div>
          <div className="mt-1 text-sm font-bold leading-snug line-clamp-2">{user.InstitutionName}</div>
          {user.Role && <div className="mt-0.5 text-xs text-slate-400">Signed in as {user.Role}</div>}
        </div>
      )}

      <nav className={`relative flex-1 px-3 py-4 ${collapsed ? "overflow-visible" : "overflow-y-auto"}`} aria-label="Admin">
        <div className="space-y-1">
          {NAV_MAIN.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} counts={counts} onNavigate={onClose} />
          ))}
        </div>
        <div className="my-4 mx-2 h-px bg-white/10" />
        <div className="space-y-1">
          {NAV_ACCOUNT.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} counts={counts} onNavigate={onClose} />
          ))}
        </div>
      </nav>

      {onToggleCollapse && (
        <div className="relative shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`group relative w-full flex items-center gap-3 h-10 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] transition ${
              collapsed ? "justify-center" : "px-3"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
            {!collapsed && <span>Collapse</span>}
            {collapsed && <Tip>Expand</Tip>}
          </button>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ collapsed = false, onToggleCollapse, mobileOpen = false, onClose }) => {
  // Mobile drawer: close on Escape and stop the page behind it from scrolling
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, onClose]);

  return (
    <>
      <aside className={`hidden md:block fixed inset-y-0 left-0 z-40 transition-[width] duration-200 ease-out ${collapsed ? "w-[76px]" : "w-64"}`}>
        <SidebarBody collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute inset-0 bg-[#0B1B34]/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <SidebarBody mobile onClose={onClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
