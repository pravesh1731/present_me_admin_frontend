import React from "react";
import SignUpPage from "./Pages/signup/SignUpPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/error/ErrorPage";
import SignInPage from "./Pages/signin_page/SignInPage";
import TeacherList from "./Pages/home/TeacherList";
import MainLayout from "./components/header/Header";
import Dashboard from "./Pages/home/Dashboard";
import StudentList from "./Pages/home/StudentList";
import Chat from "./Pages/chat/ChatPage";
import Profile from "./Pages/home/ProfilePage";
import DownloadAttendance from "./Pages/home/DownloadAttendance";
import ForgetPasswordPage from "./Pages/froget_password/ForgetPasswordPage";
import AccountVerificationPage from "./Pages/account_verification_page/AccountVerificationPage";

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
