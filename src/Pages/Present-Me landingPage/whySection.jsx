import React, { useId, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Timer, ChevronRight } from "lucide-react";
import { COMPARISON, ROLE_BENEFITS, UNIQUE, TRUST_CHAIN } from "./landingContent";
import { INK, BRAND_GRADIENT, reveal } from "./theme";
import { SectionTitle, IconChip } from "./ui";

/* ---------- 01 · why ---------- */

const TEACHING_DAYS = 90; // rough length of a semester, shown to the reader next to the result

const Slider = ({ label, value, min, max, step = 1, unit, onChange }) => {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <label htmlFor={id} className="text-slate-300">
          {label}
        </label>
        <span className="font-bold tabular-nums text-white">
          {value}
          {unit && <span className="text-slate-400 font-semibold"> {unit}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#7CC8E0] cursor-pointer"
      />
    </div>
  );
};

const RollCallCalculator = () => {
  const [students, setStudents] = useState(60);
  const [lectures, setLectures] = useState(4);
  const [seconds, setSeconds] = useState(4);

  const perLecture = (students * seconds) / 60;
  const perDay = perLecture * lectures;
  const perSemesterHours = (perDay * TEACHING_DAYS) / 60;
  const fmt = (n) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10);

  return (
    <motion.div {...reveal} className="relative overflow-hidden rounded-3xl bg-[#0B1B34] text-white p-6 sm:p-7">
      <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[#7CC8E0]/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2.5 text-[#7CC8E0] text-xs font-bold uppercase tracking-[0.16em]">
          <Timer className="w-4 h-4" /> Roll-call calculator
        </div>
        <h3 className="mt-3 text-xl font-bold leading-snug">How much teaching time does calling names cost you?</h3>

        <div className="mt-6 space-y-5">
          <Slider label="Students in a class" value={students} min={20} max={150} step={5} onChange={setStudents} />
          <Slider label="Lectures you take a day" value={lectures} min={1} max={8} onChange={setLectures} />
          <Slider label="Seconds per name" value={seconds} min={2} max={8} unit="sec" onChange={setSeconds} />
        </div>

        <div className="mt-7 grid grid-cols-3 gap-2 text-center">
          {[
            [fmt(perLecture), "min", "each lecture"],
            [fmt(perDay), "min", "every day"],
            [fmt(perSemesterHours), "hrs", "a semester"],
          ].map(([v, u, l], i) => (
            <div key={l} className={`rounded-2xl p-3 ${i === 2 ? BRAND_GRADIENT : "bg-white/[0.07] ring-1 ring-white/10"}`}>
              <div className="text-2xl sm:text-[1.7rem] font-extrabold tabular-nums leading-none">
                {v}
                <span className="text-sm font-bold opacity-80"> {u}</span>
              </div>
              <div className={`mt-1.5 text-[11px] ${i === 2 ? "text-white/90" : "text-slate-400"}`}>{l}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          An estimate from your numbers, assuming about {TEACHING_DAYS} teaching days a semester. With Present-Me, students mark at the same time while you
          start teaching.
        </p>
      </div>
    </motion.div>
  );
};

export const WhySection = () => (
  <section id="why" className="scroll-mt-20 py-20 sm:py-28 bg-white/60 border-y border-slate-200/70">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <SectionTitle
        n="01"
        eyebrow="Why Present-Me"
        title="Roll call is the slowest part of every lecture."
        text="Calling names wastes time, proxies slip through, and registers still have to be totalled by hand. Present-Me replaces all of it with one quick, verified tap."
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 items-start">
        {/* old way vs Present-Me */}
        <motion.div {...reveal} className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[0.8fr_1fr_1fr] text-xs font-bold uppercase tracking-wider">
            <div className="px-5 py-4 text-slate-400" />
            <div className="px-5 py-4 text-slate-500 bg-slate-50">The old way</div>
            <div className={`px-5 py-4 text-white ${BRAND_GRADIENT}`}>With Present-Me</div>
          </div>
          <dl className="divide-y divide-slate-100">
            {COMPARISON.map(([topic, before, after]) => (
              <div key={topic} className="grid sm:grid-cols-[0.8fr_1fr_1fr] gap-2 sm:gap-0 px-5 sm:px-0 py-4 sm:py-0">
                <dt className={`sm:px-5 sm:py-4 font-bold text-sm ${INK}`}>{topic}</dt>
                <dd className="sm:px-5 sm:py-4 sm:bg-slate-50/70 flex gap-2.5 text-sm text-slate-500">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <X className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  {before}
                </dd>
                <dd className="sm:px-5 sm:py-4 flex gap-2.5 text-sm font-medium text-slate-700">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  {after}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <RollCallCalculator />
      </div>

      {/* benefits per role */}
      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {ROLE_BENEFITS.map((r, i) => (
          <motion.div
            key={r.role}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4B7BE3]/10 hover:ring-[#4B7BE3]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <IconChip icon={r.icon} />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#4B7BE3]">For</div>
                <div className={`text-lg font-bold ${INK}`}>{r.role}</div>
              </div>
            </div>
            <ul className="mt-5 space-y-2.5">
              {r.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- 03 · what makes it different ---------- */

export const UniqueSection = () => (
  <section id="unique" className="scroll-mt-20 py-20 sm:py-28 bg-white/60 border-y border-slate-200/70">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <SectionTitle
        n="03"
        eyebrow="What makes it different"
        title="Built so attendance can't be faked."
        text="Most attendance apps just record a tap. Present-Me checks where the phone is and who is holding it, and every person in the chain is verified."
      />

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {UNIQUE.map((u, i) => (
          <motion.div
            key={u.title}
            {...reveal}
            transition={{ ...reveal.transition, delay: (i % 3) * 0.07 }}
            className={`group rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 ${
              i === 0
                ? "bg-gradient-to-br from-[#3E8FC4] to-[#4B7BE3] text-white shadow-[0_18px_40px_-18px_rgba(75,123,227,0.7)]"
                : "bg-white ring-1 ring-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-[#4B7BE3]/10 hover:ring-[#4B7BE3]/30"
            }`}
          >
            {i === 0 ? (
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30">
                <u.icon className="w-5 h-5" />
              </span>
            ) : (
              <IconChip icon={u.icon} />
            )}
            <h3 className={`mt-4 text-lg font-bold ${i === 0 ? "text-white" : INK}`}>{u.title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${i === 0 ? "text-white/90" : "text-slate-600"}`}>{u.text}</p>
          </motion.div>
        ))}
      </div>

      {/* chain of trust */}
      <motion.div {...reveal} className="mt-6 rounded-3xl bg-[#0B1B34] text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-[#4B7BE3]/25 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#7CC8E0]">The chain of trust</div>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold">Everyone who touches a mark is verified.</h3>
          <ol className="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center">
            {TRUST_CHAIN.map((t, i) => (
              <React.Fragment key={t.who}>
                <li className="flex lg:flex-col items-center lg:text-center gap-3 rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-4 h-full">
                  <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${BRAND_GRADIENT}`}>
                    <t.icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block font-bold">{t.who}</span>
                    <span className="block text-sm text-slate-300">{t.does}</span>
                  </span>
                </li>
                {i < TRUST_CHAIN.length - 1 && <ChevronRight className="hidden lg:block w-5 h-5 text-[#7CC8E0]" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </ol>
        </div>
      </motion.div>
    </div>
  </section>
);
