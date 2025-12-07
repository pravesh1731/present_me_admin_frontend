import React, { useEffect } from "react";
import { InputFieldSvg } from "../../components/common/svg/svg";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((store) => store.user);

  
  return (
    <section className="space-y-6 ">
      <div className="rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white p-8 shadow-md">
        <h2 className="text-2xl font-semibold">Welcome back, {user.firstName + " " + "(" + user.InstitutionName + ")"}</h2>
        <p className="mt-1">
          Here's what's happening with your attendance system today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Teachers</div>
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl text-white">
              <InputFieldSvg d1="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold">24</div>
          <div className="text-xs text-gray-400 mt-1">3 pending approval</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Students</div>
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl text-white">
              <InputFieldSvg d1="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold">486</div>
          <div className="text-xs text-gray-400 mt-1">Across 12 classes</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Pending Approvals</div>
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl text-white">
              <InputFieldSvg d1="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold">3</div>
          <div className="text-xs text-gray-400 mt-1">Teacher applications</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Today's Attendance</div>
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-user-check-icon lucide-user-check"
              >
                <path d="m16 11 2 2 4-4" />
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold">92%</div>
          <div className="text-xs text-gray-400 mt-1">
            447 out of 486 students
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-gray-500">
          Latest updates from your attendance system
        </p>

        <ul className="mt-4 space-y-3">
          <li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium">New teacher application</div>
                <div className="text-xs text-gray-500">Sarah Johnson</div>
              </div>
            </div>
            <div className="text-xs text-yellow-600">2 hours ago</div>
          </li>

          <li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">✅</div>
              <div>
                <div className="font-medium">Attendance submitted</div>
                <div className="text-xs text-gray-500">
                  Math Class - Grade 10
                </div>
              </div>
            </div>
            <div className="text-xs text-green-600">3 hours ago</div>
          </li>

          <li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">✅</div>
              <div>
                <div className="font-medium">Teacher approved</div>
                <div className="text-xs text-gray-500">Michael Chen</div>
              </div>
            </div>
            <div className="text-xs text-green-600">5 hours ago</div>
          </li>

          <li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">✅</div>
              <div>
                <div className="font-medium">New Message received</div>
                <div className="text-xs text-gray-500">English Department</div>
              </div>
            </div>
            <div className="text-xs text-green-600">1 Day ago</div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Dashboard;
