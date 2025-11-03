import React from "react";

const Button = ({ text, handleSubmit }) => {
  return (
    <div>
      <button
        onClick={handleSubmit}
        //   type="submit"
        className="w-full py-3 rounded-lg text-white font-medium shadow-md bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5]"
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
