import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import teacherReducer from "./teacherSlice";
import studentReducer from "./studentSlice";


const appStore = configureStore({
    reducer: {
        user: userReducer,
        teacher: teacherReducer,
        student: studentReducer,
    }
});

export default appStore