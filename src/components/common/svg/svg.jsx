import React from "react";

const LogoSvg = () => {
  return (
    <div>
      <svg
        className="w-10 h-10 text-white"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
          fill="currentColor"
        />
        <path
          d="M2 22c0-5.523 4.477-10 10-10s10 4.477 10 10"
          stroke="rgba(255,255,255,0.6)"
        />
        <path
          d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
          fill="currentColor"
        />
        <path
          d="M2 22c0-5.523 4.477-10 10-10s10 4.477 10 10"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const InputFieldSvg = ({ d1, d2 }) => {
  return (
    <div>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={d1} />
        <path strokeLinecap="round" strokeLinejoin="round" d={d2} />
      </svg>
    </div>
  );
};

export { LogoSvg, InputFieldSvg };
