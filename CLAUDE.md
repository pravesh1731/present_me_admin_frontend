# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npm run present` — start the Vite dev server (note: the dev script is named `present`, not `dev`)
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run preview` — serve the built bundle

There is no test runner configured.

## Architecture

Admin web frontend for "Present Me" (attendance management): React 19 + Vite 7, Tailwind CSS 4 (via `@tailwindcss/vite`) with DaisyUI, Redux Toolkit, React Router 7 (`createBrowserRouter`), axios. Plain JavaScript/JSX, no TypeScript.

- **Routing** — all routes are defined in `src/App.jsx`. Public pages (landing `/`, `/signin`, `/signup`, `/forget_password`, `/pending_verification`, `/privacy-policy`, `/delete_account`) are top-level; the authenticated area lives under `/admin` where `components/header/Header.jsx` is the layout element and renders child pages (Dashboard, TeacherList, StudentList, DownloadAttendance, Profile) via the router outlet. Page components live in `src/Pages/<feature>/` (folder names are inconsistent, e.g. `froget_password`, `Present-Me landingPage`).
- **State** — Redux store in `src/utils/appstore.js` with three slices in `src/utils/`: `userSlice`, `teacherSlice`, `studentSlice` (despite the folder name, slices live in `utils`, not a `store/` dir).
- **Data fetching** — `src/customHooks/useStudentData.js` / `useTeacherData.js` export both a plain `fetchXList(dispatch)` function (throws on failure, for callers that want to show errors/refresh) and a hook that loads the list into Redux on mount.
- **API** — `BaseUrl` in `src/utils/constants.jsx` is `http://localhost:2000` when served from `localhost`, otherwise `/api` (expects a reverse proxy in production; Vite config has no dev proxy). Auth is cookie-based, so axios calls must pass `withCredentials: true`. Endpoints are under `/admin/...`.
- **Exports** — attendance reports are generated client-side with `jspdf`/`jspdf-autotable` and `xlsx` (see `src/utils/attendanceReport.js` and `Pages/home/DownloadAttendance.jsx`).
- **Shared UI** — `src/components/common` (Avatar, Brand, buttons, svg), sidebar nav config in `src/components/sidebar/nav.js`, branding constants in `src/utils/brand.js`.
