import { useState } from "react";
import React from "react";
import { BaseUrl } from "../../utils/constants";
import axios from "axios";

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!regex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    try {
      await axios.post(BaseUrl + "/delete-request", {
        email,
        reason
      });
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please email us at support@presentme.in");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-slideUp">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto animate-scaleIn">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-3">
            Deletion Request Submitted
          </h2>
          
          <p className="text-slate-600 text-center leading-relaxed mb-4">
            We've received your request. Your account and all associated data will be permanently deleted within <strong className="text-red-500">30 days</strong>.
          </p>
          
          <div className="bg-green-50 p-3 rounded-xl text-center mb-6">
            <p className="text-xs text-green-700 mb-1">Confirmation email sent to</p>
            <strong className="text-slate-900 text-sm">{email}</strong>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-semibold text-slate-700">What happens next?</span>
            </div>
            <ul className="space-y-2 pl-2">
              <li className="text-sm text-slate-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Confirmation email sent to your inbox</span>
              </li>
              <li className="text-sm text-slate-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Account will be scheduled for deletion</span>
              </li>
              <li className="text-sm text-slate-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>You'll receive a final confirmation once deleted</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen  flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12209 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27066 5.18807L8 6M14 10V16M10 10V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Delete Account
            </h1>
            <p className="text-slate-600 text-sm">
              This action is <span className="text-red-500 font-bold">permanent and cannot be undone</span>
            </p>
          </div>

          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-3 flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-semibold text-red-800">All your data will be permanently deleted</span>
          </div>

          {/* What gets deleted */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Data that will be permanently deleted:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { 
                  icon: (props) => (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  ),
                  text: "Profile information" 
                },
                { 
                  icon: (props) => (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12V16M12 12L10 14M12 12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  text: "Attendance records" 
                },
                { 
                  icon: (props) => (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20M7 6V4M17 6V4M6 10H18M7 14H10M14 14H17M6 18H10M14 18H17M5 20H19C20.1046 20 21 19.1046 21 18V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V18C3 19.1046 3.89543 20 5 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  text: "Uploaded notes & PYQs" 
                },
                { 
                  icon: (props) => (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.0425C10.3516 4.56336 8.0704 3.5 5.5 3.5C4.85201 3.5 4.22101 3.5665 3.613 3.694C3.22417 3.77884 2.88896 4.02224 2.68887 4.36562C2.48878 4.70899 2.44148 5.11994 2.556 5.5L2.557 5.502M12 6.0425C13.6484 4.56336 15.9296 3.5 18.5 3.5C19.148 3.5 19.779 3.5665 20.387 3.694C20.7758 3.77884 21.111 4.02224 21.3111 4.36562C21.5112 4.70899 21.5585 5.11994 21.444 5.5L21.443 5.502M12 6.0425V20M12 20H5.5C4.39543 20 3.5 19.1046 3.5 18V8.5C3.5 7.39543 4.39543 6.5 5.5 6.5H18.5C19.6046 6.5 20.5 7.39543 20.5 8.5V18C20.5 19.1046 19.6046 20 18.5 20H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  text: "Class history & enrollments" 
                },
                { 
                  icon: (props) => (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  text: "All account credentials" 
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl">
                  <item.icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-slate-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Registered Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 outline-none transition-all text-sm font-sans
                    ${emailError 
                      ? 'border-red-500 bg-red-50 focus:border-red-600' 
                      : 'border-slate-200 bg-slate-50 focus:border-purple-500'
                    }`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Reason for leaving (optional)
              </label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 outline-none transition-all text-sm font-sans appearance-none cursor-pointer focus:border-purple-500"
                >
                  <option value="">Select a reason</option>
                  <option value="no_longer_using">No longer using the app</option>
                  <option value="privacy_concerns">Privacy concerns</option>
                  <option value="switching_institution">Switching institution</option>
                  <option value="found_better">Found a better alternative</option>
                  <option value="technical_issues">Technical issues</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all mt-2
                ${loading 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-200'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                "Request Account Deletion"
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-slate-200">
            <span className="text-xs text-slate-500">Need help? </span>
            <a href="mailto:support@presentme.in" className="text-xs text-purple-600 font-semibold hover:text-purple-700 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14M12 17H12.01M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              Confirm Account Deletion
            </h3>
            <p className="text-slate-600 text-center text-sm mb-6">
              Are you sure you want to delete your account? This action is <strong>irreversible</strong> and all your data will be permanently lost.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations to global styles */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}