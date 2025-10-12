import React, { useState } from "react";

const sampleStudents = [
  {
    id: "STU001",
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    grade: 10,
    className: "Mathematics",
    teacher: "Emily Rodriguez",
    attendance: 95,
    lastAttendance: "2024-01-15",
    status: "active",
  },
  {
    id: "STU002",
    name: "Emma Davis",
    email: "emma.davis@student.edu",
    grade: 11,
    className: "Biology",
    teacher: "Michael Chen",
    attendance: 88,
    lastAttendance: "2024-01-14",
    status: "active",
  },
  {
    id: "STU003",
    name: "Noah Williams",
    email: "noah.williams@student.edu",
    grade: 9,
    className: "English Literature",
    teacher: "Sarah Johnson",
    attendance: 92,
    lastAttendance: "2024-01-16",
    status: "active",
  },
  {
    id: "STU004",
    name: "Olivia Brown",
    email: "olivia.brown@student.edu",
    grade: 12,
    className: "World History",
    teacher: "David Wilson",
    attendance: 78,
    lastAttendance: "2024-01-10",
    status: "warning",
  },
  {
    id: "STU005",
    name: "Liam Garcia",
    email: "liam.garcia@student.edu",
    grade: 10,
    className: "Chemistry",
    teacher: "Michael Chen",
    attendance: 96,
    lastAttendance: "2024-01-16",
    status: "active",
  },
  {
    id: "STU006",
    name: "Sophia Martinez",
    email: "sophia.martinez@student.edu",
    grade: 11,
    className: "Calculus",
    teacher: "Emily Rodriguez",
    attendance: 85,
    lastAttendance: "2024-01-13",
    status: "active",
  },
  {
    id: "STU007",
    name: "Pravesh",
    email: "pravesh@student.edu",
    grade: 11,
    className: "Hindi",
    teacher: "Ravi Kumar",
    attendance: 80,
    lastAttendance: "2024-01-13",
    status: "active",
  },
  {
    id: "STU008",
    name: "Jaanhvi",
    email: "janvi@student.edu",
    grade: 9,
    className: "Python",
    teacher: "Rahul",
    attendance: 95,
    lastAttendance: "2024-01-15",
    status: "active",
  },
  {
    id: "STU009",
    name: "Ram",
    email: "ram@student.edu",
    grade: 8,
    className: "OOPS",
    teacher: "Sunny",
    attendance: 45,
    lastAttendance: "2024-01-20",
    status: "active",
  },
];

const StudentCard = ({ s, onView, onEdit }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c7b9ff] to-[#8bd3ff] flex items-center justify-center text-white font-semibold">
            {s.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-gray-500">ID: {s.id}</div>
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

    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
      <div>Grade:</div>
      <div className="text-right">{s.grade}</div>
      <div>Class:</div>
      <div className="text-right">{s.className}</div>
      <div>Teacher:</div>
      <div className="text-right">{s.teacher}</div>
      <div>Attendance:</div>
      <div
        className={`text-right font-semibold ${
          s.attendance < 80
            ? "text-red-500"
            : s.attendance < 90
            ? "text-yellow-600"
            : "text-green-600"
        }`}
      >
        {s.attendance}%
      </div>
    </div>

    <div className="mt-4 flex gap-3">
      <button
        onClick={() => onView(s)}
        className="flex-1 border border-gray-200 rounded-md py-2 text-sm flex items-center justify-center gap-2"
      >
        {" "}
        <span>👁️</span> View
      </button>
      <button
        onClick={() => onEdit(s)}
        className="flex-1 border border-purple-200 text-purple-700 rounded-md py-2 text-sm"
      >
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

  // build dynamic filter options
  const classes = Array.from(new Set(sampleStudents.map((s) => s.className)));
  const grades = Array.from(new Set(sampleStudents.map((s) => s.grade))).sort(
    (a, b) => a - b
  );

  const filtered = sampleStudents.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase());
    const matchesClass =
      filterClass === "All Classes" || s.className === filterClass;
    const matchesGrade =
      filterGrade === "All Grades" || String(s.grade) === String(filterGrade);
    return matchesQuery && matchesClass && matchesGrade;
  });

  const openView = (s) => setViewing(s);
  const closeView = () => setViewing(null);
  const onEdit = (s) => alert("Edit " + s.name);

  return (
    <section>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-semibold">Students Management</h2>
          <p className="text-gray-500">
            View and manage student records and attendance
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => alert("Add student placeholder")}
            className="ml-2 bg-gradient-to-br from-[#0bcceb] to-[#0a80f5] text-white px-4 py-2 rounded-lg shadow-sm"
          >
          👤+ Add Student
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4 justify-between">
        <div className="flex-1 md:pr-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full md:w-2/3 rounded-lg border border-gray-200 px-4 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2"
          >
            <option>All Classes</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
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
          </select>
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
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    {s.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      {s.id} • Grade {s.grade} • {s.className}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <div
                      className={`text-sm font-semibold ${
                        s.attendance < 80
                          ? "text-red-500"
                          : s.attendance < 90
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {s.attendance}%
                    </div>
                    <div className="text-xs text-gray-500">{s.teacher}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        s.status === "warning"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-green-50 text-green-700"
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
                <h3 className="text-lg font-semibold">{viewing.name}</h3>
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
                <div className="mt-1">{viewing.id}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">Email:</div>
                <div className="mt-1">{viewing.email}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">Grade:</div>
                <div className="mt-1">{viewing.grade}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">Class:</div>
                <div className="mt-1">{viewing.className}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500">Teacher:</div>
                <div className="mt-1">{viewing.teacher}</div>
              </div>
              <div className="mb-3">
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
              </div>
              <div className="mb-1">
                <div className="text-xs text-gray-500">Last Attendance:</div>
                <div className="mt-1">{viewing.lastAttendance}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentList;
