import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PlayIcon } from "../../components/common/Brand";
import { PLAY_STORE_URL } from "./landingContent";
import { INK, BRAND_GRADIENT, FOCUS_RING, reveal } from "./theme";

/* Building blocks shared by every section of the landing page. */

export const PlayStoreButton = ({ size = "md", light = false }) => (
  <a
    href={PLAY_STORE_URL}
    target="_blank"
    rel="noreferrer"
    className={`group inline-flex items-center gap-3 rounded-2xl transition duration-200 hover:-translate-y-0.5 ${FOCUS_RING} ${
      light ? "bg-white text-[#0B1B34] hover:bg-slate-50" : "bg-[#0B1B34] text-white hover:bg-black"
    } ${size === "sm" ? "px-3.5 py-2" : "px-5 py-3"}`}
  >
    <PlayIcon className={size === "sm" ? "w-5 h-5" : "w-6 h-6"} />
    <span className="text-left leading-tight">
      <span className={`block uppercase tracking-wider ${size === "sm" ? "text-[8.5px]" : "text-[10px]"} opacity-70`}>Get it on</span>
      <span className={`block font-bold ${size === "sm" ? "text-sm" : "text-base"}`}>Google Play</span>
    </span>
  </a>
);

// Compact "Get the app" pill for the navbar and footer
export const GetAppPill = ({ className = "" }) => (
  <a
    href={PLAY_STORE_URL}
    target="_blank"
    rel="noreferrer"
    className={`group relative items-center gap-2 overflow-hidden rounded-xl ${BRAND_GRADIENT} pl-1.5 pr-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-[#4B7BE3]/30 hover:shadow-[#4B7BE3]/45 transition-shadow ${FOCUS_RING} ${className}`}
  >
    <span className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30 blur-sm translate-x-[-150%] group-hover:translate-x-[450%] transition-transform duration-700" />
    <span className="relative w-7 h-7 rounded-lg bg-white flex items-center justify-center">
      <PlayIcon />
    </span>
    <span className="relative">Get the app</span>
  </a>
);

export const PrimaryCta = ({ to = "/signup", children, className = "" }) => (
  <Link
    to={to}
    className={`group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl ${BRAND_GRADIENT} text-white text-base font-bold tracking-tight shadow-[0_10px_28px_-8px_rgba(75,123,227,0.55)] ring-1 ring-white/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-8px_rgba(75,123,227,0.6)] hover:brightness-105 active:translate-y-0 active:scale-[0.98] ${FOCUS_RING} ${className}`}
  >
    {children}
    <ArrowRight className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-1" />
  </Link>
);

export const SecondaryCta = ({ to = "/signin", children, className = "" }) => (
  <Link
    to={to}
    className={`inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white/70 ring-1 ring-[#4B7BE3]/25 font-semibold text-[#4B7BE3] hover:bg-white hover:ring-[#4B7BE3]/50 transition ${FOCUS_RING} ${className}`}
  >
    {children}
  </Link>
);

export const Eyebrow = ({ n, children, light }) => (
  <div className={`flex items-center gap-3 text-xs font-bold tracking-[0.18em] uppercase ${light ? "text-[#7CC8E0]" : "text-[#4B7BE3]"}`}>
    <span className={`tabular-nums ${light ? "text-white/40" : "text-slate-300"}`}>{n}</span>
    <span className={`h-px w-8 ${light ? "bg-white/20" : "bg-slate-200"}`} />
    {children}
  </div>
);

export const SectionTitle = ({ n, eyebrow, title, text, light, className = "" }) => (
  <motion.div {...reveal} className={`max-w-2xl ${className}`}>
    <Eyebrow n={n} light={light}>
      {eyebrow}
    </Eyebrow>
    <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.1] ${light ? "text-white" : INK}`}>{title}</h2>
    {text && <p className={`mt-4 text-base sm:text-lg leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>{text}</p>}
  </motion.div>
);

// Soft gradient chip that holds a section/feature icon
export const IconChip = ({ icon: Icon, className = "w-11 h-11", iconClass = "w-5 h-5" }) => (
  <span className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7CC8E0]/20 to-[#4B7BE3]/15 ring-1 ring-[#4B7BE3]/10 text-[#4B7BE3] ${className}`}>
    <Icon className={iconClass} />
  </span>
);
