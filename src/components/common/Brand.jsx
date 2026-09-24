import React from "react";
import logo from "../../assets/image.png";
import { PLAY_STORE_URL, useSvgId } from "../../utils/brand";

/* Logo + wordmark. `tone="dark"` for navy surfaces, `tone="light"` for light backgrounds. */
export const BrandMark = ({ onClick, tone = "dark" }) => {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className="group flex items-center gap-2.5 rounded-xl pr-2 py-1" aria-label={onClick ? "Present-Me home" : undefined}>
      <span className="relative">
        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] opacity-0 group-hover:opacity-40 blur-md transition-opacity" />
        <img
          src={logo}
          alt=""
          className={`relative w-9 h-9 rounded-full object-cover bg-white shadow-sm ${tone === "dark" ? "ring-2 ring-white/90" : "ring-1 ring-slate-200"}`}
        />
      </span>
      <span className="text-[1.15rem] font-extrabold tracking-tight">
        <span className={`bg-gradient-to-r bg-clip-text text-transparent ${tone === "dark" ? "from-[#0BCCEB] to-[#4FB3FF]" : "from-[#0BCCEB] to-[#0A80F5]"}`}>
          Present
        </span>
        <span className={tone === "dark" ? "text-white" : "text-[#0B1B34]"}>-Me</span>
      </span>
    </Tag>
  );
};

export const PlayIcon = ({ className = "w-4 h-4" }) => {
  const gid = useSvgId("gp");
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00D7FE" />
          <stop offset="0.45" stopColor="#00F076" />
          <stop offset="0.7" stopColor="#FFD500" />
          <stop offset="1" stopColor="#FF3A44" />
        </linearGradient>
      </defs>
      <path
        d="M4.2 2.3c-.3.2-.5.6-.5 1.1v17.2c0 .5.2.9.5 1.1l9.6-9.7-9.6-9.7Zm10.7 8.6 2.9-2.9-11-6.3c-.4-.2-.8-.2-1.1-.1l9.2 9.3Zm0 2.2-9.2 9.3c.3.1.7.1 1.1-.1l11-6.3-2.9-2.9Zm3.9-4.5-3.1 3.4 3.1 3.4 3.1-1.8c.9-.5.9-2.7 0-3.2l-3.1-1.8Z"
        fill={`url(#${gid})`}
      />
    </svg>
  );
};

export const GetAppButton = ({ className = "" }) => (
  <a
    href={PLAY_STORE_URL}
    target="_blank"
    rel="noreferrer"
    className={`group relative items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] pl-1.5 pr-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-[#0A80F5]/30 hover:shadow-[#0A80F5]/45 transition-shadow ${className}`}
  >
    {/* sheen on hover */}
    <span className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30 blur-sm translate-x-[-150%] group-hover:translate-x-[450%] transition-transform duration-700" />
    <span className="relative w-7 h-7 rounded-lg bg-white flex items-center justify-center">
      <PlayIcon />
    </span>
    <span className="relative">Get the app</span>
  </a>
);
