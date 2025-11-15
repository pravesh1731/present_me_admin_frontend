import React from "react";

const Button = ({ text, handleSubmit, disabled }) => {
  return (
    <div>
      <button
        type="submit"
        disabled={disabled}
        className={`w-full py-3 rounded-lg text-white font-medium shadow-md bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg transition-shadow"
        }`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
