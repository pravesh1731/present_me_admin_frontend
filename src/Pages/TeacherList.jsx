import React, { useState, useEffect } from 'react'

const approvedTeachers = [
  {
    id: 1,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@school.edu',
    phone: '+1 (555) 123-4567',
    department: 'Mathematics',
    classes: ['Algebra I', 'Geometry', 'Calculus'],
    joinDate: '2023-08-15',
    status: 'active'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@school.edu',
    phone: '+1 (555) 234-5678',
    department: 'Science',
    classes: ['Biology', 'Chemistry'],
    joinDate: '2023-09-01',
    status: 'active'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1 (555) 345-6789',
    department: 'English',
    classes: ['English Literature', 'Creative Writing'],
    joinDate: '2023-07-20',
    status: 'active'
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@school.edu',
    phone: '+1 (555) 456-7890',
    department: 'History',
    classes: ['World History', 'American History'],
    joinDate: '2023-08-30',
    status: 'active'
  }
]

const pendingTeachers = [
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@gmail.com',
    phone: '+1 (555) 567-8901',
    department: 'Art',
    appliedFor: ['Art Fundamentals', 'Digital Design'],
    applicationDate: '2024-01-10',
    status: 'pending'
  },
  {
    id: 6,
    name: 'James Thompson',
    email: 'james.thompson@outlook.com',
    phone: '+1 (555) 678-9012',
    department: 'Physical Education',
    appliedFor: ['PE', 'Health Education'],
    applicationDate: '2024-01-08',
    status: 'pending'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    email: 'maria.garcia@yahoo.com',
    phone: '+1 (555) 789-0123',
    department: 'Spanish',
    appliedFor: ['Spanish I', 'Spanish II'],
    applicationDate: '2024-01-05',
    status: 'pending'
  }
]


const TeacherCardApproved = ({ t, onView }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center font-semibold">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
        <div>
          <div className="font-medium">{t.name}</div>
          <div className="text-sm text-gray-500">{t.department}</div>
        </div>
      </div>
      <div className="text-sm text-green-600">{t.status}</div>
    </div>

    <div className="mt-4 text-sm text-gray-600">
      <div className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M3 8l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>{t.email}</div>
      <div className="flex items-center gap-2 mt-2"><svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.78 3.03a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.4 1.98.66 3.03.78A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>{t.phone}</div>
    </div>

    <div className="mt-4">
      <div className="text-xs text-gray-500">Classes:</div>
      <div className="mt-2 flex flex-wrap">
        {t.classes.map(c => <span key={c} className="bg-[#eef2ff] text-[#4f46e5] text-xs px-3 py-1 rounded-full mr-2 mb-2">{c}</span>)}
      </div>
      <div className="text-xs text-gray-400 mt-3">Joined: {t.joinDate}</div>
    </div>

    <div className="mt-6 flex gap-3">
      <button onClick={() => onView && onView(t)} className="flex-1 border border-gray-200 rounded-md py-2 text-sm">View</button>
      <button className="flex-1 border border-gray-200 rounded-md py-2 text-sm">Chat</button>
    </div>
  </div>
)

const TeacherCardPending = ({ t, onView }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
        <div>
          <div className="font-medium">{t.name}</div>
          <div className="text-sm text-gray-500">{t.department}</div>
        </div>
      </div>
      <div className="text-sm text-yellow-600">Pending</div>
    </div>

    <div className="mt-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">{t.email}</div>
      <div className="flex items-center gap-2 mt-2">{t.phone}</div>
    </div>

    <div className="mt-4">
      <div className="text-xs text-gray-500">Applied for:</div>
      <div className="mt-2 flex flex-wrap">
        {t.appliedFor.map(c => <span key={c} className="bg-[#fff7ed] text-[#d97706] text-xs px-3 py-1 rounded-full mr-2 mb-2">{c}</span>)}
      </div>
      <div className="text-xs text-gray-400 mt-3">Applied: {t.applicationDate}</div>
    </div>

    <div className="mt-6 flex gap-3">
      <button className="flex-1 bg-green-600 text-white rounded-md py-2 text-sm">Approve</button>
      <button className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm">Reject</button>
    </div>
  </div>
)

const TeacherList = () => {
  const [tab, setTab] = useState('approved')
  const [query, setQuery] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedTeacher(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filteredApproved = approvedTeachers.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
  const filteredPending = pendingTeachers.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))

  const openTeacher = (t) => setSelectedTeacher(t)
  const closeTeacher = () => setSelectedTeacher(null)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Teachers Management</h2>
      </div>

      <p className="text-gray-500 mb-4">Manage teacher accounts and approve new applications</p>

      <div className="max-w-xl">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search teachers..." className="w-full rounded-lg border border-gray-200 px-4 py-2" />
      </div>

      <div className="mt-6 flex gap-3">
  <button onClick={()=>setTab('approved')} className={`px-4 py-2 rounded-full ${tab==='approved' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-[#f8fafc] text-gray-600'}`}>Approved Teachers ({approvedTeachers.length})</button>
  <button onClick={()=>setTab('pending')} className={`px-4 py-2 rounded-full ${tab==='pending' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-[#f8fafc] text-gray-600'}`}>Pending Approval ({pendingTeachers.length})</button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tab==='approved' && filteredApproved.map(t => (
          <TeacherCardApproved key={t.id} t={t} onView={openTeacher} />
        ))}

        {tab==='pending' && filteredPending.map(t => (
          <TeacherCardPending key={t.id} t={t} onView={openTeacher} />
        ))}
      </div>

      {/* Modal / Dialog */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeTeacher} />

          <div role="dialog" aria-modal="true" className="relative z-10 w-[90%] md:w-[540px] bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedTeacher.name}</h3>
                <div className="text-xs text-gray-500">Teacher Details</div>
              </div>
              <button onClick={closeTeacher} className="text-gray-500 bg-gray-100 rounded-full p-1.5 hover:bg-gray-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <div className="mb-3"><span className="font-medium">Department:</span><div>{selectedTeacher.department}</div></div>
              <div className="mb-3"><span className="font-medium">Email:</span><div>{selectedTeacher.email}</div></div>
              <div className="mb-3"><span className="font-medium">Phone:</span><div>{selectedTeacher.phone}</div></div>
              {selectedTeacher.joinDate && (
                <div className="mb-3"><span className="font-medium">Join Date:</span><div>{selectedTeacher.joinDate}</div></div>
              )}
              {selectedTeacher.applicationDate && (
                <div className="mb-3"><span className="font-medium">Application Date:</span><div>{selectedTeacher.applicationDate}</div></div>
              )}
              <div className="mb-1"><span className="font-medium">Classes:</span></div>
              <div className="text-sm text-gray-700">{(selectedTeacher.classes || selectedTeacher.appliedFor || []).join(', ')}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TeacherList

