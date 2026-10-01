// Everything the landing page says lives here, so copy can be edited without touching layout.
// Feature details mirror the Present-Me Android app (github.com/pravesh1731/Present-me) and the admin panel.

import {
  UserPlus,
  MailCheck,
  House,
  Hash,
  Hourglass,
  Wifi,
  BarChart3,
  CalendarDays,
  Megaphone,
  Search,
  FileLock2,
  Upload,
  ListChecks,
  Wallet,
  IndianRupee,
  UserCog,
  LifeBuoy,
  Router,
  BadgeCheck,
  Archive,
  ClipboardCheck,
  PieChart,
  FileSpreadsheet,
  BellRing,
  Library,
  ShieldCheck,
  Users,
  LayoutDashboard,
  GraduationCap,
  Fingerprint,
  Smartphone,
  Zap,
  Layers,
  MapPinOff,
  ScreenShareOff,
  KeyRound,
  Trash2,
  ScanFace,
  NotebookPen,
  Moon,
  Languages,
} from "lucide-react";

// The Play Store link lives with the shared brand components so every page uses the same one
export { PLAY_STORE_URL } from "../../utils/brand";
export const SUPPORT_EMAIL = "support@presentme.in";
export const SUPPORT_PHONE = "+91 7007458210";
export const SUPPORT_WHATSAPP = "https://wa.me/917007458210";
export const LOCATION = "Gorakhpur, Uttar Pradesh, India";
export const SUPPORT_HOURS = [
  ["Mon – Fri", "9:00 AM – 6:00 PM"],
  ["Saturday", "10:00 AM – 4:00 PM"],
  ["Sunday", "Closed"],
];

/* ---------- why Present-Me ---------- */

export const COMPARISON = [
  ["Taking attendance", "The teacher calls every name, every lecture", "Students mark themselves from their own phones, all at once"],
  ["Proxy attendance", "A friend answers “present” for you", "Needs the classroom hotspot and the phone owner's fingerprint"],
  ["Hardware", "Biometric machines cost money and create queues", "Nothing to buy. The teacher's phone hotspot is enough"],
  ["Percentages", "Worked out by hand at the end of the month", "Live for every student, in every class"],
  ["Reports", "Typed into spreadsheets from paper registers", "PDF or Excel in a tap, for any date range"],
  ["Notices", "Lost in busy WhatsApp groups", "Class and college notices in the app, tagged by priority"],
];

export const ROLE_BENEFITS = [
  {
    role: "Students",
    icon: GraduationCap,
    points: [
      "Mark attendance in seconds instead of waiting for your name",
      "See your percentage in every class before it becomes a problem",
      "Never miss a notice. Urgent ones stand out",
      "Notes and previous-year papers for your semester, readable offline",
      "Earn money by sharing good notes, withdrawn straight to UPI",
    ],
  },
  {
    role: "Teachers",
    icon: Users,
    points: [
      "Get the first minutes of every lecture back",
      "Watch the present list fill up live while you teach",
      "No hotspot? Mark by hand, and fix any record later",
      "Monthly or custom-range reports as PDF or Excel",
      "Send class notices as Normal, Important or Urgent",
    ],
  },
  {
    role: "HODs & Deans",
    icon: LayoutDashboard,
    points: [
      "Only teachers you approve can create classes",
      "Teachers, students and classes in one web dashboard",
      "Spot students below 75% before exams, not after",
      "Download any class's attendance for any date range",
      "No spreadsheets to chase at the end of the month",
    ],
  },
];

export const UNIQUE = [
  {
    icon: Fingerprint,
    title: "Two checks, not one",
    text: "A mark only counts when the phone is on the teacher's hotspot (so it's in the room) and the owner unlocks it with their fingerprint (so it's really them).",
  },
  {
    icon: Smartphone,
    title: "No hardware to buy",
    text: "No scanners, ID cards or biometric machines. The teacher's phone hotspot marks the classroom and students use the phones they already carry.",
  },
  {
    icon: Zap,
    title: "Live, not later",
    text: "Names appear on the teacher's screen the moment students mark, and percentages update for everyone straight away.",
  },
  {
    icon: BadgeCheck,
    title: "A chain of trust",
    text: "We verify every institute with ID proof. The HOD or Dean approves teachers, and teachers approve the students who join their classes.",
  },
  {
    icon: ShieldCheck,
    title: "Your fingerprint stays on your phone",
    text: "Android checks the fingerprint or screen lock. Present-Me only receives a yes or no, never the fingerprint itself.",
  },
  {
    icon: Layers,
    title: "One app for class life",
    text: "Attendance, class notices, notes and PYQs, offline reading and a rewards wallet, so students don't juggle five apps and ten groups.",
  },
];

