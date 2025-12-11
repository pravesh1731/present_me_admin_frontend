import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { InputFieldSvg, LogoSvg } from "../common/svg/svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser } from "../../utils/userSlice";
import { BaseUrl } from "../../utils/constants";

const Sidebar = ({
  className = "",
  collapsed = false,
  mobileOpen = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        BaseUrl + "/admin/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser())
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Desktop sidebar (hidden on small screens), shrinks when collapsed
  const desktop = (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 p-4 transition-all duration-200 z-20 ${className}`}
    >
      <div
        className={`flex items-center gap-3 mb-6 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div
          className={`bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-1 rounded-lg text-white`}
        >
          <LogoSvg />
        </div>
        {!collapsed && (
          <div>
            <div className="text-lg font-semibold">Present-Me</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        )}
      </div>

      <nav className=" flex-1">
        <NavLink
          to="/admin"
          end
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <span>
            <InputFieldSvg d1="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </span>{" "}
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink
          to="/admin/teachers"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <span>
            <InputFieldSvg d1="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </span>{" "}
          {!collapsed && <span>Teachers</span>}
        </NavLink>
        <NavLink
          to="/admin/students"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <span>
            <InputFieldSvg d1="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </span>{" "}
          {!collapsed && <span>Students</span>}
        </NavLink>
        <NavLink
          to="/admin/chat"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <span>
            <InputFieldSvg d1="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </span>{" "}
          {!collapsed && <span>Chat</span>}
        </NavLink>
        <NavLink
          to="/admin/attendance"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <span>
            <InputFieldSvg d1="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </span>{" "}
          {!collapsed && <span>Download Attendance</span>}
        </NavLink>
        <NavLink
          to="/admin/profile"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <span>
            <InputFieldSvg d1="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </span>{" "}
          {!collapsed && <span>Profile</span>}
        </NavLink>
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className={`w-full text-left text-red-500 ${
            collapsed ? "text-center" : ""
          }`}
        >
          {!collapsed ? "Logout" : "⎋"}
        </button>
      </div>
    </aside>
  );

  // Mobile left slide-over (appears from left like desktop)
  const mobile = (
    <div
      className={`md:hidden fixed inset-0 z-50 ${
        mobileOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-auto transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-2 rounded-lg text-white">
              <LogoSvg />
            </div>
            <div>
              <div className="text-lg font-semibold">Present-Me</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/admin"
            end
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive
                  ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span>
              <InputFieldSvg d1="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </span>{" "}
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/teachers"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive
                  ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span>
              <InputFieldSvg d1="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </span>{" "}
            <span>Teachers</span>
          </NavLink>
          <NavLink
            to="/admin/students"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive
                  ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span>
              <InputFieldSvg d1="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </span>{" "}
            <span>Students</span>
          </NavLink>
          <NavLink
            to="/admin/chat"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive
                  ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span>
              {" "}
              <InputFieldSvg d1="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </span>{" "}
            <span>Chat</span>
          </NavLink>
          <NavLink
            to="/admin/attendance"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive
                  ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span>
              {" "}
              <InputFieldSvg d1="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </span>{" "}
            <span>Attendance</span>
          </NavLink>
          <NavLink
            to="/admin/profile"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive
                  ? "bg-[#f6f8ff] text-[#0A80F5] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span>
              {" "}
              <InputFieldSvg d1="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </span>{" "}
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktop}
      {mobile}
    </>
  );
};

export default Sidebar;
