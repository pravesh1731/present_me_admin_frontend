import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Clock,
  BadgeCheck,
  ArrowRight,
  UserPlus,
  UserCheck,
  Download,
  CalendarDays,
  Building2,
  Inbox,
} from "lucide-react";

const fullName = (p) => `${p?.firstName || ""} ${p?.lastName || ""}`.trim() || "Unknown";

const initials = (p) =>
  `${p?.firstName?.[0] || ""}${p?.lastName?.[0] || ""}`.toUpperCase() || "?";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const timeAgo = (d) => {
  if (!d) return "";
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (Number.isNaN(diff)) return "";
  if (diff < 60) return "just now";
  const units = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of units) {
    const n = Math.floor(diff / secs);
    if (n >= 1) return `${n} ${label}${n > 1 ? "s" : ""} ago`;
  }
  return "";
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const Avatar = ({ p, color = "from-[#0BCCEB] to-[#0A80F5]" }) =>
  p?.profilePicUrl ? (
    <img src={p.profilePicUrl} alt={fullName(p)} className="w-10 h-10 rounded-full object-cover" />
  ) : (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} text-white flex items-center justify-center text-sm font-semibold shrink-0`}
    >
      {initials(p)}
    </div>
  );

const StatCard = ({ i, to, label, value, sub, icon: Icon, gradient, loading }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={i}>
    <Link
      to={to}
      className="group block bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`bg-gradient-to-br ${gradient} p-2 rounded-xl text-white`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <div className="mt-4 h-9 w-16 rounded bg-gray-100 animate-pulse" />
      ) : (
        <div className="mt-4 text-3xl font-bold text-gray-800">{value}</div>
      )}
      <div className="flex items-center justify-between mt-1">
        <div className="text-xs text-gray-400">{sub}</div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A80F5] group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  </motion.div>
);

const Card = ({ title, subtitle, action, children, className = "" }) => (
  <div className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 ${className}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
    <Inbox className="w-8 h-8 mb-2" />
    <p className="text-sm">{text}</p>
  </div>
);

const BarList = ({ rows, total, color }) => (
  <ul className="space-y-3">
    {rows.map(({ label, count }) => {
      const pct = total ? Math.round((count / total) * 100) : 0;
      return (
        <li key={label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 truncate">{label}</span>
            <span className="text-gray-500 tabular-nums">
              {count} <span className="text-gray-400">({pct}%)</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </li>
      );
    })}
  </ul>
);

// Count items by a key, sorted high → low, keeping the top `limit` and folding the rest into "Other"
const groupCount = (items, getKey, limit = 5) => {
  const map = {};
  items.forEach((it) => {
    const k = getKey(it) || "Not specified";
    map[k] = (map[k] || 0) + 1;
  });
  const sorted = Object.entries(map)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
  if (sorted.length <= limit) return sorted;
  const rest = sorted.slice(limit).reduce((sum, r) => sum + r.count, 0);
  return [...sorted.slice(0, limit), { label: "Other", count: rest }];
};

// Stable fallback so useMemo deps don't change on every render
const EMPTY = [];

const Dashboard = () => {
  const user = useSelector((store) => store.user);
  const pendingTeachers = useSelector((store) => store.teacher.pendingTeachers) || EMPTY;
  const verifiedTeachers = useSelector((store) => store.teacher.verifiedTeachers) || EMPTY;
  const students = useSelector((store) => store.student);

  const studentsLoading = students === null;
  const studentList = students || EMPTY;

  const pendingCount = pendingTeachers.length;
  const verifiedCount = verifiedTeachers.length;
  const totalTeachers = pendingCount + verifiedCount;
  const verifiedStudents = studentList.filter((s) => s.emailVerified === true).length;
  const verifiedPct = studentList.length
    ? Math.round((verifiedStudents / studentList.length) * 100)
    : 0;

  const semesterRows = useMemo(
    () =>
      groupCount(
        studentList,
        (s) => {
          const n = parseInt(s.semester, 10);
          return Number.isNaN(n) ? null : `Semester ${n}`;
        },
        6
      ),
    [studentList]
  );

  const departmentRows = useMemo(
    () => groupCount(verifiedTeachers, (t) => t.department, 5),
    [verifiedTeachers]
  );

  // Build an activity feed from real join/application dates
  const activity = useMemo(() => {
    const items = [
      ...pendingTeachers.map((t) => ({
        type: "pending",
        person: t,
        date: t.applicationDate || t.createdAt,
        title: "New teacher application",
      })),
      ...verifiedTeachers.map((t) => ({
        type: "teacher",
        person: t,
        date: t.createdAt,
        title: "Teacher joined",
      })),
      ...studentList.map((s) => ({
        type: "student",
        person: s,
        date: s.createdAt,
        title: "Student registered",
      })),
    ];
    return items
      .filter((i) => i.date && !Number.isNaN(new Date(i.date).getTime()))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [pendingTeachers, verifiedTeachers, studentList]);

  const activityStyle = {
    pending: { icon: Clock, bg: "from-amber-400 to-amber-600", text: "text-amber-600" },
    teacher: { icon: UserCheck, bg: "from-emerald-400 to-emerald-600", text: "text-emerald-600" },
    student: { icon: UserPlus, bg: "from-[#0BCCEB] to-[#0A80F5]", text: "text-[#0A80F5]" },
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="space-y-6">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white p-8 shadow-md"
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-16 w-40 h-40 rounded-full bg-white/10" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CalendarDays className="w-4 h-4" />
              {today}
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold">
              {greeting()}, {user?.firstName || "Admin"}
            </h2>
            {user?.InstitutionName && (
              <div className="mt-1 flex items-center gap-2 text-white/90">
                <Building2 className="w-4 h-4" />
                {user.InstitutionName}
              </div>
            )}
            <p className="mt-2 text-white/80">
              Here's what's happening with your attendance system today.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/teachers?tab=pending"
              className="inline-flex items-center gap-2 bg-white text-[#0A80F5] font-medium px-4 py-2 rounded-lg shadow hover:bg-white/90 transition"
            >
              <Clock className="w-4 h-4" />
              Review approvals
              {pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
            <Link
              to="/admin/attendance"
              className="inline-flex items-center gap-2 bg-white/15 border border-white/30 font-medium px-4 py-2 rounded-lg hover:bg-white/25 transition"
            >
              <Download className="w-4 h-4" />
              Download attendance
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          i={1}
          to="/admin/teachers"
          label="Total Teachers"
          value={totalTeachers}
          sub={`${verifiedCount} active · ${pendingCount} pending`}
          icon={Users}
          gradient="from-emerald-400 to-emerald-600"
        />
        <StatCard
          i={2}
          to="/admin/students"
          label="Total Students"
          value={studentList.length}
          sub="Registered in your institution"
          icon={GraduationCap}
          gradient="from-[#0BCCEB] to-[#0A80F5]"
          loading={studentsLoading}
        />
        <StatCard
          i={3}
          to="/admin/teachers?tab=pending"
          label="Pending Approvals"
          value={pendingCount}
          sub={pendingCount ? "Teacher applications waiting" : "All caught up"}
          icon={Clock}
          gradient="from-amber-400 to-amber-600"
        />
        <StatCard
          i={4}
          to="/admin/students"
          label="Verified Students"
          value={`${verifiedPct}%`}
          sub={`${verifiedStudents} of ${studentList.length} email verified`}
          icon={BadgeCheck}
          gradient="from-violet-400 to-violet-600"
          loading={studentsLoading}
        />
      </div>

      {/* Pending approvals + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Pending Approvals"
          subtitle="Teachers waiting for your review"
          action={
            pendingCount > 0 && (
              <Link
                to="/admin/teachers?tab=pending"
                className="text-sm text-[#0A80F5] font-medium hover:underline whitespace-nowrap"
              >
                View all
              </Link>
            )
          }
        >
          {pendingCount === 0 ? (
            <EmptyState text="No pending applications 🎉" />
          ) : (
            <ul className="space-y-3">
              {pendingTeachers.slice(0, 5).map((t, idx) => (
                <li
                  key={t._id || t.emailId || idx}
                  className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar p={t} color="from-amber-400 to-amber-600" />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">{fullName(t)}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {t.department || t.emailId}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={t.teacherId ? `/admin/teachers?teacher=${t.teacherId}` : "/admin/teachers?tab=pending"}
                    className="shrink-0 text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 transition"
                  >
                    Review
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent Activity" subtitle="Latest updates from your attendance system">
          {activity.length === 0 ? (
            <EmptyState text="No recent activity yet" />
          ) : (
            <ul className="space-y-3">
              {activity.map((a, idx) => {
                const style = activityStyle[a.type];
                const Icon = style.icon;
                return (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`bg-gradient-to-br ${style.bg} p-2 rounded-full text-white shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800">{a.title}</div>
                        <div className="text-xs text-gray-500 truncate">{fullName(a.person)}</div>
                      </div>
                    </div>
                    <div className={`text-xs whitespace-nowrap ${style.text}`}>{timeAgo(a.date)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Students by Semester" subtitle="How your students are distributed">
          {studentList.length === 0 ? (
            <EmptyState text={studentsLoading ? "Loading students..." : "No students yet"} />
          ) : (
            <BarList rows={semesterRows} total={studentList.length} color="from-[#0BCCEB] to-[#0A80F5]" />
          )}
        </Card>

        <Card title="Teachers by Department" subtitle="Active teachers across departments">
          {verifiedCount === 0 ? (
            <EmptyState text="No active teachers yet" />
          ) : (
            <BarList rows={departmentRows} total={verifiedCount} color="from-emerald-400 to-emerald-600" />
          )}
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
