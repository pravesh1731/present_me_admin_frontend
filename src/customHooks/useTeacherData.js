// src/hooks/useTeacherData.js
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setPendingTeacher, setVerifiedTeacher } from '../utils/teacherSlice'
import { BaseUrl } from '../utils/constants'

// Fetch both teacher lists and store them in Redux. Throws on failure so callers can show an error.
export const fetchTeacherLists = async (dispatch) => {
  const [pending, verified] = await Promise.all([
    axios.get(BaseUrl + '/admin/pendingTeachers', { withCredentials: true }),
    axios.get(BaseUrl + '/admin/approvedTeachers', { withCredentials: true }),
  ])
  dispatch(setPendingTeacher(pending.data.data))
  dispatch(setVerifiedTeacher(verified.data.data))
}

export const useTeacherData = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    fetchTeacherLists(dispatch).catch((err) => console.error('Error fetching teacher data:', err))
  }, [dispatch])
}

export default useTeacherData;
