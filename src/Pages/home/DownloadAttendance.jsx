import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BaseUrl } from '../../utils/constants'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const DownloadAttendance = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [selectedClass, setSelectedClass] = useState(null)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('pdf')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [classesData, setClassesData] = useState({ active: [], inactive: [] })

  const studentList = useSelector((store) => store.student) || []
  const verifiedTeachers = useSelector(store => store.teacher.verifiedTeachers) || []

  // Fetch classes from API
  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${BaseUrl}/admin/classes`,
        { withCredentials: true }
      )
      if (response.data.success) {
        const classes = response.data.data || []
        const active = classes.filter(cls => cls.isActive === true)
        const inactive = classes.filter(cls => cls.isActive === false)
        setClassesData({ active, inactive })
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClassAttendance = async (classCode) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/admin/download/class-attendance/${classCode}`,
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      console.error("Error fetching attendance:", error)
      return null
    }
  }

  const filterAttendanceByDate = (attendanceRecords, startDate, endDate) => {
    if (!startDate && !endDate) return attendanceRecords
    
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      
      if (start && end) {
        return recordDate >= start && recordDate <= end
      }
      if (start) {
        return recordDate >= start
      }
      if (end) {
        return recordDate <= end
      }
      return true
    })
  }

  const handlePreview = async (classData) => {
    setSelectedClass(classData)
    setShowPreviewModal(true)
    setCustomStartDate('')
    setCustomEndDate('')
    
    const attendanceData = await fetchClassAttendance(classData.classCode)
    if (attendanceData) {
      setPreviewData(attendanceData)
    }
  }

  const handleDownload = (classData) => {
    setSelectedClass(classData)
    setShowDownloadModal(true)
    setCustomStartDate('')
    setCustomEndDate('')
  }

  const generatePDF = async (classData, startDate, endDate) => {
    try {
      setIsGenerating(true)
      
      const attendanceData = await fetchClassAttendance(classData.classCode)
      if (!attendanceData) {
        alert("Failed to fetch attendance data")
        setIsGenerating(false)
        return
      }

      // Filter students and attendance based on date range
      let filteredStudents = [...attendanceData.students]
      let dateRangeText = 'All Records'
      let filteredDays = attendanceData.totalDays

      if (startDate || endDate) {
        dateRangeText = `${startDate || 'Start'} to ${endDate || 'End'}`
        
        filteredStudents = filteredStudents.map(student => {
          const filteredAttendance = filterAttendanceByDate(student.attendance, startDate, endDate)
          const present = filteredAttendance.filter(a => a.status === 1).length
          const absent = filteredAttendance.filter(a => a.status === 0).length
          const percentage = filteredAttendance.length > 0 
            ? Math.round((present / filteredAttendance.length) * 100)
            : 0
          
          return {
            ...student,
            attendance: filteredAttendance,
            present,
            absent,
            percentage
          }
        })
        
        filteredDays = filteredStudents[0]?.attendance.length || 0
      }

      const doc = new jsPDF({ orientation: 'landscape' })
      
      // Add title
      doc.setFontSize(20)
      doc.text(`Attendance Report - ${classData.className}`, 14, 20)
      
      doc.setFontSize(11)
      doc.text(`Class Code: ${classData.classCode}`, 14, 35)
      doc.text(`Teacher: ${classData.teacherName || 'N/A'}`, 14, 45)
      doc.text(`Period: ${dateRangeText}`, 14, 55)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 65)
      doc.text(`Total Days: ${filteredDays}`, 14, 75)
      doc.text(`Total Students: ${attendanceData.totalStudents}`, 14, 85)
      
      // Add class details summary
      doc.setFontSize(14)
      doc.text('Class Details', 14, 100)
      
      const classDetailsData = [
        ['Class Name', classData.className],
        ['Class Code', classData.classCode],
        ['Teacher', classData.teacherName || 'N/A'],
        ['Room No', classData.roomNo || 'N/A'],
        ['Schedule', classData.startTime && classData.endTime ? `${classData.startTime} - ${classData.endTime}` : 'N/A'],
        ['Class Days', classData.classDays?.join(', ') || 'N/A'],
        ['Total Students', attendanceData.totalStudents],
        ['Total Days', filteredDays],
        ['Date Range', dateRangeText]
      ]
      
      autoTable(doc, {
        startY: 105,
        head: [['Metric', 'Value']],
        body: classDetailsData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })
      
      // Add student-wise attendance table with Sr. No.
      const studentData = filteredStudents.map((student, index) => [
        index + 1,
        student.name,
        student.rollNo,
        student.email,
        `${student.present}`,
        `${student.absent}`,
        `${student.percentage}%`
      ])
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Sr. No', 'Student Name', 'Roll No', 'Email', 'Present', 'Absent', 'Attendance %']],
        body: studentData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 50 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 }
        }
      })
      
      // Add daily attendance summary
      if (filteredDays > 0 && filteredStudents[0]?.attendance?.length > 0) {
        doc.addPage()
        doc.setFontSize(14)
        doc.text('Daily Attendance Summary', 14, 20)
        
        // Get all unique dates
        const allDates = filteredStudents[0]?.attendance.map(a => a.date) || []
        
        // Create daily summary table
        const dailyData = allDates.map((date, idx) => {
          let present = 0
          let absent = 0
          
          filteredStudents.forEach(student => {
            const attendanceRecord = student.attendance.find(a => a.date === date)
            if (attendanceRecord) {
              if (attendanceRecord.status === 1) {
                present++
              } else {
                absent++
              }
            }
          })
          
          const percentage = filteredStudents.length > 0 
            ? Math.round((present / filteredStudents.length) * 100)
            : 0
          
          return [
            idx + 1,
            date,
            present,
            absent,
            `${percentage}%`
          ]
        })
        
        autoTable(doc, {
          startY: 25,
          head: [['Sr. No', 'Date', 'Present', 'Absent', 'Attendance %']],
          body: dailyData,
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] }
        })
      }
      
      const fileName = startDate || endDate 
        ? `${classData.classCode}_attendance_${startDate}_to_${endDate}.pdf`
        : `${classData.classCode}_full_attendance_report.pdf`
      
      doc.save(fileName)
      alert('PDF downloaded successfully!')
      
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF: " + error.message)
    } finally {
      setIsGenerating(false)
      setShowDownloadModal(false)
    }
  }

  const generateExcel = async (classData, startDate, endDate) => {
    try {
      setIsGenerating(true)
      
      const attendanceData = await fetchClassAttendance(classData.classCode)
      if (!attendanceData) {
        alert("Failed to fetch attendance data")
        setIsGenerating(false)
        return
      }

      // Filter students and attendance based on date range (SAME LOGIC AS PDF)
      let filteredStudents = [...attendanceData.students]
      let dateRangeText = 'All Records'
      let filteredDays = attendanceData.totalDays
      let allDates = []

      if (startDate || endDate) {
        dateRangeText = `${startDate || 'Start'} to ${endDate || 'End'}`
        
        filteredStudents = filteredStudents.map(student => {
          const filteredAttendance = filterAttendanceByDate(student.attendance, startDate, endDate)
          const present = filteredAttendance.filter(a => a.status === 1).length
          const absent = filteredAttendance.filter(a => a.status === 0).length
          const percentage = filteredAttendance.length > 0 
            ? Math.round((present / filteredAttendance.length) * 100)
            : 0
          
          filteredAttendance.forEach(a => {
            if (!allDates.includes(a.date)) allDates.push(a.date)
          })
          
          return {
            ...student,
            attendance: filteredAttendance,
            present,
            absent,
            percentage
          }
        })
        
        filteredDays = filteredStudents[0]?.attendance.length || 0
        allDates.sort()
      } else {
        allDates = attendanceData.students[0]?.attendance.map(a => a.date) || []
      }
      
      // Sheet 1: Class Details (SAME AS PDF)
      const classDetailsData = [
        ['Class Details', ''],
        ['Class Name', classData.className],
        ['Class Code', classData.classCode],
        ['Teacher', classData.teacherName || 'N/A'],
        ['Room No', classData.roomNo || 'N/A'],
        ['Schedule', classData.startTime && classData.endTime ? `${classData.startTime} - ${classData.endTime}` : 'N/A'],
        ['Class Days', classData.classDays?.join(', ') || 'N/A'],
        ['Total Students', attendanceData.totalStudents],
        ['Total Days', filteredDays],
        ['Period', dateRangeText],
        ['Generated On', new Date().toLocaleString()]
      ]
      
      // Sheet 2: Student-wise Attendance Summary (SAME AS PDF)
      const studentSummaryData = filteredStudents.map((student, index) => ({
        'Sr. No': index + 1,
        'Student Name': student.name,
        'Roll No': student.rollNo,
        'Email': student.email,
        'Present': student.present,
        'Absent': student.absent,
        'Attendance Percentage': `${student.percentage}%`
      }))
      
      // Sheet 4: Daily Summary (SAME AS PDF's daily summary)
      const dailySummaryData = allDates.map((date, index) => {
        let present = 0
        let absent = 0
        
        filteredStudents.forEach(student => {
          const attendanceRecord = student.attendance.find(a => a.date === date)
          if (attendanceRecord) {
            if (attendanceRecord.status === 1) {
              present++
            } else {
              absent++
            }
          }
        })
        
        const percentage = filteredStudents.length > 0 
          ? Math.round((present / filteredStudents.length) * 100)
          : 0
        
        return {
          'Sr. No': index + 1,
          'Date': date,
          'Present': present,
          'Absent': absent,
          'Attendance Percentage': `${percentage}%`
        }
      })
      
      const ws1 = XLSX.utils.aoa_to_sheet(classDetailsData)
      const ws2 = XLSX.utils.json_to_sheet(studentSummaryData)
      const ws3 = XLSX.utils.json_to_sheet(dailySummaryData)
      
      // Adjust column widths
      ws2['!cols'] = [{wch:5}, {wch:25}, {wch:12}, {wch:30}, {wch:10}, {wch:10}, {wch:15}]
      ws3['!cols'] = [{wch:8}, {wch:12}, {wch:10}, {wch:10}, {wch:18}]
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws1, 'Class Details')
      XLSX.utils.book_append_sheet(wb, ws2, 'Student Summary')
      XLSX.utils.book_append_sheet(wb, ws3, 'Daily Summary')
      
      const fileName = startDate || endDate 
        ? `${classData.classCode}_attendance_${startDate}_to_${endDate}.xlsx`
        : `${classData.classCode}_full_attendance_report.xlsx`
      
      XLSX.writeFile(wb, fileName)
      alert('Excel file downloaded successfully!')
      
    } catch (error) {
      console.error("Error generating Excel:", error)
      alert("Error generating Excel: " + error.message)
    } finally {
      setIsGenerating(false)
      setShowDownloadModal(false)
    }
  }

  const handleConfirmDownload = async () => {
    if (!selectedClass) return
    
    if (downloadFormat === 'pdf') {
      await generatePDF(selectedClass, customStartDate, customEndDate)
    } else {
      await generateExcel(selectedClass, customStartDate, customEndDate)
    }
  }

  const ClassCard = ({ classData, type }) => {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-200 bg-white">
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
              {classData.startTime && classData.endTime && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {classData.startTime} - {classData.endTime}
                </span>
              )}
              {classData.roomNo && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 13v6l7 3 7-3v-6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Room: {classData.roomNo}
                </span>
              )}
            </div>
            
            {classData.teacherName && (
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Teacher: {classData.teacherName}
              </p>
            )}
            
            {classData.classDays && classData.classDays.length > 0 && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {classData.classDays.join(", ")}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => handleDownload(classData)}
            disabled={isGenerating}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Download Attendance
          </button>
          <button
            onClick={() => handlePreview(classData)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/>
            </svg>
            Preview
          </button>
        </div>
      </div>
    )
  }

  // Preview Modal Component
  const PreviewModal = () => {
    if (!previewData) return null
    
    let filteredStudents = [...previewData.students]
    let totalDays = previewData.totalDays
    
    if (customStartDate || customEndDate) {
      filteredStudents = filteredStudents.map(student => {
        const filteredAttendance = filterAttendanceByDate(student.attendance, customStartDate, customEndDate)
        const present = filteredAttendance.filter(a => a.status === 1).length
        const absent = filteredAttendance.filter(a => a.status === 0).length
        const percentage = filteredAttendance.length > 0 
          ? Math.round((present / filteredAttendance.length) * 100)
          : 0
        
        return {
          ...student,
          attendance: filteredAttendance,
          present,
          absent,
          percentage
        }
      })
      totalDays = filteredStudents[0]?.attendance.length || 0
    }
    
    const totalPresent = filteredStudents.reduce((sum, s) => sum + s.present, 0)
    const totalAbsent = filteredStudents.reduce((sum, s) => sum + s.absent, 0)
    const avgPercentage = filteredStudents.length > 0 
      ? Math.round(filteredStudents.reduce((sum, s) => sum + s.percentage, 0) / filteredStudents.length)
      : 0

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setShowPreviewModal(false)} />
        
        <div className="relative z-10 w-[92%] md:w-[1000px] bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Preview: {selectedClass?.className}</h3>
                <p className="text-xs text-gray-500 mt-1">Attendance Report Preview</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md w-8 h-8 flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Start Date (Optional)</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">End Date (Optional)</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Leave empty to show all records</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Total Students</p>
                <p className="text-xl font-bold text-blue-700">{previewData.totalStudents}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600">Total Days</p>
                <p className="text-xl font-bold text-green-700">{totalDays}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600">Avg. Attendance</p>
                <p className="text-xl font-bold text-purple-700">{avgPercentage}%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-600">Total Present</p>
                <p className="text-xl font-bold text-orange-700">{totalPresent}</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sr. No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Roll No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Present</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Absent</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-4 py-2 text-sm">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm">{student.name}</td>
                      <td className="px-4 py-2 text-sm">{student.rollNo}</td>
                      <td className="px-4 py-2 text-sm">{student.email}</td>
                      <td className="px-4 py-2 text-sm text-green-600">{student.present}</td>
                      <td className="px-4 py-2 text-sm text-red-600">{student.absent}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`font-semibold ${student.percentage >= 75 ? 'text-green-600' : student.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {student.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Attendance Reports</h2>
        <p className="text-sm text-gray-500 mt-1">Generate and download attendance reports for analysis</p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-4 transition-colors ${
              activeTab === 'active'
                ? "border-b-2 border-green-500 text-green-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Classes ({classesData.active.length})
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`py-2 px-4 transition-colors ${
              activeTab === 'inactive'
                ? "border-b-2 border-red-500 text-red-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Inactive Classes ({classesData.inactive.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'active' && classesData.active.map(classData => (
          <ClassCard key={classData.classCode} classData={classData} type="active" />
        ))}
        {activeTab === 'inactive' && classesData.inactive.map(classData => (
          <ClassCard key={classData.classCode} classData={classData} type="inactive" />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-medium mb-3">Recent Reports</h4>
            <p className="text-sm text-gray-500 mb-4">Previously generated attendance reports</p>
            <div className="text-center py-8 text-gray-500">
              No recent reports available
            </div>
          </div>
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
                <div className="text-sm text-gray-500">Active Classes</div>
                <div className="font-medium">{classesData.active.length}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Active Teachers</div>
                <div className="font-medium">{verifiedTeachers?.length ?? 0}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 rounded-md border border-gray-100 hover:bg-gray-50 transition">
                  ⬇️ Daily Summary
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md border border-gray-100 hover:bg-gray-50 transition">
                  ⬇️ Weekly Report
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md border border-gray-100 hover:bg-gray-50 transition">
                  ⬇️ Monthly Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDownloadModal(false)} />
          
          <div className="relative z-10 w-[92%] md:w-[500px] bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Download Attendance Report</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedClass?.className}</p>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md w-8 h-8 flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Date Range (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Leave empty to download complete attendance history
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Download Format</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDownloadFormat('pdf')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition ${
                      downloadFormat === 'pdf'
                        ? 'bg-red-50 border-red-500 text-red-600'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    📄 PDF
                  </button>
                  <button
                    onClick={() => setDownloadFormat('excel')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition ${
                      downloadFormat === 'excel'
                        ? 'bg-green-50 border-green-500 text-green-600'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    📊 Excel
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDownload}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : `Download ${downloadFormat.toUpperCase()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPreviewModal && <PreviewModal />}
    </div>
  )
}

export default DownloadAttendance