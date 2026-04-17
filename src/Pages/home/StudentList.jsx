import axios from "axios";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setStudents } from "../../utils/studentSlice";

const StudentCard = ({ s, onView }) => (
  <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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

// Class Card Component for Student View
const StudentClassCard = ({ classData, type }) => {
  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg">{classData.className}</h3>
            {type === "active" ? (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</span>
            ) : (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Inactive</span>
            )}
          </div>
          <p className="text-sm text-blue-600 mt-1 font-medium">
            Code: {classData.classCode}
          </p>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 13v6l7 3 7-3v-6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Room: {classData.roomNo}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Teacher: {classData.teacherName}
          </p>
          
          {classData.classDays && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {classData.classDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ")}
            </p>
          )}
          
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">Attendance</span>
              <span className={`font-semibold ${getAttendanceColor(classData.attendanceSummary.percentage)}`}>
                {classData.attendanceSummary.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 rounded-full h-2 transition-all"
                style={{ width: `${classData.attendanceSummary.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {classData.attendanceSummary.present} / {classData.attendanceSummary.totalClasses} classes attended
            </p>
          </div>

          {/* Attendance Records Dropdown */}
          <details className="mt-3">
            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
              View Attendance Records
            </summary>
            <div className="mt-2 space-y-1">
              {classData.attendanceRecords.map((record, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1 border-b border-gray-100">
                  <span className="text-gray-500">{record.date}</span>
                  <span className={record.status === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {record.status === 1 ? "Present" : "Absent"}
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

// Student Details Modal with Tabs
const StudentDetailsModal = ({ student, onClose }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [classSubTab, setClassSubTab] = useState("active");
  const [studentClasses, setStudentClasses] = useState({ active: [], inactive: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentClasses();
  }, [student]);

  const fetchStudentClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BaseUrl}/admin/students/${student.studentId}/classes`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        const classes = response.data.data || [];
        
        // Separate active and inactive classes based on isActive flag
        const active = classes.filter(cls => cls.isActive === true);
        const inactive = classes.filter(cls => cls.isActive === false);
        
        setStudentClasses({ active, inactive });
      }
    } catch (error) {
      console.error("Error fetching student classes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-[92%] md:w-[800px] bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {student.profilePicUrl ? (
                <img
                  src={student.profilePicUrl}
                  alt={student.firstName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-xl shadow">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-gray-500">Student ID: {student.studentId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md w-8 h-8 flex items-center justify-center"
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

          {/* Main Tabs */}
          <div className="flex gap-6 mt-4">
            {[
              { id: "personal", label: "Personal Info" },
              { id: "classes", label: "Classes" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-tabs for Classes */}
        {activeTab === "classes" && (
          <div className="sticky top-[152px] bg-gray-50 border-b border-gray-200 px-6 py-2 z-5">
            <div className="flex gap-4">
              <button
                onClick={() => setClassSubTab("active")}
                className={`py-2 px-3 transition-colors text-sm rounded-lg ${
                  classSubTab === "active"
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Classes ({studentClasses.active.length})
              </button>
              <button
                onClick={() => setClassSubTab("inactive")}
                className={`py-2 px-3 transition-colors text-sm rounded-lg ${
                  classSubTab === "inactive"
                    ? "bg-red-100 text-red-700 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Inactive Classes ({studentClasses.inactive.length})
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Full Name</label>
                  <p className="mt-1 text-gray-900">{student.firstName} {student.lastName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Student ID</label>
                  <p className="mt-1 text-gray-900">{student.studentId}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Email Address</label>
                  <p className="mt-1 text-gray-900">{student.emailId}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Phone Number</label>
                  <p className="mt-1 text-gray-900">{student.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Roll Number</label>
                  <p className="mt-1 text-gray-900">{student.rollNo}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Joined Date</label>
                  <p className="mt-1 text-gray-900">{new Date(student.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "classes" && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading classes...</p>
                </div>
              ) : (
                <>
                  {classSubTab === "active" && (
                    <>
                      {studentClasses.active.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No active classes found</div>
                      ) : (
                        <div className="grid gap-4">
                          {studentClasses.active.map((cls) => (
                            <StudentClassCard key={cls.classCode} classData={cls} type="active" />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {classSubTab === "inactive" && (
                    <>
                      {studentClasses.inactive.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No inactive classes found</div>
                      ) : (
                        <div className="grid gap-4">
                          {studentClasses.inactive.map((cls) => (
                            <StudentClassCard key={cls.classCode} classData={cls} type="inactive" />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentList = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name" or "date"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [viewing, setViewing] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  
  const studentList = useSelector((store) => store.student) || [];

  // Filter students based on search query
  const filtered = studentList.filter((s) => {
    const matchesQuery =
      s.firstName.toLowerCase().includes(query.toLowerCase()) ||
      s.lastName.toLowerCase().includes(query.toLowerCase()) ||
      s.studentId.toLowerCase().includes(query.toLowerCase()) ||
      s.emailId.toLowerCase().includes(query.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(query.toLowerCase());

    return matchesQuery;
  });

  // Sort students based on selected criteria
  const sortedStudents = [...filtered].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === "name") {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      comparison = nameA.localeCompare(nameB);
    } else if (sortBy === "date") {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "rollNo") {
      comparison = a.rollNo.localeCompare(b.rollNo);
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const openView = (s) => setViewing(s);
  const closeView = () => setViewing(null);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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
            placeholder="Search students by name, ID, email, or roll number..."
            className="w-full md:w-2/3 rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition">
            Export
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="name">Name</option>
            <option value="rollNo">Roll Number</option>
            <option value="date">Join Date</option>
          </select>
        </div>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          {sortOrder === "asc" ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M8 9l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Ascending
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M8 15l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Descending
            </>
          )}
        </button>
        <div className="text-sm text-gray-500 ml-auto">
          Showing {sortedStudents.length} of {studentList.length} students
        </div>
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 rounded-full text-sm transition ${
              viewMode === "grid"
                ? "bg-white border border-gray-200 shadow-sm"
                : "bg-[#f8fafc] text-gray-600 hover:bg-gray-100"
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 rounded-full text-sm transition ${
              viewMode === "list"
                ? "bg-white border border-gray-200 shadow-sm"
                : "bg-[#f8fafc] text-gray-600 hover:bg-gray-100"
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStudents.map((s) => (
            <StudentCard key={s.studentId} s={s} onView={openView} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-medium mb-4">Students List</h3>
          <div className="space-y-3">
            {sortedStudents.map((s) => (
              <div key={s.studentId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
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
                      {s.studentId} • {s.emailId} • Roll: {s.rollNo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
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
                      className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition"
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
        <StudentDetailsModal student={viewing} onClose={closeView} />
      )}
    </section>
  );
};

export default StudentList;