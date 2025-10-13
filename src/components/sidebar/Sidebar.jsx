import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({
  className = "",
  collapsed = false,
  mobileOpen = false,
  onClose,
}) => {
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
          className={`bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] p-2 rounded-lg text-white`}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
              fill="currentColor"
            />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div className="text-lg font-semibold">Present-Me</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        )}
      </div>

      <nav className="space-y-2 flex-1">
        <NavLink
          to="/"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          <span>📊</span> {!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink
          to="/teachers"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          <span>👩‍🏫</span> {!collapsed && <span>Teachers</span>}
        </NavLink>
        <NavLink
          to="/students"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          <span>🎓</span> {!collapsed && <span>Students</span>}
        </NavLink>
        <NavLink
          to="/chat"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          <span>💬</span> {!collapsed && <span>Chat</span>}
        </NavLink>
        <NavLink
          to="/attendance"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          <span>⬇️</span> {!collapsed && <span>Download Attendance</span>}
        </NavLink>
        <NavLink
          to="/profile"
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
          }
        >
          <span>👤</span> {!collapsed && <span>Profile</span>}
        </NavLink>
      </nav>

      <div className="mt-auto pt-6">
        <button
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
    <div className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
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
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold">Present-Me</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <span>📊</span> <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/teachers"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <span>👩‍🏫</span> <span>Teachers</span>
          </NavLink>
          <NavLink
            to="/students"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <span>🎓</span> <span>Students</span>
          </NavLink>
          <NavLink
            to="/chat"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <span>💬</span> <span>Chat</span>
          </NavLink>
          <NavLink
            to="/attendance"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <span>⬇️</span> <span>Attendance</span>
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-[#f6f8ff] text-[#0A80F5] font-medium' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <span>👤</span> <span>Profile</span>
          </NavLink>
        </nav>

        <div className="mt-6">
          <button className="w-full text-left text-red-500">Logout</button>
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