export const TRUST_CHAIN = [
  { icon: ShieldCheck, who: "Present-Me", does: "verifies the institute's ID proof" },
  { icon: LayoutDashboard, who: "HOD / Dean", does: "approves the institute's teachers" },
  { icon: Users, who: "Teacher", does: "approves the students in each class" },
  { icon: Fingerprint, who: "Student", does: "marks present with their own fingerprint" },
];

/* ---------- privacy & safety ---------- */

export const SAFETY = [
  {
    icon: Fingerprint,
    title: "Fingerprints never leave the phone",
    text: "Biometric checks run inside Android. The app is only told whether the check passed.",
  },
  {
    icon: MapPinOff,
    title: "No location tracking",
    text: "Android asks for location permission before an app can read a Wi-Fi name. Present-Me uses it only to confirm the hotspot and never stores where you are.",
  },
  {
    icon: ScreenShareOff,
    title: "Notes can't be screenshotted",
    text: "The built-in PDF viewer blocks screenshots and screen recording, so the work people share stays protected.",
  },
  {
    icon: BadgeCheck,
    title: "Only verified people",
    text: "Institutes are checked with ID proof and emails are verified with a link. The institute approves its teachers, and teachers approve every student who joins a class.",
  },
  {
    icon: KeyRound,
    title: "Strong passwords",
    text: "Passwords need upper and lower case letters, a number and a symbol. Forgot yours? A reset link arrives by email.",
  },
  {
    icon: Trash2,
    title: "Leave whenever you want",
    text: "Delete your account from Settings or from this website, and your data is removed within 30 days.",
  },
];

/* Things the app already lists as "coming soon" */
export const ROADMAP = [
  { icon: ScanFace, title: "Face-recognition attendance", text: "Video attendance that recognises faces. Already listed in the teacher app." },
  { icon: NotebookPen, title: "Marks entry", text: "Teachers fill in internal marks right next to attendance." },
  { icon: Moon, title: "Dark mode", text: "A darker theme that's easier on the eyes at night." },
  { icon: Languages, title: "More languages", text: "Use the app in the language you're most comfortable with." },
];

/*
 * Walkthrough videos.
 * Every walkthrough plays the app screens listed in `scenes` like a short video, with chapters.
 *
 * To show a real screen recording instead:
 *   1. Record the flow on an Android phone (Quick Settings → Screen record), or record the admin
 *      panel with any screen recorder. Keep it short: one flow per video.
 *   2. Upload it to YouTube (Unlisted is fine).
 *   3. Paste the video ID (the part after "v=" in the URL) into `youtubeId` below.
 * The player switches to the YouTube video automatically, and the chapters stay as captions.
 */
