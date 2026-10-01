import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SAFETY, ROADMAP } from "./landingContent";
import { INK, BRAND_GRADIENT, reveal } from "./theme";
import { SectionTitle, IconChip } from "./ui";

/* ---------- 08 · privacy & safety, plus what's coming ---------- */

export const SafetySection = () => (
  <section id="safety" className="scroll-mt-20 py-20 sm:py-28 bg-white/60 border-y border-slate-200/70">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <SectionTitle
        n="08"
        eyebrow="Privacy & safety"
        title="Safe for students. Simple for colleges."
        text="Present-Me only asks for what attendance needs, and keeps the sensitive parts on your own phone."
      />

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAFETY.map((s, i) => (
          <motion.div
            key={s.title}
            {...reveal}
            transition={{ ...reveal.transition, delay: (i % 3) * 0.07 }}
            className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4B7BE3]/10 hover:ring-[#4B7BE3]/30 transition-all duration-300"
          >
            <IconChip icon={s.icon} />
            <h3 className={`mt-4 text-lg font-bold ${INK}`}>{s.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>

      {/* roadmap */}
      <motion.div {...reveal} className={`mt-6 rounded-3xl p-[1.5px] ${BRAND_GRADIENT}`}>
        <div className="rounded-[calc(1.5rem-1.5px)] bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#4B7BE3]">
                <Sparkles className="w-4 h-4" /> Coming soon
              </div>
              <h3 className={`mt-2 text-xl sm:text-2xl font-bold ${INK}`}>What we're building next</h3>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">The app already lists these as coming soon. They will arrive as updates on Google Play.</p>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROADMAP.map((r) => (
              <div key={r.title} className="rounded-2xl bg-slate-50 ring-1 ring-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <r.icon className="w-5 h-5 text-[#4B7BE3]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEF5FF] text-[#4B7BE3]">Planned</span>
                </div>
                <div className={`mt-3 font-bold ${INK}`}>{r.title}</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
