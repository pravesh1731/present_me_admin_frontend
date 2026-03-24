// src/hooks/useTeacherData.js
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setPendingTeacher, setVerifiedTeacher } from '../utils/teacherSlice'
import { BaseUrl } from '../utils/constants'

const useTeacherData = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pending, verified] = await Promise.all([
          axios.get(BaseUrl + '/admin/pendingTeachers', { withCredentials: true }),
          axios.get(BaseUrl + '/admin/approvedTeachers', { withCredentials: true }),
        ])
        dispatch(setPendingTeacher(pending.data.data))
        dispatch(setVerifiedTeacher(verified.data.data))
      } catch (err) {
        console.error('Error fetching teacher data:', err)
      }
    }
    fetchAll()
  }, [])
}

export default useTeacherData