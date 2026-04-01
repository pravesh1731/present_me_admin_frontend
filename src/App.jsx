import React from "react";
import SignUpPage from "./Pages/signup/SignUpPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/error/ErrorPage";
import SignInPage from "./Pages/signin_page/SignInPage";
import TeacherList from "./Pages/home/TeacherList";
import Header from "./components/header/Header";
import Dashboard from "./Pages/home/Dashboard";
import StudentList from "./Pages/home/StudentList";
import Chat from "./Pages/chat/ChatPage";
import Profile from "./Pages/home/ProfilePage";
import DownloadAttendance from "./Pages/home/DownloadAttendance";
import ForgetPasswordPage from "./Pages/froget_password/ForgetPasswordPage";
import AccountVerificationPage from "./Pages/account_verification_page/AccountVerificationPage";
import IntroPage from "./Pages/Present-Me landingPage/introPage";
import { Provider } from "react-redux";
import appStore from "./utils/appstore";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

function App() {
  return (
    <Provider store={appStore}>
      <div>
        <RouterProvider router={appRouter} />
      </div>
    </Provider>
  );
}

const appRouter = createBrowserRouter([
   {
    path: "/",
    element: <IntroPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <Header />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/admin/teachers", element: <TeacherList /> },
      { path: "/admin/students", element: <StudentList /> },
      { path: "/admin/chat", element: <Chat /> },
      { path: "/admin/attendance", element: <DownloadAttendance /> },
      { path: "/admin/profile", element: <Profile /> },
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
