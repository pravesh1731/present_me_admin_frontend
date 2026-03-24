import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import teacherReducer from "./teacherSlice";


const appStore = configureStore({
    reducer: {
        user: userReducer,
        teacher: teacherReducer,
    }
});

export default appStore