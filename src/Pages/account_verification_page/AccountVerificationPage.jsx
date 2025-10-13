import React from "react";

const AccountVerificationPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-white via-[#0BCCEB]/10 to-[#0A80F5]/10 p-6">
      <div className="max-w-2xl w-full text-center mt-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-white text-2xl shadow-md">
          ⏱️
        </div>
        <h1 className="text-3xl font-bold mt-6">
          Account Pending Verification
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Your request has been sent successfully
        </p>

        <div className="mt-8 bg-white rounded-xl shadow-md text-left">
          <div className="bg-yellow-50 p-4 rounded-t-lg">
            <div className="font-medium">Registration Submitted</div>
            <div className="text-xs text-gray-500">
              Please be patient while we verify your account
            </div>
          </div>

          <div className="p-10 space-y-6  ">
            <div className="p-4 rounded-lg border border-gray-100 bg-green-50 text-green-700">
              Your account request has been successfully submitted and is under
              review.
            </div>

            <div className="grid gap-6">
              <div className="p-6 rounded-lg border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#6b46c1] flex items-center justify-center text-white">
                  ✉️
                </div>
                <div>
                  <div className="font-medium">Confirmation Email Sent</div>
                  <div className="text-sm text-gray-500">
                    We've sent a confirmation to{" "}
                    <span className="font-medium">sd@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                  ⏱️
                </div>
                <div>
                  <div className="font-medium">Verification in Progress</div>
                  <div className="text-sm text-gray-500">
                    Your account is currently under verification. This process
                    typically takes 24-48 hours.
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white">
                  🔒
                </div>
                <div>
                  <div className="font-medium">We Will Contact You Soon</div>
                  <div className="text-sm text-gray-500">
                    Once your account is verified, you'll receive an email
                    notification with login instructions.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium">What happens next?</h4>
              <ol className="mt-3 list-decimal list-inside text-sm text-gray-600 space-y-2">
                <li>
                  Our admin team will review your application and verify your
                  credentials
                </li>
                <li>
                  You'll receive an email notification once your account is
                  approved
                </li>
                <li>
                  Use your credentials to log in and start using the
                  AttendanceApp admin panel
                </li>
              </ol>
            </div>

            <div className="mt-6">
              <button className="w-full rounded-lg py-2 bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] text-white">
                ← Back to Login
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              Need help or have questions?{" "}
              <a href="#" className="text-[#7c4dff]">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-8 text-gray-500 text-small">
        @ 2024 Present-Me. AllRights reserved
      </p>
    </div>
  );
};

export default AccountVerificationPage;
