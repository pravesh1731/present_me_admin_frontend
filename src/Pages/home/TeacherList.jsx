import axios from "axios";
import React, { useState, useEffect } from "react";
import { BaseUrl } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setPendingTeacher, setVerifiedTeacher } from "../../utils/teacherSlice";


// TeacherCardApproved Component
const TeacherCardApproved = ({ t, onView }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {t.profilePicUrl ? (
          <img
            src={t.profilePicUrl}
            alt={t.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center font-semibold">
            {t.firstName?.[0]}
            {t.lastName?.[0]}
          </div>
        )}
        <div>
          <div className="font-medium">
            {t.firstName} {t.lastName}
          </div>
          <div className="text-sm text-gray-500">{t.department}</div>
        </div>
      </div>
      <div className="text-sm text-green-600">Active</div>
    </div>

    <div className="mt-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 8l8 5 8-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t.emailId}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.78 3.03a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.4 1.98.66 3.03.78A2 2 0 0 1 22 16.92z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t.phone}
      </div>
    </div>

    <div className="mt-4">
      <div className="mt-2 flex flex-wrap">
        {t.specialization && (
          <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">
            {t.specialization}
          </span>
        )}
        {t.qualification && (
          <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">
            {t.qualification}
          </span>
        )}
        {t.experience && (
          <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">
            {t.experience} yrs exp
          </span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-3">
        Joined: {t.createdAt?.slice(0, 10)}
      </div>
    </div>

    <div className="mt-6 flex gap-3">
      <button
        onClick={() => onView && onView(t)}
        className="flex-1 border border-gray-200 rounded-md py-2 text-sm"
      >
        View
      </button>
      <button className="flex-1 border border-gray-200 rounded-md py-2 text-sm">
        Chat
      </button>
    </div>
  </div>
);

// TeacherCardPending Component
const TeacherCardPending = ({ t, onView, onApprove, onReject, loadingId, actionType }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">
          {t.profilePicUrl ? (
            <img
              src={t.profilePicUrl}
              alt={t.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center font-semibold">
              {t.firstName?.[0]}
              {t.lastName?.[0]}
            </div>
          )}
        </div>
        <div>
          <div className="font-medium">
            {t.firstName ? `${t.firstName} ${t.lastName}` : t.name}
          </div>
          <div className="text-sm text-gray-500">{t.department}</div>
        </div>
      </div>
      <div className="text-sm text-yellow-600">Pending</div>
    </div>

    <div className="mt-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">{t.emailId || t.email}</div>
      <div className="flex items-center gap-2 mt-2">{t.phone}</div>
    </div>

    <div className="mt-4">
      <div className="text-xs text-gray-500"></div>
      <div className="mt-2 flex flex-wrap">
        <div className="mt-2 flex flex-wrap">
          {t.specialization && (
            <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">
              {t.specialization}
            </span>
          )}
          {t.qualification && (
            <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">
              {t.qualification}
            </span>
          )}
          {t.experience && (
            <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">
              {t.experience} yrs exp
            </span>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-3">
        Joined: {t.applicationDate || t.createdAt?.slice(0, 10)}
      </div>
    </div>

    <div className="mt-6 flex gap-3">
      <button
        onClick={() => onApprove(t)}
        disabled={loadingId === t.teacherId}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        {loadingId === t.teacherId && actionType === "approve"
          ? "Approving..."
          : "Approve"}
      </button>
      <button
        onClick={() => onReject && onReject(t)}
        disabled={loadingId === t.teacherId}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        {loadingId === t.teacherId && actionType === "reject"
          ? "Rejecting..."
          : "Reject"}
      </button>
    </div>
  </div>
);


const MOCK_TODAY_CLASSES = [
  {
    classId: "1",
    className: "Mathematics 101",
    subject: "Mathematics",
    schedule: { time: "10:00 AM - 11:30 AM", room: "Room 201" },
    studentCount: 25,
    status: "upcoming"
  },
  {
    classId: "2",
    className: "Physics Fundamentals",
    subject: "Physics",
    schedule: { time: "2:00 PM - 3:30 PM", room: "Lab 3" },
    studentCount: 18,
    status: "upcoming"
  }
];


// Teacher Details View Component
// Teacher Details View Component
const TeacherDetailsView = ({ teacher, onBack, onViewClassStudents }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [classSubTab, setClassSubTab] = useState("active"); // "active" or "inactive"
  const [classes, setClasses] = useState([]);
  const [todayClasses, setTodayClasses] = useState(MOCK_TODAY_CLASSES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      fetchTeacherClasses();
    }
  }, [teacher]);

  const fetchTeacherClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BaseUrl}/admin/teachers/${teacher.teacherId}/classes`,
        { withCredentials: true }
      );
      setClasses(response.data.data.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter classes based on active status
  const activeClasses = classes.filter(cls => cls.isActive === true);
  const inactiveClasses = classes.filter(cls => cls.isActive === false);

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Header with back button */}
      <div className="border-b border-gray-200 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Teachers List
        </button>
        
        <div className="flex items-center gap-4">
          {teacher.profilePicUrl ? (
            <img
              src={teacher.profilePicUrl}
              alt={teacher.firstName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-semibold">
              {teacher.firstName?.[0]}{teacher.lastName?.[0]}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold">
              {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-gray-500">{teacher.department}</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {[
            { id: "profile", label: "Profile" },
            { id: "all-classes", label: "All Classes" },
            { id: "today-classes", label: "Today's Classes" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 transition-colors ${
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

      {/* Sub-tabs for All Classes */}
      {activeTab === "all-classes" && (
        <div className="border-b border-gray-200 px-6 bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={() => setClassSubTab("active")}
              className={`py-2 px-3 transition-colors text-sm ${
                classSubTab === "active"
                  ? "border-b-2 border-green-500 text-green-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Active Classes ({activeClasses.length})
            </button>
            <button
              onClick={() => setClassSubTab("inactive")}
              className={`py-2 px-3 transition-colors text-sm ${
                classSubTab === "inactive"
                  ? "border-b-2 border-red-500 text-red-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inactive Classes ({inactiveClasses.length})
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Email:</span> {teacher.emailId}</p>
                  <p><span className="text-gray-500">Phone:</span> {teacher.phone}</p>
                  <p><span className="text-gray-500">Employee ID:</span> {teacher.empId || "—"}</p>
                  <p><span className="text-gray-500">Joined:</span> {teacher.createdAt?.slice(0, 10)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Professional Information
                </h3>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Department:</span> {teacher.department || "—"}</p>
                  <p><span className="text-gray-500">Specialization:</span> {teacher.specialization || "—"}</p>
                  <p><span className="text-gray-500">Qualification:</span> {teacher.qualification || "—"}</p>
                  <p><span className="text-gray-500">Experience:</span> {teacher.experience ? `${teacher.experience} years` : "—"}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Location
              </h3>
              <p><span className="text-gray-500">Office Location:</span> {teacher.officeLocation || "—"}</p>
              <p><span className="text-gray-500">Hotspot:</span> {teacher.hotspotName || "—"}</p>
            </div>
          </div>
        )}

        {activeTab === "all-classes" && (
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
                    {activeClasses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No active classes found</div>
                    ) : (
                      <div className="grid gap-4">
                        {activeClasses.map((cls) => (
                          <ClassCard 
                            key={cls.classId} 
                            classData={cls} 
                            onViewStudents={() => onViewClassStudents(cls, teacher)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {classSubTab === "inactive" && (
                  <>
                    {inactiveClasses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No inactive classes found</div>
                    ) : (
                      <div className="grid gap-4">
                        {inactiveClasses.map((cls) => (
                          <ClassCard 
                            key={cls.classId} 
                            classData={cls} 
                            onViewStudents={() => onViewClassStudents(cls, teacher)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "today-classes" && (
          <div>
            {todayClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No classes scheduled for today</div>
            ) : (
              <div className="grid gap-4">
                {todayClasses.map((cls) => (
                  <ClassCard 
                    key={cls.classId} 
                    classData={cls} 
                    onViewStudents={() => onViewClassStudents(cls, teacher)}
                    isTodayClass={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Class Card Component
const ClassCard = ({ classData, onViewStudents, isTodayClass = false }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{classData.className} {classData.isActive ? <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</span> : <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Inactive</span>}</h3> 
            {isTodayClass && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Today
              </span>
            )}
          </div>
          <p className="text-sm text-blue-600 mt-1 font-medium">
            {classData.classCode}
          </p>
           
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {classData.startTime} - {classData.endTime}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 13v6l7 3 7-3v-6" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {classData.roomNo}
              </span>
            </div>
          
          {classData.createdAt !== undefined && (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {classData.students.length} students enrolled
            </p>
          )}
          {classData.createdAt && (
            <p className="text-xs text-gray-400 mt-2">{new Date(classData.createdAt).toLocaleString()}</p>
          )}
          {classData.classDays && (
            <p className="text-sm text-gray-500  mt-2">
              {classData.classDays.map((day) => day.charAt(0).toUpperCase() + day.slice(1)).join(", ")}
            </p>
          )}
        </div>
        <button
          onClick={onViewStudents}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
          </svg>
          View Students
        </button>
      </div>
    </div>
  );
};

// Students List Component for a Class
const ClassStudentsView = ({ classData, teacher, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchClassStudents();
  }, [classData]);

  const fetchClassStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BaseUrl}/admin/class/${classData.classCode}/students`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setStudents(response.data.data.students);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (student.emailId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (student.rollNo || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesAttendance = true;
    if (attendanceFilter === "good") {
      matchesAttendance = student.attendance.percentage >= 75;
    } else if (attendanceFilter === "poor") {
      matchesAttendance = student.attendance.percentage < 75;
    }
    
    return matchesSearch && matchesAttendance;
  });

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceBadge = (percentage) => {
    if (percentage >= 75) return { text: "Good", color: "bg-green-100 text-green-800" };
    if (percentage >= 50) return { text: "Average", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Poor", color: "bg-red-100 text-red-800" };
  };

  // Use statistics from API if available, otherwise calculate
  const stats = statistics || {
    total: students.length,
    goodAttendance: students.filter(s => s.attendance?.percentage >= 75).length,
    averageAttendance: students.filter(s => s.attendance?.percentage >= 50 && s.attendance?.percentage < 75).length,
    poorAttendance: students.filter(s => s.attendance?.percentage < 50).length
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="border-b border-gray-200 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to {teacher.firstName} {teacher.lastName}'s Classes
        </button>
        
        <div>
          <h2 className="text-2xl font-semibold">{classData.className || classData.name}</h2>
          <p className="text-gray-500 mt-1">{classData.subject || classData.subjectName}</p>
          <p className="text-sm text-gray-500 mt-2">
            Teacher: {teacher.firstName} {teacher.lastName}
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600">Total Students</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalStudents}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600">Good Attendance (&gt;75%)</p>
            <p className="text-2xl font-bold text-green-700">{stats.goodAttendance}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600">Average Attendance (50-75%)</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.averageAttendance}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-600">Poor Attendance (&lt;50%)</p>
            <p className="text-2xl font-bold text-red-700">{stats.poorAttendance}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, email or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Students</option>
            <option value="good">Good Attendance (&gt;75%)</option>
            <option value="poor">Poor Attendance (≤75%)</option>
          </select>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No students found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const badge = getAttendanceBadge(student.attendance.percentage);
                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {student.profilePicUrl ? (
                            <img
                              src={student.profilePicUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">{student.name?.[0]}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.emailId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 rounded-full h-2 transition-all"
                              style={{ width: `${student.attendance.percentage}%` }}
                            />
                          </div>
                          <span className={`font-semibold ${getAttendanceColor(student.attendance.percentage)}`}>
                            {student.attendance.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Main TeacherList Component
const TeacherList = () => {
  const [tab, setTab] = useState("approved");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const dispatch = useDispatch();

  // Read from Redux store
  const pendingTeachers =
    useSelector((store) => store.teacher.pendingTeachers) || [];
  const verifiedTeachers =
    useSelector((store) => store.teacher.verifiedTeachers) || [];

  const handleApprove = async (teacher) => {
    try {
      setLoadingId(teacher.teacherId);
      setActionType("approve");

      await axios.patch(
        BaseUrl + `/admin/institutes/teachers/${teacher.teacherId}/status`,
        { status: "verified" },
        { withCredentials: true },
      );
      dispatch(setPendingTeacher(
        pendingTeachers.filter(t => t.teacherId !== teacher.teacherId)
      ));
      dispatch(setVerifiedTeacher([
        ...verifiedTeachers,
        teacher
      ]));
    } catch (error) {
      console.error("Error approving teacher:", error);
    } finally {
      setLoadingId(null);
      setActionType(null);
    }
  };

  const handleReject = async (teacher) => {
    try {
      setLoadingId(teacher.teacherId);
      setActionType("reject");

      await axios.patch(
        BaseUrl + `/admin/institutes/teachers/${teacher.teacherId}/status`,
        { status: "rejected" },
        { withCredentials: true },
      );
      dispatch(setPendingTeacher(
        pendingTeachers.filter(t => t.teacherId !== teacher.teacherId)
      ));
    } catch (error) {
      console.error("Error rejecting teacher:", error);
    } finally {
      setLoadingId(null);
      setActionType(null);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (viewMode !== "list") {
          setViewMode("list");
          setSelectedClass(null);
          setSelectedTeacher(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewMode]);

  // Filter by search query
  const filteredVerified = verifiedTeachers.filter(
    (t) =>
      `${t.firstName} ${t.lastName}`
        .toLowerCase()
        .includes(query.toLowerCase()) ||
      (t.emailId || "").toLowerCase().includes(query.toLowerCase()) ||
      (t.department || "").toLowerCase().includes(query.toLowerCase()),
  );

  const filteredPending = pendingTeachers.filter(
    (t) =>
      `${t.firstName} ${t.lastName}`
        .toLowerCase()
        .includes(query.toLowerCase()) ||
      (t.emailId || "").toLowerCase().includes(query.toLowerCase()) ||
      (t.department || "").toLowerCase().includes(query.toLowerCase()),
  );

  const openTeacher = (t) => {
    setSelectedTeacher(t);
    setViewMode("details");
  };
  
  const closeTeacher = () => {
    setViewMode("list");
    setSelectedTeacher(null);
    setSelectedClass(null);
  };

  const handleViewClassStudents = (classData, teacher) => {
    setSelectedClass(classData);
    setSelectedTeacher(teacher);
    setViewMode("students");
  };

  // Render based on viewMode
  const renderContent = () => {
    if (viewMode === "details" && selectedTeacher) {
      return (
        <TeacherDetailsView
          teacher={selectedTeacher}
          onBack={closeTeacher}
          onViewClassStudents={handleViewClassStudents}
        />
      );
    }
    
    if (viewMode === "students" && selectedClass && selectedTeacher) {
      return (
        <ClassStudentsView
          classData={selectedClass}
          teacher={selectedTeacher}
          onBack={() => setViewMode("details")}
        />
      );
    }
    
    // Default list view
    return (
      <>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold">Teachers Management</h2>
        </div>

        <p className="text-gray-500 mb-4">
          Manage teacher accounts and approve new applications
        </p>

        <div className="max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teachers..."
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setTab("approved")}
            className={`px-4 py-2 rounded-full transition-all ${tab === "approved" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#f8fafc] text-gray-600 hover:bg-gray-100"}`}
          >
            Approved Teachers ({filteredVerified.length})
          </button>
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-2 rounded-full transition-all ${tab === "pending" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#f8fafc] text-gray-600 hover:bg-gray-100"}`}
          >
            Pending Approval ({filteredPending.length})
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tab === "approved" &&
            filteredVerified.map((t) => (
              <TeacherCardApproved key={t.teacherId} t={t} onView={openTeacher} />
            ))}

          {tab === "pending" &&
            filteredPending.map((t) => (
              <TeacherCardPending
                key={t.teacherId}
                t={t}
                onView={openTeacher}
                onApprove={handleApprove}
                onReject={handleReject}
                loadingId={loadingId}
                actionType={actionType}
              />
            ))}

          {tab === "approved" && filteredVerified.length === 0 && (
            <div className="col-span-3 text-center text-gray-400 py-12">
              No approved teachers found.
            </div>
          )}
          {tab === "pending" && filteredPending.length === 0 && (
            <div className="col-span-3 text-center text-gray-400 py-12">
              No pending applications found.
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {renderContent()}
    </div>
  );
};

export default TeacherList;