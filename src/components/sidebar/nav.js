import { FileSpreadsheet, GraduationCap, LayoutDashboard, UserRound, Users } from "lucide-react";

// Admin panel pages. `badge` / `count` name the store values the sidebar shows next to an item.
export const NAV_MAIN = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/teachers", label: "Teachers", icon: Users, badge: "pendingTeachers" },
  { to: "/admin/students", label: "Students", icon: GraduationCap, count: "students" },
  { to: "/admin/attendance", label: "Attendance reports", icon: FileSpreadsheet },
];

export const NAV_ACCOUNT = [{ to: "/admin/profile", label: "Profile", icon: UserRound }];

export const pageFor = (pathname) => [...NAV_MAIN, ...NAV_ACCOUNT].find((item) => item.to === pathname.replace(/\/$/, "")) || NAV_MAIN[0];
