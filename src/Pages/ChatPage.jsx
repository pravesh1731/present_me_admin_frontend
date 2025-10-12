import React, { useState } from 'react'

const teachersSample = [
  { id: 1, name: 'Emily Rodriguez', dept: 'Mathematics', last: 'Attendance submitted for Algebra I', unread: 2, online: true },
  { id: 2, name: 'Michael Chen', dept: 'Science', last: 'Need approval for field trip', unread: 0, online: true },
  { id: 3, name: 'Sarah Johnson', dept: 'English', last: 'Updated reading list for next semester', unread: 1, online: false },
  { id: 4, name: 'David Wilson', dept: 'History', last: 'Attendance report ready for review', unread: 0, online: false },
  { id: 5, name: 'Sarah Johnson', dept: 'English', last: 'Updated reading list for next semester', unread: 1, online: false },
  { id: 6, name: 'David Wilson', dept: 'History', last: 'Attendance report ready for review', unread: 0, online: false }
]

const classesFor = {
  4: [
    { id: 'c1', name: 'World History', time: 'Tue, Thu - 11:30 AM', count: 27 },
    { id: 'c2', name: 'American History', time: 'Mon, Wed, Fri - 3:00 PM', count: 23 }
  ]
}

const sampleMessages = [
  { id: 'm1', from: 'them', text: "Good morning! I've submitted the attendance for today's Algebra I class.", time: '09:30' },
  { id: 'm2', from: 'me', text: 'Thank you, Emily. I can see the attendance has been recorded. How was the class today?', time: '09:35' },
  { id: 'm3', from: 'them', text: 'The class went well! We covered quadratic equations and most students seemed to understand the concept. Only 2 students were absent today.', time: '09:40' },
  { id: 'm4', from: 'them', text: 'I wanted to discuss the upcoming parent-teacher conferences. Do we have the schedule ready?', time: '10:15' }
]

const ChatPage = () => {
  const [selected, setSelected] = useState(4)
  const [messages, setMessages] = useState(sampleMessages)
  const [text, setText] = useState('')

  const teacher = teachersSample.find(t => t.id === selected)
  const classes = classesFor[selected] || []

  const send = () => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { id: 'm' + Date.now(), from: 'me', text: text.trim(), time: 'Now' }])
    setText('')
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Chat & Communications</h2>
        <p className="text-sm text-gray-500">Communicate with teachers and view their class information</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col h-[70vh]">
          <h3 className="font-medium mb-3">Teachers</h3>
          <div className="mb-3">
            <input placeholder="Search teachers..." className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          </div>

          <div className="overflow-auto flex-1 space-y-3 pr-2">
            {teachersSample.map(t => (
              <div key={t.id} onClick={() => setSelected(t.id)} className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${selected===t.id ? 'bg-gradient-to-r from-[#0bcceb] to-[#0a80f5] text-white shadow-lg' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected===t.id ? 'bg-white text-[#0a80f5]' : 'bg-gradient-to-br from-[#c7b9ff] to-[#8bd3ff] text-white'}`}>{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div className="flex-1">
                  <div className={`flex items-center gap-2 ${selected===t.id ? 'text-white' : ''}`}>
                    <div className="font-medium">{t.name}</div>
                    {t.online && <div className={`${selected===t.id ? 'bg-white' : 'bg-green-500'} w-2 h-2 rounded-full`}></div>}
                  </div>
                  <div className={`text-xs ${selected===t.id ? 'text-white/80' : 'text-gray-500'}`}>{t.dept}</div>
                  <div className={`text-xs mt-1 ${selected===t.id ? 'text-white/90' : 'text-gray-400'}`}>{t.last}</div>
                </div>
                {t.unread>0 && <div className={`ml-2 ${selected===t.id ? 'bg-white text-[#0a80f5]' : 'bg-red-500 text-white'} rounded-full w-6 h-6 flex items-center justify-center text-xs`}>{t.unread}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white rounded-xl p-6 shadow-sm h-[70vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">{teacher.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <div>
                <div className="font-medium">{teacher.name}</div>
                <div className="text-xs text-gray-500">{teacher.dept} • {teacher.online ? 'Online' : 'Offline'}</div>
              </div>
            </div>
            <button className="border border-gray-200 rounded-full px-3 py-2 text-sm">View Classes</button>
          </div>

          <div className="mb-4">
            <div className="flex gap-3">
              {classes.map(c => (
                <div key={c.id} className="bg-[#f3f2ff] px-4 py-3 rounded-lg flex-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-[#6b46c1] bg-white px-2 py-1 rounded-full border border-[#e9dbff]">{c.count} students</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{c.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto mb-4 space-y-4 px-1">
            {messages.map(m => (
              <div key={m.id} className={`${m.from==='me' ? 'flex justify-end' : 'flex justify-start'}`}>
                <div className={`${m.from==='me' ? 'bg-gradient-to-br from-[#0bcceb] to-[#0a80f5] text-white' : 'bg-gray-100 text-gray-800'} p-4 rounded-xl max-w-[70%]`}>{m.text}<div className="text-xs text-gray-300 mt-2 text-right">{m.time}</div></div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type your message..." className="flex-1 rounded-full border border-gray-200 px-4 py-3" />
            <button onClick={send} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0bcceb] to-[#0a80f5] text-white flex items-center justify-center">✈️</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ChatPage