export const VIDEOS = [
  {
    id: "student-start",
    audience: "Students",
    title: "Getting started as a student",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "s-signup", caption: "Sign up with your roll number and semester, and pick your institute from the list." },
      { scene: "s-verify-email", caption: "Tap the link we email you. It's valid for 24 hours and opens the app for you." },
      { scene: "s-join", caption: "Enter the 6-digit class code your teacher shares." },
      { scene: "s-pending", caption: "Your request waits under Pending until the teacher approves it." },
      { scene: "s-home", caption: "Once approved, your home screen shows today's classes and your attendance." },
    ],
  },
  {
    id: "student-attendance",
    audience: "Students",
    title: "Marking attendance in class",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "s-hotspot", caption: "Connect to your teacher's hotspot. The app checks the Wi-Fi name for you." },
      { scene: "s-verify", caption: "Tap Authenticate & Mark Attendance and confirm with your fingerprint or phone lock." },
      { scene: "s-marked", caption: "You're marked present. Your teacher sees your name appear immediately." },
      { scene: "s-stats", caption: "See your overall percentage and every class at a glance." },
      { scene: "s-history", caption: "Open a class to see the date-by-date record." },
    ],
  },
  {
    id: "student-notes",
    audience: "Students",
    title: "Notices, notes and PYQs",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "s-notices", caption: "General notices for the whole college, class notices from your teachers." },
      { scene: "s-notes", caption: "Pick course, department and semester to find notes and previous-year papers." },
      { scene: "s-pdf", caption: "Downloads open offline in a secure viewer that blocks screenshots." },
    ],
  },
  {
    id: "student-wallet",
    audience: "Students",
    title: "Upload notes and earn",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "s-upload", caption: "Upload a PYQ set or full subject notes as PDF, Word or PowerPoint, up to 10 MB." },
      { scene: "s-uploads", caption: "Track each upload: pending, approved or rejected." },
      { scene: "s-wallet", caption: "Approved uploads add a reward to your wallet." },
      { scene: "s-withdraw", caption: "Withdraw to any UPI ID from ₹10. Requests are usually done within 24 hours." },
    ],
  },
  {
    id: "teacher-start",
    audience: "Teachers",
    title: "Setting up your classes",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "t-signup", caption: "Sign up, choose your institute and enter your phone's hotspot name." },
      { scene: "t-pending", caption: "Your HOD or Dean approves your account from the admin panel." },
      { scene: "t-create", caption: "Create a class with its room, days and timing. You get a 6-digit code to share." },
      { scene: "t-requests", caption: "Approve or reject students who ask to join." },
      { scene: "t-classes", caption: "Edit classes, move old ones to Inactive, or reactivate them later." },
    ],
  },
  {
    id: "teacher-session",
    audience: "Teachers",
    title: "Taking attendance",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "t-home", caption: "Today's classes and quick actions are on your home screen." },
      { scene: "t-session", caption: "Turn on your hotspot, tap Enable Attendance and watch names come in live." },
      { scene: "t-manual", caption: "No hotspot? Mark each student Present or Absent and submit." },
      { scene: "t-track", caption: "Open any student to see their record. Long-press a date to correct it." },
    ],
  },
  {
    id: "teacher-notices",
    audience: "Teachers",
    title: "Notices and reports",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "t-notice", caption: "Send a class notice and tag it Normal, Important or Urgent." },
      { scene: "t-general", caption: "General notices reach every teacher and student." },
      { scene: "t-report", caption: "Download attendance as PDF or Excel for a month or a custom date range." },
    ],
  },
  {
    id: "admin",
    audience: "Institutes",
    title: "Admin panel for HODs and Deans",
    youtubeId: "",
    frame: "browser",
    scenes: [
      { scene: "a-register", caption: "Register your institute with ID proof. We verify it before activation." },
      { scene: "a-approve", caption: "Approve the teachers who sign up under your institute." },
      { scene: "a-dashboard", caption: "See teachers, students and pending approvals at a glance." },
      { scene: "a-students", caption: "Search every student by name, roll number or email." },
      { scene: "a-report", caption: "Export any class's attendance as PDF, Excel or CSV." },
    ],
  },
];

// The first walkthrough that shows this screen, and which chapter it's in
export const findWalkthrough = (scene) => {
  for (const v of VIDEOS) {
    const start = v.scenes.findIndex((s) => s.scene === scene);
    if (start !== -1) return { id: v.id, start };
  }
  return null;
};

/*
 * The feature guide: every feature, where to find it and how to use it.
 * `scene` is the app screen shown next to it. If a walkthrough above contains that scene,
 * a "Watch" button jumps straight to that chapter.
 */
