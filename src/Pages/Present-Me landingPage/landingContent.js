// Everything the landing page says lives here, so copy can be edited without touching layout.

// The Play Store link lives with the shared brand components so every page uses the same one
export { PLAY_STORE_URL } from "../../utils/brand";
export const SUPPORT_EMAIL = "support@presentme.in";
export const SUPPORT_PHONE = "+91 7007458210";
export const LOCATION = "Gorakhpur, Uttar Pradesh, India";

/*
 * Walkthrough videos.
 * Paste a YouTube video ID (the part after "v=" in the URL) into `youtubeId` and the
 * player shows that video. While it's empty, the player runs an interactive walkthrough
 * built from the app screens listed in `scenes`.
 */
export const VIDEOS = [
  {
    id: "student",
    audience: "Students",
    title: "Marking attendance in class",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "s-join", caption: "Join your class with the 6-character code your teacher shares." },
      { scene: "s-hotspot", caption: "When class starts, connect to your teacher's hotspot. The app detects it on its own." },
      { scene: "s-verify", caption: "Confirm it's you with your fingerprint or phone lock." },
      { scene: "s-marked", caption: "You're marked present. Your teacher sees it immediately." },
      { scene: "s-stats", caption: "Track your attendance for every class, any time." },
    ],
  },
  {
    id: "teacher",
    audience: "Teachers",
    title: "Running a smart attendance session",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "t-create", caption: "Create a class with its room, days and timing. You get a class code to share." },
      { scene: "t-requests", caption: "Approve the students who ask to join." },
      { scene: "t-session", caption: "Turn on your hotspot and start the session. Watch students mark in live." },
      { scene: "t-manual", caption: "No hotspot? Mark attendance by hand or fix a record afterwards." },
      { scene: "t-report", caption: "Download attendance as PDF, Excel or CSV." },
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
      { scene: "a-approve", caption: "Approve teachers who sign up under your institute." },
      { scene: "a-dashboard", caption: "See teachers, students and classes across the institute." },
      { scene: "a-report", caption: "Export any class's attendance for any date range." },
    ],
  },
  {
    id: "notes",
    audience: "Students",
    title: "Notes, PYQs and rewards",
    youtubeId: "",
    frame: "phone",
    scenes: [
      { scene: "s-notes", caption: "Browse notes and previous-year papers. Download them to read offline." },
      { scene: "s-wallet", caption: "Upload your own. Approved uploads earn rewards you can withdraw to UPI." },
    ],
  },
];

export const GUIDES = {
  student: {
    label: "Student",
    frame: "phone",
    cta: "store",
    steps: [
      {
        title: "Download the app and sign up",
        text: "Install Present-Me from Google Play, choose your college from the list and verify your email.",
        scene: "s-signup",
      },
      {
        title: "Join your classes",
        text: "Enter the class code your teacher gives you. You're in once the teacher approves your request.",
        scene: "s-join",
      },
      {
        title: "Connect to the class hotspot",
        text: "When your teacher starts attendance, turn on Wi-Fi and join their hotspot. The app checks the connection for you.",
        scene: "s-hotspot",
      },
      {
        title: "Verify and you're present",
        text: "Tap Mark attendance and confirm with your fingerprint or screen lock. That's it.",
        scene: "s-verify",
      },
      {
        title: "Keep an eye on your percentage",
        text: "See attendance for each class, read notices and download notes and PYQs.",
        scene: "s-stats",
      },
    ],
  },
  teacher: {
    label: "Teacher",
    frame: "phone",
    cta: "store",
    steps: [
      {
        title: "Sign up under your institute",
        text: "Create a teacher account and pick your institute. Your HOD or Dean approves it from the admin panel.",
        scene: "t-pending",
      },
      {
        title: "Create a class",
        text: "Add the class name, room, days and timing. Share the class code it generates with your students.",
        scene: "t-create",
      },
      {
        title: "Approve join requests",
        text: "Students request to join with the code. Approve them in one tap.",
        scene: "t-requests",
      },
      {
        title: "Start attendance",
        text: "Turn on your phone's hotspot and start a smart session, or switch to manual attendance.",
        scene: "t-session",
      },
      {
        title: "Share notices and download reports",
        text: "Post notices to a class and export attendance as PDF, Excel or CSV.",
        scene: "t-report",
      },
    ],
  },
  institute: {
    label: "Institute",
    frame: "browser",
    cta: "admin",
    steps: [
      {
        title: "Register your institute",
        text: "Sign up on this website as HOD or Dean and upload your ID proof. We verify every institute before activating it.",
        scene: "a-register",
      },
      {
        title: "Approve your teachers",
        text: "Teachers who choose your institute appear in the admin panel. Approve the ones who belong to your staff.",
        scene: "a-approve",
      },
      {
        title: "Monitor the whole institute",
        text: "See every teacher, student and class, with attendance for each, in one dashboard.",
        scene: "a-dashboard",
      },
      {
        title: "Export attendance reports",
        text: "Download any class's attendance for any date range as PDF, Excel or CSV.",
        scene: "a-report",
      },
    ],
  },
};

export const FAQS = [
  {
    q: "How does Present-Me stop proxy attendance?",
    a: "A student can only mark attendance while their phone is connected to the teacher's hotspot, which only works inside the classroom. Before marking, the app also asks for the phone owner's fingerprint or screen lock.",
  },
  {
    q: "What if a student's phone has no fingerprint sensor?",
    a: "The app falls back to the phone's own screen lock (PIN, pattern or password), so every student can still verify.",
  },
  {
    q: "Can teachers take attendance without a hotspot?",
    a: "Yes. Teachers can switch to manual attendance at any time, and can correct a student's record after a session.",
  },
  {
    q: "Which devices are supported?",
    a: "Students and teachers use the Android app on Google Play. Institute admins use the web panel on this site, which works in any modern browser.",
  },
  {
    q: "How does our institute get started?",
    a: "The HOD or Dean registers the institute here with ID proof. Once we verify it, teachers and students can select your institute when they sign up, and you approve your teachers from the admin panel.",
  },
  {
    q: "How do students join a class?",
    a: "Each class has a 6-character code. Students enter it in the app and the teacher approves their request.",
  },
  {
    q: "Can we download attendance records?",
    a: "Teachers can export from the app. Admins can export any class from the web panel for any date range. Both support PDF, Excel and CSV.",
  },
  {
    q: "How do Notes & PYQ rewards work?",
    a: "Students can upload notes and previous-year papers. Uploads are reviewed, and approved ones earn a reward in the in-app wallet that can be withdrawn to UPI from ₹10.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. You can request deletion of your account and data at any time from the Delete account page.",
  },
];
