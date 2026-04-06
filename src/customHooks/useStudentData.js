import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BaseUrl } from "../utils/constants";
import { setStudents } from "../utils/studentSlice";

export const useStudentData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getStudentList = async () => {
      try {
        const studentList = await axios.get(BaseUrl + `/admin/students`, {
          withCredentials: true,
        });
        dispatch(setStudents(studentList.data.data));
      } catch (error) {
        console.error("Error fetching student list:", error);
      }
    };
    getStudentList();
  }, []);
};

export default useStudentData;
