import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search, UserCheck } from "lucide-react";
import Avatar from "../common/Avatar";
import { fullName } from "../../utils/people";
import { NAV_ACCOUNT, NAV_MAIN } from "../sidebar/nav";

const EMPTY = [];
const PAGES = [...NAV_MAIN, ...NAV_ACCOUNT];
const MOD_KEY = typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl";
const PER_GROUP = 5;

const hit = (q, ...fields) => fields.some((f) => f != null && String(f).toLowerCase().includes(q));
const isTyping = (el) => el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);

const Key = ({ children }) => (
  <kbd className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-md bg-slate-100 ring-1 ring-slate-200 text-[10px] font-bold text-slate-500">{children}</kbd>
);

/* Jump to any teacher, student or admin page. Opens with the button, ⌘K / Ctrl+K, or "/". */
const QuickSearch = () => {
  const navigate = useNavigate();
  const pending = useSelector((s) => s.teacher.pendingTeachers) || EMPTY;
  const verified = useSelector((s) => s.teacher.verifiedTeachers) || EMPTY;
  const students = useSelector((s) => s.student);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef(null);

  const show = () => {
    setQuery("");
    setCursor(0);
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) return setOpen(false);
      } else if (e.key !== "/" || open || isTyping(document.activeElement)) {
        return;
      }
      e.preventDefault();
      setQuery("");
      setCursor(0);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const pages = PAGES.map((p) => ({ key: p.to, group: "Go to", title: p.label, icon: p.icon, to: p.to }));
      if (pending.length) {
        pages.splice(1, 0, {
          key: "pending",
          group: "Go to",
          title: "Review pending teachers",
          meta: `${pending.length} waiting`,
          icon: UserCheck,
          to: "/admin/teachers?tab=pending",
        });
      }
      return pages;
    }

    const teachers = [...pending.map((t) => [t, true]), ...verified.map((t) => [t, false])]
      .filter(([t]) => hit(q, fullName(t), t.emailId, t.phone, t.department, t.employeeId))
      .slice(0, PER_GROUP)
      .map(([t, isPending]) => ({
        key: `t-${t.teacherId}`,
        group: "Teachers",
        title: fullName(t) || t.emailId,
        sub: [t.department, t.emailId].filter(Boolean).join(" · "),
        person: t,
        tag: isPending ? "Pending" : null,
        to: `/admin/teachers?teacher=${encodeURIComponent(t.teacherId)}`,
      }));

    const studentHits = (students || EMPTY)
      .filter((s) => hit(q, fullName(s), s.emailId, s.rollNo, s.phone))
      .slice(0, PER_GROUP)
      .map((s) => ({
        key: `s-${s.studentId}`,
        group: "Students",
        title: fullName(s) || s.emailId,
        sub: [s.rollNo && `Roll ${s.rollNo}`, s.emailId].filter(Boolean).join(" · "),
        person: s,
        to: `/admin/students?student=${encodeURIComponent(s.studentId)}`,
      }));

    const pages = PAGES.filter((p) => p.label.toLowerCase().includes(q)).map((p) => ({ key: p.to, group: "Pages", title: p.label, icon: p.icon, to: p.to }));

    return [...teachers, ...studentHits, ...pages];
  }, [query, pending, verified, students]);

  const active = Math.min(cursor, results.length - 1);

  // keep the highlighted row visible while arrowing through a long list
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item) => {
    if (!item) return;
    setOpen(false);
    navigate(item.to);
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (Math.min(c, results.length - 1) + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (Math.min(c, results.length - 1) - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="hidden sm:flex items-center gap-2.5 h-10 w-full max-w-md rounded-xl bg-white ring-1 ring-slate-200 px-3 text-sm text-slate-400 hover:ring-slate-300 hover:text-slate-500 transition"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search people…</span>
        <span className="flex items-center gap-0.5">
          <Key>{MOD_KEY}</Key>
          <Key>K</Key>
        </span>
      </button>
      <button
        type="button"
        onClick={show}
        className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 sm:px-4 pt-3 sm:pt-[12vh]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-[#0B1B34]/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                role="dialog"
                aria-modal="true"
                aria-label="Search"
                className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 border-b border-slate-100">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setCursor(0);
                    }}
                    onKeyDown={onInputKey}
                    placeholder="Search teachers, students or pages"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="quick-search-list"
                    aria-activedescendant={active >= 0 ? `quick-search-${active}` : undefined}
                    className="flex-1 min-w-0 h-14 bg-transparent outline-none text-[15px] text-[#0B1B34] placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setOpen(false)} className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-slate-500 bg-slate-100 ring-1 ring-slate-200 hover:bg-slate-200">
                    Esc
                  </button>
                </div>

                <div ref={listRef} id="quick-search-list" role="listbox" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
                  {results.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="text-sm font-bold text-[#0B1B34]">Nothing matches “{query.trim()}”</div>
                      <p className="mt-1 text-sm text-slate-500">Try a name, email address or roll number.</p>
                    </div>
                  ) : (
                    results.map((r, i) => (
                      <React.Fragment key={r.key}>
                        {(i === 0 || results[i - 1].group !== r.group) && (
                          <div className="px-3 pt-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 first:pt-1">{r.group}</div>
                        )}
                        <button
                          type="button"
                          id={`quick-search-${i}`}
                          role="option"
                          aria-selected={i === active}
                          data-index={i}
                          onMouseMove={() => i !== active && setCursor(i)}
                          onClick={() => go(r)}
                          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${i === active ? "bg-[#EEF5FF]" : ""}`}
                        >
                          {r.person ? (
                            <Avatar person={r.person} className="w-8 h-8 text-[11px]" />
                          ) : (
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${i === active ? "bg-white text-[#0A80F5]" : "bg-slate-100 text-slate-500"}`}>
                              <r.icon className="w-4 h-4" />
                            </span>
                          )}
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-semibold text-[#0B1B34] truncate">{r.title}</span>
                            {r.sub && <span className="block text-xs text-slate-500 truncate">{r.sub}</span>}
                          </span>
                          {r.tag && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">{r.tag}</span>}
                          {r.meta && <span className="text-xs font-semibold text-amber-700">{r.meta}</span>}
                          {i === active && <CornerDownLeft className="hidden sm:block w-4 h-4 text-[#0A80F5] shrink-0" />}
                        </button>
                      </React.Fragment>
                    ))
                  )}
                  {students == null && query.trim() && <div className="px-3 py-2 text-xs text-slate-400">Students are still loading…</div>}
                </div>

                <div className="hidden sm:flex items-center gap-4 border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Key>↑</Key>
                    <Key>↓</Key> move
                  </span>
                  <span className="flex items-center gap-1">
                    <Key>Enter</Key> open
                  </span>
                  <span className="flex items-center gap-1">
                    <Key>/</Key> search from anywhere
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default QuickSearch;
