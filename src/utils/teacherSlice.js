import { createSlice } from "@reduxjs/toolkit";

const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    pendingTeachers: [],
    verifiedTeachers: [],
  },
  reducers: {

    setPendingTeacher: (state, action) => {
      state.pendingTeachers = action.payload;
    },
    setVerifiedTeacher: (state, action) => {
      state.verifiedTeachers = action.payload;
    },
  },
});

export const { setPendingTeacher, setVerifiedTeacher} = teacherSlice.actions;
export default teacherSlice.reducer;
