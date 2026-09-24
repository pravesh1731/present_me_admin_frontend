import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BaseUrl } from "../utils/constants";
import { setStudents } from "../utils/studentSlice";

// Fetch the institution's students into Redux. Throws on failure so callers can show an error.
export const fetchStudentList = async (dispatch) => {
  const studentList = await axios.get(BaseUrl + `/admin/students`, {
    withCredentials: true,
  });
  dispatch(setStudents(studentList.data.data || []));
};

export const useStudentData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchStudentList(dispatch).catch((error) => console.error("Error fetching student list:", error));
  }, [dispatch]);
};

export default useStudentData;
