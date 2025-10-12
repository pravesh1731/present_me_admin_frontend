import React from "react";
import SignUpPage from "./Pages/SignUpPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import SignInPage from "./Pages/SignInPage";
import TeacherList from "./Pages/TeacherList";
import MainLayout from "./components/Header";
import Dashboard from "./Pages/Dashboard";
import StudentList from "./Pages/StudentList";
import Chat from "./Pages/ChatPage";
import Profile from "./Pages/ProfilePage";
import DownloadAttendance from "./Pages/DownloadAttendance";
import ForgetPasswordPage from "./Pages/ForgetPasswordPage";
import AccountVerificationPage from "./Pages/AccountVerificationPage";

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/teachers", element: <TeacherList /> },
      { path: "/students", element: <StudentList /> },
      { path: "/chat", element: <Chat /> },
      { path: "/attendance", element: <DownloadAttendance /> },
      { path: "/profile", element: <Profile /> },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forget_password",
    element: <ForgetPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/pending_verification",
    element: <AccountVerificationPage />,
    errorElement: <ErrorPage />,
  },
]);

export default App;