export const FEATURE_GUIDE = {
  student: {
    label: "Students",
    frame: "phone",
    groups: [
      {
        name: "Get started",
        features: [
          {
            icon: UserPlus,
            title: "Create your account",
            summary: "Sign up as a student under your institute.",
            where: "Open the app → Student → Sign up",
            steps: [
              "Install Present-Me from Google Play and choose Student.",
              "Fill in your name, email, phone, roll number and semester.",
              "Search for your institute and select it.",
              "Set a password with upper and lower case letters, a number and a symbol.",
            ],
            scene: "s-signup",
          },
          {
            icon: MailCheck,
            title: "Verify your email",
            summary: "One tap on the link we send activates your account.",
            where: "Your email inbox",
            steps: [
              "Open the email from Present-Me. Check spam if you can't find it.",
              "Tap the verification link. It opens the app and confirms your account.",
              "Log in with your email and password.",
            ],
            tip: "The link is valid for 24 hours. If it expires, try logging in and tap Resend Verification Email.",
            scene: "s-verify-email",
          },
          {
            icon: House,
            title: "Your home screen",
            summary: "Today's classes, your attendance and quick actions.",
            where: "Home tab",
            steps: [
              "See a greeting, your overall attendance and how many classes you're in.",
              "Today's classes are listed with their room and time.",
              "Use the Mark Attendance and Join Class shortcuts.",
            ],
            scene: "s-home",
          },
        ],
      },
      {
        name: "Classes",
        features: [
          {
            icon: Hash,
            title: "Join a class",
            summary: "Use the 6-digit code from your teacher.",
            where: "Home → Join Class, or Classes → +",
            steps: ["Ask your teacher for the class code.", "Tap Join Class and type the 6-digit code.", "Your request goes to the teacher for approval."],
            scene: "s-join",
          },
          {
            icon: Hourglass,
            title: "Pending requests",
            summary: "See which classes are still waiting for approval.",
            where: "Classes → Pending Requests",
            steps: ["Each request shows Awaiting Teacher Approval until it's accepted.", "Joined the wrong class? Tap Cancel Request."],
            tip: "Approved classes move to My Classes, split into Active and Inactive.",
            scene: "s-pending",
          },
        ],
      },
      {
        name: "Attendance",
        features: [
          {
            icon: Wifi,
            title: "Mark attendance with the hotspot",
            summary: "Connect to your teacher's hotspot, verify, done.",
            where: "Home → Mark Attendance → your class",
            steps: [
              "When your teacher enables attendance, turn on Wi-Fi and join their hotspot.",
              "Allow location access if asked. Android needs it to read the Wi-Fi name.",
              "Open Mark Attendance and pick the class. The app confirms you're on the right hotspot.",
              "Tap Authenticate & Mark Attendance and use your fingerprint or screen lock.",
            ],
            tip: "You can mark once per class per day. “Attendance is disabled” means your teacher hasn't started the session yet, or has already ended it.",
            scene: "s-hotspot",
          },
          {
            icon: BarChart3,
            title: "Track your attendance",
            summary: "Overall and per-class percentages, always up to date.",
            where: "Attendance tab",
            steps: [
              "See your overall percentage with present, absent and total classes.",
              "Every class shows its own percentage bar.",
              "Classes slipping below 75% are highlighted so you can catch up in time.",
            ],
            scene: "s-stats",
          },
          {
            icon: CalendarDays,
            title: "Attendance history",
            summary: "A date-by-date record for each class.",
            where: "Attendance → tap a class",
            steps: ["Open any class to see every session.", "Each date shows whether you were present or absent."],
            tip: "Spotted a mistake? Ask your teacher. They can correct any record.",
            scene: "s-history",
          },
        ],
      },
      {
        name: "Notices",
        features: [
          {
            icon: Megaphone,
            title: "Read notices",
            summary: "College-wide and class notices in one place.",
            where: "Menu → Notices",
            steps: [
              "General Notice has announcements for everyone.",
              "Class Notice has messages from each of your teachers.",
              "Badges show how many notices are new. Important and Urgent ones are tagged.",
            ],
            scene: "s-notices",
          },
        ],
      },
      {
        name: "Notes & PYQs",
        features: [
          {
            icon: Search,
            title: "Find notes and PYQs",
            summary: "Study material sorted by course, department and semester.",
            where: "Menu → Notes & PYQ",
            steps: [
              "Choose Previous papers or Class material.",
              "Pick your course, department and semester, then tap Search.",
              "Tap any file to download it.",
            ],
            tip: "B.Tech material is available for 10 departments, including CSE, AI, IT, ECE, Electrical, Mechanical, Civil and Chemical.",
            scene: "s-notes",
          },
          {
            icon: FileLock2,
            title: "Read offline, securely",
            summary: "Downloaded files open without internet.",
            where: "Menu → Downloads",
            steps: ["Everything you download is saved in My Downloads.", "Files open in the built-in PDF viewer, even with no internet.", "Remove a download any time to free up space."],
            tip: "The viewer blocks screenshots and screen recording to protect the people who shared the notes.",
            scene: "s-pdf",
          },
          {
            icon: Upload,
            title: "Upload and earn",
            summary: "Share good material and get rewarded.",
            where: "Notes & PYQ → Upload",
            steps: [
              "Choose PYQ or Notes.",
              "Fill in course, department, semester and academic year (and the subject, for notes).",
              "Attach a PDF, DOC, DOCX, PPT or PPTX file up to 10 MB.",
              "Tap Submit for Approval.",
            ],
            tip: "Only complete material earns a reward: all the papers for that semester, or notes that cover the whole subject.",
            scene: "s-upload",
          },
          {
            icon: ListChecks,
            title: "Track your uploads",
            summary: "See whether each file is pending, approved or rejected.",
            where: "Menu → Uploads",
            steps: ["Every file you submit is listed with its status.", "Approved uploads earn a reward in your wallet."],
            scene: "s-uploads",
          },
        ],
      },
      {
        name: "Wallet",
        features: [
          {
            icon: Wallet,
            title: "Wallet and rewards",
            summary: "Your balance and every reward in one place.",
            where: "Menu → Wallet",
            steps: ["See your available balance.", "Transaction History lists every reward and withdrawal."],
            scene: "s-wallet",
          },
          {
            icon: IndianRupee,
            title: "Withdraw to UPI",
            summary: "Move your earnings to your bank via UPI.",
            where: "Wallet → Withdraw Money",
            steps: [
              "Enter an amount of ₹10 or more.",
              "Enter your UPI ID and submit.",
              "Track the request, its payment reference and any admin note under Withdrawal Requests.",
            ],
            tip: "Requests are usually processed within 24 hours. Double-check your UPI ID.",
            scene: "s-withdraw",
          },
        ],
      },
      {
        name: "Account & help",
        features: [
          {
            icon: UserCog,
            title: "Profile, password and settings",
            summary: "Keep your details and account secure.",
            where: "Profile tab · Menu → Settings",
            steps: [
              "Edit your name, phone and roll number, and add a profile photo.",
              "Change Password updates your password from inside the app.",
              "Forgot it? Tap Forgot Password on the login screen to get a reset link.",
            ],
            scene: "s-settings",
          },
          {
            icon: LifeBuoy,
            title: "Help and support",
            summary: "Reach us on WhatsApp, email or phone.",
            where: "Menu → Help & Support",
            steps: ["Pick WhatsApp, Email or Call Support.", "Browse common problems and quick answers.", "Support hours are listed in the app."],
            scene: "s-settings",
          },
        ],
      },
    ],
  },
  teacher: {
    label: "Teachers",
    frame: "phone",
    groups: [
      {
        name: "Get started",
        features: [
          {
            icon: UserPlus,
            title: "Create a teacher account",
            summary: "Sign up under your institute, with your hotspot name.",
            where: "Open the app → Teacher → Sign up",
            steps: [
              "Choose Teacher and fill in your name, email and phone.",
              "Search for your institute and select it.",
              "Enter your phone's hotspot name exactly as it appears in your hotspot settings.",
              "Set a strong password and submit.",
            ],
            tip: "Students' phones look for this exact hotspot name, so keep it identical, including capital letters.",
            scene: "t-signup",
          },
          {
            icon: Hourglass,
            title: "Get approved",
            summary: "Your HOD or Dean confirms you belong to the institute.",
            where: "Shown after sign-up",
            steps: ["Your request goes to your institute's admin.", "You'll get an email once you're approved.", "Then log in and start creating classes."],
            scene: "t-pending",
          },
          {
            icon: House,
            title: "Your home screen",
            summary: "Today's classes and your teaching stats.",
            where: "Home tab",
            steps: [
              "See today's classes, average attendance and classes held this semester.",
              "Shortcuts: Mark Attendance, Create Class and Download Attendance.",
            ],
            scene: "t-home",
          },
        ],
      },
      {
        name: "Classes",
        features: [
          {
            icon: Hash,
            title: "Create a class",
            summary: "Set the room, days and timing, and get a join code.",
            where: "Classes → +",
            steps: [
              "Enter the class name and room number.",
              "Pick the days it runs and its start and end times.",
              "Save to get a 6-digit class code, and share it with your students.",
            ],
            scene: "t-create",
          },
          {
            icon: Users,
            title: "Approve join requests",
            summary: "Decide who gets into each class.",
            where: "Classes → your class → Pending Requests",
            steps: ["Each request shows the student's name and roll number.", "Tap Approve or Reject.", "Approved students appear under Enrolled Students."],
            scene: "t-requests",
          },
          {
            icon: Archive,
            title: "Manage your classes",
            summary: "Edit, deactivate, reactivate or delete.",
            where: "Classes → ⋮ on a class",
            steps: [
              "Edit Class changes the name, room, days or timing.",
              "Move to Inactive hides a finished class but keeps its records.",
              "Reactivate brings it back. Delete removes it and its attendance for good.",
            ],
            tip: "At the end of a semester, use Inactive instead of Delete so attendance records are kept.",
            scene: "t-classes",
          },
        ],
      },
      {
        name: "Attendance",
        features: [
          {
            icon: Router,
            title: "Smart (hotspot) attendance",
            summary: "Students mark themselves while you teach.",
            where: "Attendance → Smart Attendance → your class",
            steps: [
              "Turn on your phone's hotspot. If it's off, the app offers to open Settings.",
              "Check the hotspot name (SSID) shown on screen.",
              "Tap Enable Attendance. Present Students fills up as students mark.",
              "Tap Disable Attendance to close the session.",
            ],
            tip: "Keep mobile data on while your hotspot is running, so students' phones can reach Present-Me through it.",
            scene: "t-session",
          },
          {
            icon: ClipboardCheck,
            title: "Manual attendance",
            summary: "A one-tap list for days without a hotspot.",
            where: "Attendance → Manual Attendance → your class",
            steps: ["Mark each student Present or Absent.", "Every student needs a mark before you can submit.", "Tap Submit Attendance to save today's record."],
            scene: "t-manual",
          },
          {
            icon: PieChart,
            title: "Track and correct a student",
            summary: "Any student's full record, editable.",
            where: "Classes → your class → a student",
            steps: [
              "See the student's overall percentage and a present/absent chart.",
              "Scroll through their attendance history.",
              "Long-press a date to switch it between Present and Absent.",
            ],
            scene: "t-track",
          },
          {
            icon: FileSpreadsheet,
            title: "Download reports",
            summary: "PDF or Excel, for a month or a custom range.",
            where: "Menu → Download Attendance",
            steps: [
              "Pick the class.",
              "Keep the month, or tap Custom Date Range.",
              "Choose PDF to view, print or share, or Excel for a spreadsheet with roll numbers, attendance and percentages.",
            ],
            scene: "t-report",
          },
        ],
      },
      {
        name: "Notices",
        features: [
          {
            icon: Megaphone,
            title: "Class notices",
            summary: "Message one class, with a priority tag.",
            where: "Menu → Notices → Class Notice → your class",
            steps: ["Tap New Notice and add a title and message.", "Set the priority: Normal, Important or Urgent.", "Send. You can edit or delete it later."],
            scene: "t-notice",
          },
          {
            icon: BellRing,
            title: "General notices",
            summary: "Announcements for every teacher and student.",
            where: "Menu → Notices → General Notice",
            steps: ["Tap New Notice.", "Write the title and message and choose a priority.", "Tap Send to All."],
            scene: "t-general",
          },
        ],
      },
      {
        name: "More",
        features: [
          {
            icon: Library,
            title: "Notes & PYQs",
            summary: "Browse, download and upload study material too.",
            where: "Menu → Notes & PYQ",
            steps: ["Find material by course, department and semester.", "Downloads open offline in the secure viewer.", "Upload your own notes for students."],
            scene: "s-notes",
          },
          {
            icon: UserCog,
            title: "Profile and settings",
            summary: "Your professional details and account.",
            where: "Profile tab · Menu → Settings",
            steps: [
              "Add your employee ID, office location and years of experience.",
              "Upload a profile photo and change your password.",
              "Help & Support connects you to us on WhatsApp, email or phone.",
            ],
            scene: "s-settings",
          },
        ],
      },
    ],
  },
  institute: {
    label: "Institutes",
    frame: "browser",
    groups: [
      {
        name: "Get started",
        features: [
          {
            icon: ShieldCheck,
            title: "Register your institute",
            summary: "Sign up once as Dean, HOD or Class Incharge.",
            where: "This website → Register your institute",
            steps: [
              "Choose your role: Dean, HOD or Class Incharge.",
              "Add your details and your institute's details.",
              "Upload your ID proof (for example, an Aadhaar card).",
              "We verify it and activate your institute.",
            ],
            scene: "a-register",
          },
          {
            icon: Smartphone,
            title: "Invite your teachers",
            summary: "Teachers join from the Android app.",
            where: "Share the Google Play link",
            steps: [
              "Ask teachers to install Present-Me and sign up as Teacher.",
              "They select your institute while signing up.",
              "Their requests appear in your admin panel for approval.",
            ],
            scene: "a-approve",
          },
        ],
      },
      {
        name: "Manage",
        features: [
          {
            icon: BadgeCheck,
            title: "Approve teachers",
            summary: "Only your real staff can create classes.",
            where: "Admin panel → Teachers",
            steps: [
              "Pending teachers are listed with their details.",
              "Approve the ones who belong to your staff, or reject the rest.",
              "You can move a teacher back to pending at any time.",
            ],
            scene: "a-approve",
          },
          {
            icon: LayoutDashboard,
            title: "Institute dashboard",
            summary: "The whole institute at a glance.",
            where: "Admin panel → Dashboard",
            steps: [
              "Total teachers and students, and approvals waiting for you.",
              "Teachers by department and students by semester.",
              "Recent activity across your institute.",
            ],
            scene: "a-dashboard",
          },
          {
            icon: GraduationCap,
            title: "Teachers, classes and students",
            summary: "Look up anyone in seconds.",
            where: "Admin panel → Teachers / Students",
            steps: [
              "Open a teacher to see their classes, hotspot name, students and sessions.",
              "Search students by name, email, phone or roll number, and filter by semester.",
              "Export teacher and student lists to Excel.",
            ],
            scene: "a-students",
          },
        ],
      },
      {
        name: "Reports",
        features: [
          {
            icon: FileSpreadsheet,
            title: "Attendance reports",
            summary: "Any class, any date range, three formats.",
            where: "Admin panel → Attendance",
            steps: [
              "Search or filter classes by teacher.",
              "Pick a range: last 7 or 30 days, this month, last month, all time or custom.",
              "Preview the report, filter to students below 75%, and download it as PDF, Excel or CSV.",
            ],
            scene: "a-report",
          },
        ],
      },
    ],
  },
};

