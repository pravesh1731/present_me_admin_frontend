import React from 'react'
import { useSelector } from 'react-redux'

const classes = ['All Classes', 'Algebra I', 'World History', 'Grade 8', 'Grade 9']


const sampleReports = [
  { id: 1, title: 'Monthly Attendance Report - December 2023', meta: 'All Classes • All Teachers • Dec 1-31, 2023', size: '2.4 MB', date: '2024-01-05', type: 'Summary' },
  { id: 2, title: 'Algebra I - Weekly Report', meta: 'Algebra I • Emily Rodriguez • Nov 25 - Dec 1, 2023', size: '1.2 MB', date: '2024-01-02', type: 'Detailed' },
  { id: 3, title: 'Grade 8 - Monthly Analytics', meta: 'Grade 8 • All Teachers • Dec 2023', size: '3.1 MB', date: '2024-01-01', type: 'Analytics' }
]

const DownloadAttendance = () => {

  const studentList = useSelector((store) => store.student) || [];
  const verifiedTeachers = useSelector(store => store.teacher.verifiedTeachers)
  const teacherNames = verifiedTeachers.map(t => t.firstName + ' ' + t.lastName);

  console.log('Verified Teachers:', teacherNames);



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Attendance Reports</h2>
        <p className="text-sm text-gray-500 mt-1">Generate and download attendance reports for analysis</p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-gradient-to-br from-white to-[#f3f2ff] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">Download New Report</h3>
                <p className="text-sm text-gray-500">Configure your attendance report parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Class</label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 bg-white">
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Teacher</label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 bg-white">
                    {teacherNames.map((name, index) => <option key={index} value={name}>{name}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
              

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                <input type="date" className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                <input type="date" className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button className="px-6 py-3 rounded-full bg-gradient-to-br from-[#0bcceb] to-[#0a80f5] text-white font-medium shadow">Download Attendance</button>
              <button className="px-4 py-2 rounded-full border border-gray-200 bg-white">Preview</button>
            </div>
          </div>

          {/* Recent Reports moved below to span full width */}
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-medium mb-3">Quick Stats</h4>
            <div className="text-sm text-gray-500 mb-4">Summary metrics and common reports</div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Total Students</div>
                <div className="font-medium">{studentList.length}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Total Classes</div>
                <div className="font-medium">9</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Active Teachers</div>
                <div className="font-medium">{verifiedTeachers?.length??0}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 rounded-md border border-gray-100">⬇️ Daily Summary</button>
                <button className="w-full text-left px-3 py-2 rounded-md border border-gray-100">⬇️ Weekly Report</button>
                <button className="w-full text-left px-3 py-2 rounded-md border border-gray-100">⬇️ Monthly Analytics</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-medium mb-3">Recent Reports</h4>
          <p className="text-sm text-gray-500 mb-4">Previously generated attendance reports</p>

          <div className="space-y-4">
            {sampleReports.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#f3f2ff] flex items-center justify-center text-[#6b46c1] font-semibold">📄</div>
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{r.meta}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 text-right mr-2">
                    <div>{r.size} • {r.date}</div>
                    <div className="mt-1 text-sm font-medium text-green-600">{r.type}</div>
                  </div>
                  <button className="px-3 py-2 rounded-md border border-red-200 text-red-600 bg-red-50 text-sm">PDF</button>
                  <button className="px-3 py-2 rounded-md border border-green-200 text-green-600 bg-green-50 text-sm">Excel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadAttendance


