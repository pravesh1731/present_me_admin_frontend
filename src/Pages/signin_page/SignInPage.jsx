import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  InputFieldSvg,
  LogoSvg,
  EmailSvg,
} from "../../components/common/svg/svg";
import Button from "../../components/common/buttons/button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
     dispatch(addUser(response.data));
     
      // Expecting response.data.status to be 'verified' or 'pending'
      if (response.data.institution.status === "verified") {
        navigate("/admin");
      } else if (response.data.institution.status === "pending") {
        navigate("/pending_verification");
      } else {
        setError("Invalid credentials. Please try again.");
      }
      
    } catch (err) {
      console.log("Error during sign in:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-4 rounded-2xl shadow-xl mb-6"
          >
            <LogoSvg />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-gray-600 text-center"
          >
            Sign in to access your admin dashboard
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-[#0BCCEB]/10 via-[#0A80F5]/5 to-white border-b border-gray-100 px-8 py-6">
              <h4 className="text-xl font-bold text-gray-900">Sign In</h4>
              <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#0A80F5]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Enter your credentials to access the admin panel
              </p>
            </div>

            <form
              className="px-6 py-6 sm:px-8 sm:py-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <EmailSvg />
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type="email"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      placeholder="your.email@institution.edu"
                      required
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
                      className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
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

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#0A80F5] border-gray-300 rounded focus:ring-[#0A80F5] focus:ring-2 transition-all cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="/forget_password"
                    className="text-sm text-[#0A80F5] hover:text-[#0BCCEB] font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm"
                  >
                    <p className="text-sm text-red-800 font-medium flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{error}</span>
                    </p>
                  </motion.div>
                )}

                <div>
                  <Button
                    text={isLoading ? "Logging..." : "Sign In"}
                    disabled={isLoading}
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                      href="/signup"
                      className="text-[#0A80F5] hover:text-[#0BCCEB] font-semibold transition-colors"
                    >
                      Create one here →
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            © 2024 Present-Me. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;
