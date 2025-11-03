import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputFieldSvg, LogoSvg } from "../../components/common/svg/svg";
import Button from "../../components/common/buttons/button";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12 bg-gradient-to-br from-white via-[#0BCCEB]/10 to-[#0A80F5]/10">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-3 rounded-xl shadow-md">
            <LogoSvg />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Present-Me Admin
          </h2>
          <p className="mt-2 text-gray-600">Sign in to your admin account</p>
        </div>

        <div className="mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-white/60 to-[#0BCCEB]/10 border-b border-gray-100 px-6 py-4">
              <h4 className="text-gray-900 font-semibold">Sign In</h4>
              <p className="text-gray-600 text-sm mt-1">
                Enter your credentials to access the admin panel
              </p>
            </div>

            <form className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="space-y-4">
                <div>
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
                      placeholder="admin@present_me.gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <InputFieldSvg d1="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3m-.75 0h10.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5z" />
                    </span>
                    <input
                      className="block w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        // 👁️ Eye open (password visible)
                        <InputFieldSvg
                          d1="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.364 4.5 12 4.5c4.636 0 8.577 3.01 9.964 7.178.07.205.07.433 0 .644C20.577 16.49 16.636 19.5 12 19.5c-4.636 0-8.577-3.01-9.964-7.178z"
                          d2="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                        />
                      ) : (
                        // 🚫 Eye slash (password hidden)
                        <InputFieldSvg d1="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.21 19.5 12 19.5c1.829 0 3.556-.435 5.06-1.205M9.88 9.88a3 3 0 1 0 4.24 4.24M6.228 6.228l11.544 11.544M9.88 9.88l4.24 4.24" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" /> Remember me
                  </label>
                  <a href="/forget_password" className="text-sm text-[#0A80F5]">
                    Forgot password?
                  </a>
                </div>

                <div>
                  <Button text="Sign In" handleSubmit={() => navigate("/")} />
                  
                </div>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-[#0A80F5]">
                      Create one here
                    </a>
                  </p>
                  {/* <p className="mt-3 text-xs text-gray-500">Demo Credentials:<br/>Email: admin@attendanceapp.edu<br/>Password: admin123</p> */}
                </div>
              </div>
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

export default SignInPage;
