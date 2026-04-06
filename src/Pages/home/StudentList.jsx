import axios from "axios";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setStudents } from "../../utils/studentSlice";

const StudentCard = ({ s, onView }) => (
  <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    {" "}
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          {s.profilePicUrl ? (
            <img
              src={s.profilePicUrl}
              alt={s.firstName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-semibold shadow">
              {(s.firstName || "User")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium">{s.firstName + " " + s.lastName}</div>
            <div className="text-xs text-gray-500">ID: {s.studentId}</div>
          </div>
        </div>
      </div>
      <div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            s.status === "warning"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {s.status === "warning" ? "Low Attendance" : "Active"}
        </span>
      </div>
    </div>
    <div className="mt-4 space-y-2 text-sm text-gray-600">
      <div className="flex justify-between">
        <span className="text-gray-400">Email</span>
        <span className="font-medium">{s.emailId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Phone</span>
        <span>{s.phone}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Roll No</span>
        <span>{s.rollNo}</span>
      </div>
    </div>
    <div className="mt-5 flex gap-3">
      <button
        onClick={() => onView(s)}
        className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm hover:bg-black transition"
      >
        View
      </button>
      <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50 transition">
        Edit
      </button>
    </div>
  </div>
);

const StudentList = () => {
  const [query, setQuery] = useState("");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterGrade, setFilterGrade] = useState("All Grades");
  const [viewing, setViewing] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  

  const studentList = useSelector((store) => store.student) || [];

  // build dynamic filter options
  // const classes = Array.from(new Set(sampleStudents.map((s) => s.className)));
  // const grades = Array.from(new Set(sampleStudents.map((s) => s.grade))).sort(
  //   (a, b) => a - b,
  // );

  const filtered = studentList.filter((s) => {
    const matchesQuery =
      s.firstName.toLowerCase().includes(query.toLowerCase()) ||
      s.studentId.toLowerCase().includes(query.toLowerCase());

    return matchesQuery;
  });

  const openView = (s) => setViewing(s);
  const closeView = () => setViewing(null);
  const onEdit = (s) => alert("Edit " + s.name);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-semibold">Students Management</h2>
          <p className="text-gray-500">
            View and manage student records and attendance
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4 justify-between">
        <div className="flex-1 md:pr-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full md:w-2/3 rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2"
          >
            <option>All Classes</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select> */}
          {/* <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2"
          >
            <option>All Grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select> */}
          <button className="bg-white border border-gray-200 rounded-lg px-3 py-2">
            Export
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 rounded-full text-sm ${
              viewMode === "grid"
                ? "bg-white border border-gray-200"
                : "bg-[#f8fafc]"
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 rounded-full text-sm ${
              viewMode === "list"
                ? "bg-white border border-gray-200"
                : "bg-[#f8fafc]"
            }`}
          >
            List View
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filtered.length} students
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <StudentCard key={s.id} s={s} onView={openView} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-medium">Students List</h3>
          <div className="space-y-3">
            {filtered.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  {s.profilePicUrl ? (
                    <img
                      src={s.profilePicUrl}
                      alt={s.firstName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-semibold shadow">
                      {(s.firstName || "User")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.studentId} • Email {s.emailId} • {s.className}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    {/* <div
                      className={`text-sm font-semibold ${
                        s.attendance < 80
                          ? "text-red-500"
                          : s.attendance < 90
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {s.attendance}%
                    </div> */}
                    <div className="text-xs text-gray-500">{s.teacher}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        s.status === "warning"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {s.status === "warning" ? "Low Attendance" : "Active"}
                    </span>
                    <button
                      onClick={() => openView(s)}
                      className="p-2 rounded-md border border-gray-200"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeView} />

          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-[92%] md:w-[540px] bg-white rounded-xl shadow-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {viewing.firstName + " " + viewing.lastName}
                </h3>
                <div className="text-xs text-gray-500">Student Details</div>
              </div>
              <button
                onClick={closeView}
                className="text-[#6b46c1] border border-[#e9dbff] bg-white rounded-md w-8 h-8 flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <div className="mb-3">
                <div className="text-xs text-gray-500">Student ID:</div>
                <div className="mt-1">{viewing.studentId}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">Email:</div>
                <div className="mt-1">{viewing.emailId}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">Phone:</div>
                <div className="mt-1">{viewing.phone}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">Roll No:</div>
                <div className="mt-1">{viewing.rollNo}</div>
              </div>
              {/* <div className="mb-3">
                <div className="text-xs text-gray-500">Teacher:</div>
                <div className="mt-1">{viewing.teacher}</div>
              </div> */}
              {/* <div className="mb-3">
                <div className="text-xs text-gray-500">Attendance Rate:</div>
                <div
                  className={`mt-1 font-semibold ${
                    viewing.attendance < 80
                      ? "text-red-500"
                      : viewing.attendance < 90
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {viewing.attendance}%
                </div>
              </div> */}
              <div className="mb-1">
                <div className="text-xs text-gray-500">Joined At</div>
                <div className="mt-1">{viewing.createdAt}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentList;