/* ---------- FAQ ---------- */

export const FAQ_TOPICS = ["General", "Students", "Teachers", "Institutes", "Notes & wallet", "Privacy"];

export const FAQS = [
  {
    topic: "General",
    q: "What is Present-Me?",
    a: "An attendance app for colleges. Students mark themselves present from their own phones while connected to the teacher's hotspot, confirmed with their fingerprint. The same app has class notices, notes and PYQs and a rewards wallet, and HODs and Deans manage everything from a web admin panel.",
  },
  {
    topic: "General",
    q: "How does Present-Me stop proxy attendance?",
    a: "A student can only mark attendance while their phone is connected to the teacher's hotspot, which only reaches inside the classroom. Before marking, the app also asks for the phone owner's fingerprint or screen lock. Each student can mark once per class per day.",
  },
  {
    topic: "General",
    q: "Do we need to buy any hardware?",
    a: "No. The teacher's phone hotspot marks the classroom and students use their own Android phones. Admins use any web browser.",
  },
  {
    topic: "General",
    q: "Which devices are supported?",
    a: "Students and teachers use the Android app on Google Play. Institute admins use the web panel on this site, which works in any modern browser.",
  },
  {
    topic: "Students",
    q: "Why does the app ask for location permission?",
    a: "Android only lets apps read the name of the Wi-Fi network you're connected to if location permission is on. Present-Me uses it to check you're on your teacher's hotspot. It doesn't record or share your location.",
  },
  {
    topic: "Students",
    q: "It says “Connect to Teacher Hotspot only”. What should I do?",
    a: "Make sure you've joined your teacher's hotspot, not the college Wi-Fi, and that location is switched on. Then open Mark Attendance again. If it still fails, ask your teacher to check that attendance is enabled for your class.",
  },
  {
    topic: "Students",
    q: "What if my phone has no fingerprint sensor?",
    a: "The app falls back to the phone's own screen lock (PIN, pattern or password), so every student can still verify.",
  },
  {
    topic: "Students",
    q: "How do I join a class?",
    a: "Each class has a 6-digit code. Enter it under Join Class and your teacher approves the request. Until then it shows under Pending Requests, where you can also cancel it.",
  },
  {
    topic: "Students",
    q: "My verification link expired. What now?",
    a: "Links are valid for 24 hours. Try logging in, and the app offers Resend Verification Email so you can get a fresh link.",
  },
  {
    topic: "Teachers",
    q: "Can teachers take attendance without a hotspot?",
    a: "Yes. Manual Attendance lets you mark every student Present or Absent from a list, and you can correct any student's record later by long-pressing the date.",
  },
  {
    topic: "Teachers",
    q: "What hotspot name should I enter?",
    a: "Exactly the name your phone shows in its hotspot settings, including capital letters and spaces. You enter it when you sign up and can check it on the Smart Attendance screen before enabling a session.",
  },
  {
    topic: "Teachers",
    q: "What happens if I delete a class?",
    a: "Deleting removes the class with its attendance records and enrolments for good. At the end of a semester, use Move to Inactive instead. It hides the class but keeps everything, and you can reactivate it later.",
  },
  {
    topic: "Teachers",
    q: "Can we download attendance records?",
    a: "Teachers can download PDF or Excel reports from the app for a month or a custom date range. Admins can export any class from the web panel as PDF, Excel or CSV.",
  },
  {
    topic: "Institutes",
    q: "How does our institute get started?",
    a: "The Dean, HOD or Class Incharge registers the institute here with ID proof. Once we verify it, teachers and students can select your institute when they sign up, and you approve your teachers from the admin panel.",
  },
  {
    topic: "Institutes",
    q: "Why do teachers need approval?",
    a: "So that only real staff of your institute can create classes and take attendance. You stay in control of who teaches under your institute's name.",
  },
  {
    topic: "Notes & wallet",
    q: "How do Notes & PYQ rewards work?",
    a: "Students upload notes or previous-year papers. Each upload is reviewed, and approved ones earn a reward in the in-app wallet. Only complete material qualifies: every paper for the semester, or notes covering the whole subject.",
  },
  {
    topic: "Notes & wallet",
    q: "Which files can I upload?",
    a: "PDF, DOC, DOCX, PPT and PPTX files up to 10 MB.",
  },
  {
    topic: "Notes & wallet",
    q: "How do withdrawals work?",
    a: "Enter an amount of ₹10 or more and your UPI ID in the wallet. Requests are usually processed within 24 hours, and you can follow their status, payment reference and any admin note in the app.",
  },
  {
    topic: "Privacy",
    q: "Does Present-Me store my fingerprint?",
    a: "No. Android checks your fingerprint or screen lock on the phone itself. Present-Me only learns whether the check passed.",
  },
  {
    topic: "Privacy",
    q: "Can I delete my account?",
    a: "Yes. Delete it from Settings in the app or from the Delete account page on this site. Your account and data are removed within 30 days.",
    link: ["/delete_account", "Go to Delete account"],
  },
];
