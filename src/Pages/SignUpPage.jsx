import React, { useState } from "react";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [lastName, setLastName] = useState("");


   const handleSubmit = () => {
    console.log("Input value:", lastName);
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12 bg-gradient-to-br from-white via-[#0BCCEB]/10 to-[#0A80F5]/10">
      <div className="w-full max-w-2xl">
        {/* Top header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-3 rounded-xl shadow-md">
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
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join Present-Me
          </h2>
          <p className="mt-2 text-gray-600">
            Create your admin account to get started
          </p>
        </div>

        {/* Card */}
        <div className="mx-auto w-full ">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-white/60 to-[#0BCCEB]/10 border-b border-gray-100 px-6 py-4">
              <h4 className="text-gray-900 font-semibold">Create Account</h4>
              <p className="text-gray-600 text-sm mt-1">
                Fill in your information to create an admin account
              </p>
            </div>

            <form className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z"
                        />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      type="text"
                      placeholder="First Name"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z"
                        />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      type="text"
                      placeholder="Last Name"
					  value={lastName}
					  onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email (full width) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="4"
                          width="20"
                          height="16"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      type="email"
                      placeholder="Enter the email address provided by your institution"
                    />
                  </div>
                </div>

                {/* Phone (full width) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a1.5 1.5 0 0 0 1.5-1.5v-2.25a1.5 1.5 0 0 0-1.28-1.48l-3.66-.61a1.5 1.5 0 0 0-1.52.75l-.72 1.26a12.035 12.035 0 0 1-5.67-5.67l1.26-.72a1.5 1.5 0 0 0 .75-1.52l-.61-3.66A1.5 1.5 0 0 0 6.75 2.25H4.5A1.5 1.5 0 0 0 3 3.75v3z"
                        />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm tabular-nums"
                      type="tel"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                {/* Institution (full width) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Institution Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3l8.485 4.243a1 1 0 0 1 0 1.514L12 13 3.515 8.757a1 1 0 0 1 0-1.514L12 3z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 10.5V17a1 1 0 0 0 .553.894l6.447 3.223a1 1 0 0 0 .894 0l6.447-3.223A1 1 0 0 0 19.5 17v-6.5"
                        />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      type="text"
                      placeholder="University Name in Capital Letters"
                    />
                  </div>
                </div>

                {/* Role select (full width) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select className="block w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm appearance-none">
                    <option disabled>Choose Teacher Type</option>
                    <option>Dean</option>
                    <option>HOD</option>
                    <option>Batch Incharge</option>
                    <option>Subject Teacher</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3m-.75 0h10.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5z"
                        />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                    />
                    <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            // 👁️ Eye open (password visible)
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.364 4.5 12 4.5c4.636 0 8.577 3.01 9.964 7.178.07.205.07.433 0 .644C20.577 16.49 16.636 19.5 12 19.5c-4.636 0-8.577-3.01-9.964-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
              />
            </svg>
          ) : (
            // 🚫 Eye slash (password hidden)
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.21 19.5 12 19.5c1.829 0 3.556-.435 5.06-1.205M9.88 9.88a3 3 0 1 0 4.24 4.24M6.228 6.228l11.544 11.544M9.88 9.88l4.24 4.24"
              />
            </svg>
          )}
        </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3m-.75 0h10.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5z"
                        />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                    />
                    <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showConfirm ? (
            // 👁️ Eye open (password visible)
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.364 4.5 12 4.5c4.636 0 8.577 3.01 9.964 7.178.07.205.07.433 0 .644C20.577 16.49 16.636 19.5 12 19.5c-4.636 0-8.577-3.01-9.964-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
              />
            </svg>
          ) : (
            // 🚫 Eye slash (password hidden)
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.21 19.5 12 19.5c1.829 0 3.556-.435 5.06-1.205M9.88 9.88a3 3 0 1 0 4.24 4.24M6.228 6.228l11.544 11.544M9.88 9.88l4.24 4.24"
              />
            </svg>
          )}
        </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <input type="checkbox" id="agree" className="mt-1" />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a className="text-indigo-600">Terms of Service</a> and{" "}
                  <a className="text-indigo-600">Privacy Policy</a>
                </label>
              </div>

              <div className="mt-6">
                <button
                 onClick={handleSubmit}
                //   type="submit"
                  className="w-full py-3 rounded-lg text-white font-medium shadow-md bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5]"
                >
                  Create Account
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/signin" className="text-indigo-600">Sign in here</a>
              </p>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            © 2024 Present-Me. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;



