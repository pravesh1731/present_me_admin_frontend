import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LogoSvg,
  InputFieldSvg,
  EmailSvg,
} from "../../components/common/svg/svg.jsx";
import Button from "../../components/common/buttons/button.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [phone, setPhone] = useState("");
  const [Role, setRole] = useState("");
  const [InstitutionName, setInstitutionName] = useState("");
  const [aadhar, setAadhar] = useState(null);
  const [designationID, setDesignationID] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [expectedStudents, setExpectedStudents] = useState("");
  const [expectedTeachers, setExpectedTeachers] = useState("");

  const handleSubmit = async () => {
    const newErrors = {};

    // Validate all fields
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!emailId) newErrors.emailId = "Email is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!Role) newErrors.Role = "Role is required";
    if (!InstitutionName)
      newErrors.InstitutionName = "Institution name is required";
    if (!aadhar) newErrors.aadhar = "Aadhaar card is required";
    if (!designationID) newErrors.designationID = "Designation ID is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    if (!address) newErrors.address = "Address is required";
    if (!website) newErrors.website = "Website is required";
    if (!expectedStudents) newErrors.expectedStudents = "Expected students is required";
    if (!expectedTeachers) newErrors.expectedTeachers = "Expected teachers is required";

    // Validate password match
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate terms checkbox
    if (!agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("emailId", emailId);
      formData.append("phone", phone);
      formData.append("Role", Role);
      formData.append("InstitutionName", InstitutionName);
      formData.append("password", password);
      formData.append("address", address);
      formData.append("website", website);
      formData.append("expectedStudents", expectedStudents);
      formData.append("expectedTeachers", expectedTeachers);

      // Append files
      if (aadhar) formData.append("aadhar", aadhar);
      if (designationID) formData.append("designationID", designationID);

      const res = await axios.post(
        "http://localhost:3000/admin/signup",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show success message
      setSuccessMessage(
        "Account created successfully! Redirecting to verification page..."
      );
      setIsLoading(false);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/pending_verification");
      }, 3000);
    } catch (error) {
      console.error("Error during sign up:", error);
      setIsLoading(false);
      setErrors({
        submit:
          error.response?.data?.message || "Sign up failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="w-full max-w-2xl">
        {/* Top header */}
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
            Join Present-Me
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-gray-600 text-center max-w-md"
          >
            Create your admin account to manage attendance and classroom
            operations
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-[#0BCCEB]/10 via-[#0A80F5]/5 to-white border-b border-gray-100 px-8 py-6">
              <h4 className="text-xl font-bold text-gray-900">
                Create Account
              </h4>
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
                Fill in your information to create an admin account
              </p>
            </div>

            <form
              className="px-6 py-6 sm:px-8 sm:py-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <InputFieldSvg d1="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z" />
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type="text"
                      value={firstName}
                      placeholder="First Name"
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                {/* Last Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <InputFieldSvg d1="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z" />
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email (full width) */}
                <div className="md:col-span-2">
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
                      placeholder="your.name@institution.edu"
                      onChange={(e) => setEmailId(e.target.value)}
                      required
                    />
                  </div>
                  {errors.emailId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.emailId}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <InputFieldSvg d1="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a1.5 1.5 0 0 0 1.5-1.5v-2.25a1.5 1.5 0 0 0-1.28-1.48l-3.66-.61a1.5 1.5 0 0 0-1.52.75l-.72 1.26a12.035 12.035 0 0 1-5.67-5.67l1.26-.72a1.5 1.5 0 0 0 .75-1.52l-.61-3.66A1.5 1.5 0 0 0 6.75 2.25H4.5A1.5 1.5 0 0 0 3 3.75v3z" />
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm tabular-nums transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type="tel"
                      value={phone}
                      placeholder="+91 1234567890"
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>
                {/* Role (next to Phone on md+) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm appearance-none transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300 cursor-pointer"
                      value={Role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Choose Teacher Type
                      </option>
                      <option>Dean</option>
                      <option>HOD</option>
                      
                      <option>Class Incharge</option>
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.Role && (
                    <p className="mt-1 text-xs text-red-600">{errors.Role}</p>
                  )}
                </div>
{/* Address (full width) */}
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Address
                                  </label>
                                  <input
                                    className="block w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Institution Address"
                                    required
                                  />
                                  {errors.address && (
                                    <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                                  )}
                                </div>

                                {/* Website (full width) */}
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Website
                                  </label>
                                  <input
                                    className="block w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                                    type="text"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://yourinstitution.edu"
                                    required
                                  />
                                  {errors.website && (
                                    <p className="mt-1 text-xs text-red-600">{errors.website}</p>
                                  )}
                                </div>

                                {/* Expected Students */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Expected Students
                                  </label>
                                  <input
                                    className="block w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                                    type="number"
                                    min="0"
                                    value={expectedStudents}
                                    onChange={(e) => setExpectedStudents(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Number of students"
                                    required
                                  />
                                  {errors.expectedStudents && (
                                    <p className="mt-1 text-xs text-red-600">{errors.expectedStudents}</p>
                                  )}
                                </div>

                                {/* Expected Teachers */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Expected Teachers
                                  </label>
                                  <input
                                    className="block w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                                    type="number"
                                    min="0"
                                    value={expectedTeachers}
                                    onChange={(e) => setExpectedTeachers(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Number of teachers"
                                    required
                                  />
                                  {errors.expectedTeachers && (
                                    <p className="mt-1 text-xs text-red-600">{errors.expectedTeachers}</p>
                                  )}
                                </div>
                {/* Institution (full width, moved below) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Institution Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <InputFieldSvg
                        d1="M12 3l8.485 4.243a1 1 0 0 1 0 1.514L12 13 3.515 8.757a1 1 0 0 1 0-1.514L12 3z"
                        d2="M4.5 10.5V17a1 1 0 0 0 .553.894l6.447 3.223a1 1 0 0 0 .894 0l6.447-3.223A1 1 0 0 0 19.5 17v-6.5"
                      />
                    </span>
                    <input
                      className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type="text"
                      value={InstitutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="University Name in Capital Letters"
                      required
                    />
                  </div>
                  {errors.InstitutionName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.InstitutionName}
                    </p>
                  )}
                </div>
                {/* Uploads: Aadhaar and Designation ID (styled like other inputs) */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aadhaar Card Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Upload Aadhaar Card
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-300">
                        <InputFieldSvg
                          d1="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"
                          d2="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                        />
                      </span>
                      <div className="border border-gray-200 rounded-lg pl-10 pr-3 bg-white text-sm text-gray-700 h-11 flex items-center transition-all hover:border-gray-300">
                        {aadhar ? (
                          <span className="block truncate font-medium">
                            {aadhar.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">No file chosen</span>
                        )}
                      </div>
                      <input
                        id="aadhaar"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setAadhar(e.target.files?.[0] || null)}
                        className="hidden"
                        required
                      />

                      {/* Choose button positioned inside the right of the box */}
                      <label
                        htmlFor="aadhaar"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Choose file
                        </span>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Accepted: JPG, PNG or PDF. Max 5MB.
                    </p>
                  </div>

                  {/* Designation ID Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Upload Designation ID
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-300">
                        <InputFieldSvg
                          d1="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"
                          d2="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                        />
                      </span>
                      <div className="border border-gray-200 rounded-lg pl-10 pr-3 bg-white text-sm text-gray-700 h-11 flex items-center transition-all hover:border-gray-300">
                        {designationID ? (
                          <span className="block truncate font-medium">
                            {designationID.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">No file chosen</span>
                        )}
                      </div>
                      <input
                        id="designation"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          setDesignationID(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        required
                      />

                      {/* Choose button positioned inside the right of the box */}
                      <label
                        htmlFor="designation"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Choose file
                        </span>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Accepted: JPG, PNG or PDF. Max 5MB.
                    </p>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <InputFieldSvg d1="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3m-.75 0h10.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5z" />
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                      <InputFieldSvg d1="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3m-.75 0h10.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5z" />
                    </span>
                    <input
                      className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm transition-all focus:border-[#0A80F5] focus:ring-2 focus:ring-[#0A80F5]/20 focus:outline-none hover:border-gray-300"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? (
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
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-100">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#0A80F5] border-gray-300 rounded focus:ring-[#0A80F5] focus:ring-2 transition-all cursor-pointer"
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <a className="text-[#0A80F5] hover:underline font-semibold transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="text-[#0A80F5] hover:underline font-semibold transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-600 mt-1 ml-1">
                  {errors.agreeToTerms}
                </p>
              )}

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm"
                >
                  <p className="text-sm text-green-800 font-medium flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{successMessage}</span>
                  </p>
                </motion.div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm"
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
                    <span>{errors.submit}</span>
                  </p>
                </motion.div>
              )}

              <div className="mt-6">
                <Button
                  text={isLoading ? "Registering..." : "Create Account"}
                  handleSubmit={handleSubmit}
                  disabled={isLoading}
                />
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-[#0A80F5] hover:text-[#0BCCEB] font-semibold transition-colors"
                >
                  Sign in here →
                </Link>
              </p>
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

export default SignUpPage;
