import React, { useState } from "react";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!email) return alert('Please enter an email')
    setSent(true)
  }

  const tryAnother = () => {
    setSent(false)
    setEmail("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#0BCCEB]/10 to-[#0A80F5]/10 p-6">
      <div className="max-w-md w-full text-center mb-6">
        <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] flex items-center justify-center text-white text-2xl mb-4">
          🔑
        </div>
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email to receive reset instructions
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="mb-4">
          <div className="text-sm font-medium">Forgot Password</div>
          <div className="text-xs text-gray-500">
            We'll send you instructions to reset your password
          </div>
        </div>

        {!sent ? (
          <>
            <div className="mt-4">
              <label className="text-xs text-gray-500 block mb-2">Email Address</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="admin@attendanceapp.edu" />
              <div className="text-xs text-gray-400 mt-2">Enter the email address associated with your account</div>
            </div>

            <div className="mt-6">
              <button onClick={handleSend} className="w-full rounded-full py-2 bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white font-medium">Send Reset Instructions</button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-green-700">
              <div className="font-medium">Reset instructions have been sent to</div>
              <div className="mt-2 font-semibold">{email}</div>
            </div>

            <div className="text-sm text-gray-700">
              We've sent you an email with instructions to reset your password.
            </div>

            <div className="text-sm text-gray-600">
              If you don't see the email:
              <ul className="list-disc list-inside mt-2 text-gray-500">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <div className="mt-4">
              <button onClick={tryAnother} className="w-full rounded-md border border-gray-200 py-2">Try Another Email</button>
            </div>
          </div>
        )}

        <div className="mt-8 border-t text-center  pt-4 text-sm text-gray-500">
          <a href="#" className="inline-flex items-center gap-4 ">
            ← Back to Sign In
          </a>
          <div className="mt-3 text-center">
            Need help? <a href="#" className="text-[#0BCCEB]">Contact Support</a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        <div>© 2024 Present-Me All rights reserved.</div>
        <div className="mt-2 flex gap-3 justify-center">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
