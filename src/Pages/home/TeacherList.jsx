import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { BaseUrl } from '../../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { setPendingTeacher, setVerifiedTeacher } from '../../utils/teacherSlice'

const TeacherCardApproved = ({ t, onView }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {/* ✅ Use profilePicUrl if available, else initials */}
        {t.profilePicUrl
          ? <img src={t.profilePicUrl} alt={t.firstName} className="w-10 h-10 rounded-full object-cover" />
          : <div className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center font-semibold">{t.firstName?.[0]}{t.lastName?.[0]}</div>
        }
        <div>
          <div className="font-medium">{t.firstName} {t.lastName}</div>
          {/* ✅ API uses "department" */}
          <div className="text-sm text-gray-500">{t.department}</div>
        </div>
      </div>
      <div className="text-sm text-green-600">Active</div>
    </div>

    <div className="mt-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
          <path d="M3 8l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* ✅ API uses "emailId" */}
        {t.emailId}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.78 3.03a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.4 1.98.66 3.03.78A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.phone}
      </div>
    </div>

    <div className="mt-4">
      {/* ✅ API has specialization + qualification instead of classes */}
      <div className="mt-2 flex flex-wrap">
        {t.specialization && <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">{t.specialization}</span>}
        {t.qualification && <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">{t.qualification}</span>}
        {t.experience && <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">{t.experience} yrs exp</span>}
      </div>
      {/* ✅ API uses "createdAt" */}
      <div className="text-xs text-gray-400 mt-3">Joined: {t.createdAt?.slice(0, 10)}</div>
    </div>

    <div className="mt-6 flex gap-3">
      <button onClick={() => onView && onView(t)} className="flex-1 border border-gray-200 rounded-md py-2 text-sm">View</button>
      <button className="flex-1 border border-gray-200 rounded-md py-2 text-sm">Chat</button>
    </div>
  </div>
)
const TeacherCardPending = ({ t, onView, onApprove, onReject }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">
          {t.profilePicUrl
          ? <img src={t.profilePicUrl} alt={t.firstName} className="w-10 h-10 rounded-full object-cover" />
          : <div className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center font-semibold">{t.firstName?.[0]}{t.lastName?.[0]}</div>
        }
        </div>
        <div>
          <div className="font-medium">{t.firstName ? `${t.firstName} ${t.lastName}` : t.name}</div>
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
        {t.specialization && <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">{t.specialization}</span>}
        {t.qualification && <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">{t.qualification}</span>}
        {t.experience && <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">{t.experience} yrs exp</span>}
      </div>
      </div>
      <div className="text-xs text-gray-400 mt-3">Joined: {t.applicationDate || t.createdAt?.slice(0, 10)}</div>
    </div>

    <div className="mt-6 flex gap-3">
      <button
        onClick={() => onApprove && onApprove(t)}
        className="flex-1 bg-green-600 text-white rounded-md py-2 text-sm"
      >
        Approve
      </button>
      <button
        onClick={() => onReject && onReject(t)}
        className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm"
      >
        Reject
      </button>
    </div>
  </div>
)

const TeacherList = () => {
  const [tab, setTab] = useState('approved')
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [query, setQuery] = useState('')


  // ✅ Read from Redux store
  const pendingTeachers = useSelector((store) => store.teacher.pendingTeachers) || []
  const verifiedTeachers = useSelector((store) => store.teacher.verifiedTeachers) || []


  const handleApprove = async (teacher) => {
    try {
      await axios.post(
        BaseUrl + `/admin/approveTeacher/${teacher.teacherId}`,
        {},
        { withCredentials: true }
      )
    } catch (error) {
      console.error('Error approving teacher:', error)
    }
  }

  const handleReject = async (teacher) => {
    try {
      await axios.post(
        BaseUrl + `/admin/rejectTeacher/${teacher.teacherId}`,
        {},
        { withCredentials: true }
      )
    } catch (error) {
      console.error('Error rejecting teacher:', error)
    }
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedTeacher(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ✅ Filter by search query — using actual API field names
  const filteredVerified = verifiedTeachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    (t.emailId || '').toLowerCase().includes(query.toLowerCase()) ||
    (t.department || '').toLowerCase().includes(query.toLowerCase())
  )

  const filteredPending = pendingTeachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    (t.emailId || '').toLowerCase().includes(query.toLowerCase()) ||
    (t.department || '').toLowerCase().includes(query.toLowerCase())
  )

  const openTeacher = (t) => setSelectedTeacher(t)
  const closeTeacher = () => setSelectedTeacher(null)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Teachers Management</h2>
      </div>

      <p className="text-gray-500 mb-4">Manage teacher accounts and approve new applications</p>

      <div className="max-w-xl">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search teachers..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setTab('approved')}
          className={`px-4 py-2 rounded-full ${tab === 'approved' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-[#f8fafc] text-gray-600'}`}
        >
          Approved Teachers ({filteredVerified.length})
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-full ${tab === 'pending' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-[#f8fafc] text-gray-600'}`}
        >
          Pending Approval ({filteredPending.length})
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ✅ Show only the active tab's data */}
        {tab === 'approved' && filteredVerified.map(t => (
          <TeacherCardApproved key={t.teacherId} t={t} onView={openTeacher} />
        ))}

        {tab === 'pending' && filteredPending.map(t => (
          <TeacherCardPending
            key={t.teacherId}
            t={t}
            onView={openTeacher}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}

        {/* Empty states */}
        {tab === 'approved' && filteredVerified.length === 0 && (
          <div className="col-span-3 text-center text-gray-400 py-12">No approved teachers found.</div>
        )}
        {tab === 'pending' && filteredPending.length === 0 && (
          <div className="col-span-3 text-center text-gray-400 py-12">No pending applications found.</div>
        )}
      </div>

      {/* Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeTeacher} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-[90%] md:w-[540px] bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedTeacher.firstName
                    ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}`
                    : selectedTeacher.name}
                </h3>
                <div className="text-xs text-gray-500">Teacher Details</div>
              </div>
              <button onClick={closeTeacher} className="text-gray-500 bg-gray-100 rounded-full p-1.5 hover:bg-gray-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              {selectedTeacher.profilePicUrl && (
                <div className="mb-4 flex justify-center">
                  <img src={selectedTeacher.profilePicUrl} alt={selectedTeacher.firstName} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" />
                </div>
              )}
              <div className="mb-3"><span className="font-medium">Department:</span><div>{selectedTeacher.department || '—'}</div></div>
              <div className="mb-3"><span className="font-medium">Email:</span><div>{selectedTeacher.emailId}</div></div>
              <div className="mb-3"><span className="font-medium">Phone:</span><div>{selectedTeacher.phone}</div></div>
              <div className="mb-3"><span className="font-medium">Employee ID:</span><div>{selectedTeacher.empId || '—'}</div></div>
              <div className="mb-3"><span className="font-medium">Specialization:</span><div>{selectedTeacher.specialization || '—'}</div></div>
              <div className="mb-3"><span className="font-medium">Qualification:</span><div>{selectedTeacher.qualification || '—'}</div></div>
              <div className="mb-3"><span className="font-medium">Experience:</span><div>{selectedTeacher.experience ? `${selectedTeacher.experience} years` : '—'}</div></div>
              <div className="mb-3"><span className="font-medium">Office Location:</span><div>{selectedTeacher.officeLocation || '—'}</div></div>
              <div className="mb-3"><span className="font-medium">Hotspot:</span><div>{selectedTeacher.hotspotName || '—'}</div></div>
              <div className="mb-3"><span className="font-medium">Joined:</span><div>{selectedTeacher.createdAt?.slice(0, 10)}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherList