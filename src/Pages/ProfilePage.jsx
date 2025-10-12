import React, { useState } from 'react'

const permissions = ['User Management','System Configuration','Report Generation','Data Export','Teacher Approval','Student Records']

const ProfilePage = () => {
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('John Administrator')
  const [email, setEmail] = useState('admin@attendanceapp.edu')
  const [phone, setPhone] = useState('+1 (555) 987-6543')
  const [location, setLocation] = useState('Main Campus')
  const [role, setRole] = useState('System Administrator')
  const [department, setDepartment] = useState('IT Administration')
  const [bio, setBio] = useState('Experienced education technology administrator with over 8 years in student information systems and attendance management.')
  
  const toggleEdit = () => {
    if (editing) {
      // Save action: replace with API call if needed
      console.log('Saving profile', { fullName, email, phone, location, role, department, bio })
      setEditing(false)
    } else {
      setEditing(true)
    }
  }
  const [tab, setTab] = useState('profile')

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Profile Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
          </div>
          <button onClick={toggleEdit} className={`px-4 py-2 rounded-md ${editing ? 'bg-gradient-to-br from-[#7c4dff] to-[#6b46c1] text-white' : 'border border-gray-200'}`}>{editing ? 'Save Changes' : 'Edit Profile'}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-3">
          <button onClick={()=>setTab('profile')} className={`px-3 py-1 rounded-full text-sm ${tab==='profile' ? 'bg-gray-100' : ''}`}>Profile</button>
          <button onClick={()=>setTab('security')} className={`px-3 py-1 rounded-full text-sm ${tab==='security' ? 'bg-gray-100' : ''}`}>Security</button>
          <button onClick={()=>setTab('notifications')} className={`px-3 py-1 rounded-full text-sm ${tab==='notifications' ? 'bg-gray-100' : ''}`}>Notifications</button>
          <button onClick={()=>setTab('activity')} className={`px-3 py-1 rounded-full text-sm ${tab==='activity' ? 'bg-gray-100' : ''}`}>Activity Log</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className={`col-span-12 ${tab==='profile' ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {tab === 'profile' && (
            <div className="bg-gradient-to-br from-white to-[#f3f2ff] rounded-xl p-6 shadow-sm">
              <h4 className="font-medium mb-3">Personal Information</h4>
              <p className="text-sm text-gray-500 mb-4">Update your personal details and profile information</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0bcceb] to-[#0a80f5] flex items-center justify-center text-white font-bold text-xl">JA</div>
                <div>
                  <button disabled={!editing} className={`px-3 py-2 rounded-md border ${editing ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>📷 Change Photo</button>
                  <div className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                  <input disabled={!editing} value={fullName} onChange={e=>setFullName(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${editing ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'}`} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email</label>
                  <input disabled={!editing} value={email} onChange={e=>setEmail(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${editing ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'}`} />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Phone</label>
                  <input disabled={!editing} value={phone} onChange={e=>setPhone(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${editing ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'}`} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Location</label>
                  <input disabled={!editing} value={location} onChange={e=>setLocation(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${editing ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'}`} />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Role</label>
                  <input disabled={!editing} value={role} onChange={e=>setRole(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${editing ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'}`} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Department</label>
                  <input disabled={!editing} value={department} onChange={e=>setDepartment(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${editing ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'}`} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Bio</label>
                  <textarea disabled={!editing} value={bio} onChange={e=>setBio(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${editing ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'}`} rows={3} />
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-50 p-6">
                <h4 className="font-medium mb-1">Security Settings</h4>
                <p className="text-sm text-gray-500">Manage your password and security preferences</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Current password</label>
                    <input type="password" className="w-full rounded-lg border border-gray-200 px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">New password</label>
                    <input type="password" className="w-full rounded-lg border border-gray-200 px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Confirm new password</label>
                    <input type="password" className="w-full rounded-lg border border-gray-200 px-4 py-3" />
                  </div>

                  <div className="mt-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3z"/></svg>
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-500">Secure your account with 2FA<br/><span className="text-xs text-gray-400">Currently disabled</span></div>
                    </div>
                    <div>
                      <button className="px-3 py-2 rounded-md border border-green-200 text-green-600 bg-green-50">Enable 2FA</button>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Session Management</div>
                    <div className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-gray-500">Chrome on Windows • Current location</div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">Active</div>
                    </div>

                    <div className="mt-4">
                      <button className="w-full text-center px-4 py-2 rounded-md border border-red-200 text-red-600 bg-red-50">Sign Out All Other Sessions</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-blue-50 p-6">
                <h4 className="font-medium mb-1">Notification Preferences</h4>
                <p className="text-sm text-gray-500">Choose how you want to be notified about system events</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-500">Receive notifications via email</div>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#7c4dff] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-500">Receive browser push notifications</div>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#7c4dff] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium">Weekly Reports</div>
                      <div className="text-sm text-gray-500">Receive weekly attendance summary reports</div>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#7c4dff] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-500 mb-2">Notification Types</div>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4" /> Teacher approval requests</label>
                    <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4" /> Low attendance alerts</label>
                    <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4" /> System maintenance updates</label>
                    <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4" /> New user registrations</label>
                    <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4" /> Data export completions</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-green-50 p-6">
                <h4 className="font-medium mb-1">Activity Log</h4>
                <p className="text-sm text-gray-500">Recent actions and system activity</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 rounded-lg border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">✔️</div>
                  <div>
                    <div className="font-medium">Approved teacher application</div>
                    <div className="text-sm text-gray-500">Lisa Anderson - Art Department</div>
                    <div className="text-xs text-gray-400 mt-1">15/01/2024, 13:45:00</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">📄</div>
                  <div>
                    <div className="font-medium">Generated monthly report</div>
                    <div className="text-sm text-gray-500">December 2023 Attendance Summary</div>
                    <div className="text-xs text-gray-400 mt-1">15/01/2024, 10:20:00</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">⚙️</div>
                  <div>
                    <div className="font-medium">Updated system settings</div>
                    <div className="text-sm text-gray-500">Modified notification preferences</div>
                    <div className="text-xs text-gray-400 mt-1">14/01/2024, 16:15:00</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">✉️</div>
                  <div>
                    <div className="font-medium">Exported student data</div>
                    <div className="text-sm text-gray-500">Grade 11 Biology class attendance</div>
                    <div className="text-xs text-gray-400 mt-1">14/01/2024, 09:30:00</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {tab === 'profile' && (
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-medium mb-3">Account Summary</h4>
              <div className="text-sm text-gray-500 mb-4">Overview and permissions</div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500">Joined</div>
                  <div className="font-medium">15/08/2022</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Last Login</div>
                  <div className="font-medium">15/01/2024, 14:30:00</div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-xs text-gray-500 mb-2">Permissions</div>
                  <div className="flex flex-wrap gap-2">
                    {permissions.map(p => (
                      <div key={p} className="text-xs px-2 py-1 rounded-full bg-[#f3f2ff] text-[#6b46c1]">{p}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
