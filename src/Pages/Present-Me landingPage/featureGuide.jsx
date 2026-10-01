import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Presentation, Building2, Search, X, Compass, Lightbulb, PlayCircle, ChevronRight } from "lucide-react";
import { FEATURE_GUIDE, findWalkthrough } from "./landingContent";
import { PhoneScreen, BrowserScreen } from "./mockups";
import { INK, BRAND_GRADIENT, FOCUS_RING, reveal } from "./theme";
import { SectionTitle, IconChip, PlayStoreButton, PrimaryCta, SecondaryCta } from "./ui";

const ROLE_ICON = { student: GraduationCap, teacher: Presentation, institute: Building2 };

const matches = (f, q) => [f.title, f.summary, f.where, ...f.steps, f.tip || ""].join(" ").toLowerCase().includes(q);

const FeatureDetail = ({ feature, group, frame, role, onWatch }) => {
  const walkthrough = findWalkthrough(feature.scene);
  return (
    <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-[0_24px_60px_-30px_rgba(11,27,52,0.35)] p-5 sm:p-7">
      <div className={`grid grid-cols-1 gap-8 ${frame === "phone" ? "xl:grid-cols-[minmax(0,1fr)_auto]" : ""}`}>
        <div className="min-w-0">
          <div className="flex items-start gap-3.5">
            <IconChip icon={feature.icon} className="w-12 h-12" />
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-[#4B7BE3]">{group}</div>
              <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${INK}`}>{feature.title}</h3>
              <p className="mt-1 text-slate-600">{feature.summary}</p>
            </div>
          </div>

          <div className="mt-5 inline-flex max-w-full items-start gap-2 rounded-xl bg-[#EEF5FF] px-3 py-2 text-sm text-[#2F55B0]">
            <Compass className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold">Where:</span> {feature.where}
            </span>
          </div>

          <div className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">How to use it</div>
          <ol className="mt-3 space-y-3">
            {feature.steps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ${BRAND_GRADIENT}`}>{i + 1}</span>
                <span className="pt-0.5 text-slate-700 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>

          {feature.tip && (
            <div className="mt-5 flex gap-3 rounded-2xl bg-amber-50 ring-1 ring-amber-100 p-4 text-sm text-amber-900 leading-relaxed">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
              {feature.tip}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {walkthrough && (
              <button
                onClick={() => onWatch(walkthrough)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0B1B34] text-white font-semibold hover:bg-black transition ${FOCUS_RING}`}
              >
                <PlayCircle className="w-5 h-5 text-[#7CC8E0]" /> Watch walkthrough
              </button>
            )}
            {role === "institute" ? <SecondaryCta to="/signup">Register your institute</SecondaryCta> : <PlayStoreButton size="sm" />}
          </div>
        </div>

        <div className={`flex justify-center ${frame === "phone" ? "" : "w-full"}`}>
          {frame === "phone" ? <PhoneScreen id={feature.scene} className="scale-[0.92] origin-top -mb-10" /> : <BrowserScreen id={feature.scene} className="max-w-[640px]" />}
        </div>
      </div>
    </div>
  );
};

export const FeatureGuide = ({ onWatch }) => {
  const [role, setRole] = useState("student");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(null);
  const [openInline, setOpenInline] = useState(true); // small screens: tap the open feature again to close it
  const guide = FEATURE_GUIDE[role];
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () => guide.groups.map((g) => ({ ...g, features: q ? g.features.filter((f) => matches(f, q)) : g.features })).filter((g) => g.features.length),
    [guide, q]
  );
  const visible = groups.flatMap((g) => g.features.map((f) => ({ f, group: g.name })));
  const active = visible.find((v) => v.f.title === picked) || visible[0];
  const count = (r) => FEATURE_GUIDE[r].groups.reduce((n, g) => n + g.features.length, 0);

  const pickRole = (r) => {
    setRole(r);
    setPicked(null);
    setQuery("");
    setOpenInline(true);
  };

  const pick = (f) => {
    if (f === active?.f) return setOpenInline((o) => !o);
    setPicked(f.title);
    setOpenInline(true);
  };

  return (
    <section id="guide" className="scroll-mt-20 py-20 sm:py-28 bg-white/60 border-y border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          n="05"
          eyebrow="Feature guide"
          title="Every feature, and exactly how to use it."
          text="Pick who you are, then choose a feature. You'll see where it lives in the app, the steps to use it, and the real screen. Most features have a walkthrough you can watch too."
        />

        <motion.div {...reveal} className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div role="tablist" aria-label="Choose your role" className="inline-flex p-1.5 rounded-2xl bg-white ring-1 ring-slate-200 w-fit max-w-full overflow-x-auto">
            {Object.entries(FEATURE_GUIDE).map(([id, g]) => {
              const Icon = ROLE_ICON[id];
              const on = role === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => pickRole(id)}
                  className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${FOCUS_RING} ${
                    on ? "text-white" : "text-slate-600 hover:text-[#0B1B34]"
                  }`}
                >
                  {on && <motion.span layoutId="guide-role" className={`absolute inset-0 rounded-xl ${BRAND_GRADIENT}`} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <Icon className="relative w-4 h-4 hidden sm:block" />
                  <span className="relative">{g.label}</span>
                  <span className={`relative hidden sm:inline text-[11px] font-bold px-1.5 rounded-full ${on ? "bg-white/25" : "bg-slate-100 text-slate-500"}`}>{count(id)}</span>
                </button>
              );
            })}
          </div>

          <label className="relative block w-full md:w-80">
            <span className="sr-only">Search features</span>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${guide.label.toLowerCase()} features…`}
              className="w-full h-12 rounded-2xl bg-white ring-1 ring-slate-200 pl-10 pr-10 text-sm text-[#0B1B34] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4B7BE3]/50"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center" aria-label="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </label>
        </motion.div>

        {!active ? (
          <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200 p-10 text-center">
            <div className={`font-bold ${INK}`}>No feature matches “{query}”.</div>
            <button onClick={() => setQuery("")} className="mt-3 text-sm font-semibold text-[#4B7BE3] hover:underline">
              Clear the search
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 items-start">
            <nav aria-label={`${guide.label} features`} className="space-y-5">
              {groups.map((g) => (
                <div key={g.name}>
                  <div className="px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{g.name}</div>
                  <ul className="mt-2 space-y-1.5">
                    {g.features.map((f) => {
                      const on = f === active.f;
                      return (
                        <li key={f.title}>
                          <button
                            onClick={() => pick(f)}
                            aria-current={on ? "true" : undefined}
                            className={`w-full text-left rounded-2xl px-3 py-2.5 flex items-center gap-3 transition ${FOCUS_RING} ${
                              on ? "bg-white ring-2 ring-[#4B7BE3] shadow-lg shadow-[#4B7BE3]/10" : "ring-1 ring-transparent hover:bg-white hover:ring-slate-200"
                            }`}
                          >
                            <span className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${on ? `${BRAND_GRADIENT} text-white` : "bg-white ring-1 ring-slate-200 text-[#4B7BE3]"}`}>
                              <f.icon className="w-4 h-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block text-sm font-bold leading-tight ${on ? INK : "text-slate-700"}`}>{f.title}</span>
                              <span className="block text-xs text-slate-500 truncate">{f.summary}</span>
                            </span>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition ${on ? "text-[#4B7BE3] lg:translate-x-0.5" : "text-slate-300"} ${on ? "rotate-90 lg:rotate-0" : ""}`} />
                          </button>

                          {/* on small screens the details open right under the feature */}
                          <AnimatePresence initial={false}>
                            {on && openInline && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden">
                                <div className="pt-3 pb-2">
                                  <FeatureDetail feature={f} group={g.name} frame={guide.frame} role={role} onWatch={onWatch} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <div className="hidden lg:block rounded-2xl bg-[#0B1B34] text-white p-5">
                <div className="font-bold">{role === "institute" ? "Ready to set up your institute?" : "Try it on your phone"}</div>
                <p className="mt-1 text-sm text-slate-300">
                  {role === "institute" ? "Registration takes a few minutes. We verify your ID and switch you on." : "Present-Me is on Google Play for students and teachers."}
                </p>
                <div className="mt-4">{role === "institute" ? <PrimaryCta className="!px-5 !py-3 !text-sm">Register</PrimaryCta> : <PlayStoreButton size="sm" light />}</div>
              </div>
            </nav>

            <div className="hidden lg:block lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                <motion.div key={`${role}-${active.f.title}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <FeatureDetail feature={active.f} group={active.group} frame={guide.frame} role={role} onWatch={onWatch} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
