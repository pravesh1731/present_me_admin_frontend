import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Mail, Phone, Printer } from "lucide-react";
import { BrandMark } from "../components/common/Brand";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "./Present-Me landingPage/landingContent";

const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
// Change this whenever the wording of the policy changes (section 11 promises it)
const EFFECTIVE_DATE = "1 April 2026";

/* ---------- small building blocks ---------- */

const P = ({ children }) => <p className="text-[15px] leading-7 text-slate-600">{children}</p>;

const Note = ({ children }) => <p className="border-l-2 border-[#0A80F5] pl-4 text-[15px] font-semibold leading-7 text-[#0B1B34]">{children}</p>;

const List = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3 text-[15px] leading-7 text-slate-600">
        <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[#0A80F5] shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Term = ({ children }) => <span className="font-semibold text-[#0B1B34]">{children}</span>;

/* ---------- the policy ---------- */

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <>
        <P>
          PresentMe is an educational platform designed for institutes, enabling interaction between teachers and students. The app provides features such as:
        </P>
        <List
          items={[
            "User registration and profile management (Teacher & Student roles)",
            "Class creation and joining via class codes",
            "Smart attendance system using hotspot-based verification and biometric authentication",
            "Attendance tracking and report generation (PDF/Excel)",
            "Notice system (General and Class-specific)",
            "Notes and Previous Year Questions (PYQs) sharing system",
          ]}
        />
      </>
    ),
  },
  {
    id: "information",
    title: "Information we collect",
    body: (
      <div className="grid sm:grid-cols-2 gap-6">
        {[
          ["Teachers", ["Full name", "Phone number", "Email address", "Institute/College name", "Hotspot name", "Office location", "Department", "Specialization", "Qualification", "Years of experience", "Employee ID", "Profile picture"]],
          ["Students", ["Full name", "Email address", "Institute name", "Roll number", "Phone number", "Semester", "Branch", "Year", "Section"]],
        ].map(([label, items]) => (
          <div key={label}>
            <h3 className="mb-2 text-sm font-bold text-[#0B1B34]">{label}</h3>
            <List items={items} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "biometric",
    title: "Biometric authentication",
    body: (
      <>
        <Note>We do NOT collect, store, or transmit any biometric data.</Note>
        <P>
          PresentMe uses fingerprint authentication to ensure secure and accurate attendance marking. Fingerprint authentication is used only at the time of
          attendance submission. Authentication is handled entirely by your device's secure system (Android/iOS biometric framework). PresentMe only receives a
          confirmation (success/failure), not the fingerprint data itself.
        </P>
      </>
    ),
  },
  {
    id: "network",
    title: "Network-based attendance",
    body: (
      <>
        <Note>We do NOT track GPS location or continuously monitor network activity.</Note>
        <P>
          To prevent proxy attendance, the app verifies whether a student is connected to the teacher's hotspot during an active attendance session. Attendance can
          only be marked when:
        </P>
        <List
          items={[
            "The teacher has started a session",
            "The student is connected to the teacher's hotspot network",
            "Fingerprint authentication is successfully completed",
          ]}
        />
        <P>This ensures physical proximity to the classroom and identity verification of the student.</P>
      </>
    ),
  },
  {
    id: "usage",
    title: "How we use your information",
    body: (
      <List
        items={[
          "Account creation and authentication",
          "Profile management",
          "Class creation and joining",
          "Attendance recording and validation",
          "Attendance report generation (PDF/Excel)",
          "Deliver notices (general and class-specific)",
          "Enable sharing and accessing notes and PYQs",
          "Monitor performance and fix bugs",
          "Prevent fraud, misuse, or unauthorized access",
        ]}
      />
    ),
  },
  {
    id: "sharing",
    title: "Data sharing & visibility",
    body: (
      <>
        <Note>We respect your privacy and do not sell or rent your data.</Note>
        <P>Data may be visible to:</P>
        <List
          items={[
            <><Term>Teachers</Term>: attendance, class data, student lists</>,
            <><Term>Students</Term>: their own attendance, notices, shared content</>,
            <><Term>Users within the same institute</Term>: notes, PYQs, general notices</>,
          ]}
        />
        <P>We may share data with secure backend/cloud service providers, when legally required, or to protect platform integrity and user safety.</P>
      </>
    ),
  },
  {
    id: "security",
    title: "Data storage & security",
    body: (
      <>
        <Note>Biometric data is NEVER stored on our servers.</Note>
        <P>
          We implement industry-standard security measures including secure authentication systems, encrypted data transmission (HTTPS), and controlled access to
          user data. Sensitive actions require authentication. Despite our efforts, no system is 100% secure, so we encourage users to keep their credentials safe.
        </P>
      </>
    ),
  },
  {
    id: "permissions",
    title: "Permissions we request",
    body: (
      <List
        items={[
          <><Term>Internet Access</Term>: for app functionality</>,
          <><Term>WiFi/Network Access</Term>: for hotspot-based attendance verification</>,
          <><Term>Storage Access</Term>: for file uploads/downloads</>,
          <><Term>Camera/Gallery Access</Term>: for profile images</>,
          <><Term>Biometric Permission</Term>: for secure attendance authentication</>,
        ]}
      />
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <List
        items={[
          "Access and review your data",
          "Update or correct information",
          <>
            Request deletion of your account (
            <Link to="/delete_account" className="font-semibold text-[#0A80F5] hover:underline">
              delete account page
            </Link>
            )
          </>,
          "Revoke permissions anytime",
        ]}
      />
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    body: (
      <P>
        PresentMe is intended for educational institutions and is not designed for children under 13. We do not knowingly collect data from minors without proper
        authorization.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        We may update this Privacy Policy periodically. Updates will be reflected by changing the Effective Date. We recommend reviewing this page regularly.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <P>If you have any questions, concerns, or requests regarding your privacy, reach out to us.</P>
        <div className="flex flex-col sm:flex-row gap-x-8 gap-y-2 text-[15px]">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 font-semibold text-[#0A80F5] hover:underline">
            <Mail className="w-4 h-4" /> {SUPPORT_EMAIL}
          </a>
          <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 font-semibold text-[#0A80F5] hover:underline">
            <Phone className="w-4 h-4" /> {SUPPORT_PHONE}
          </a>
        </div>
      </>
    ),
  },
];

/* ---------- page ---------- */

const PrivacyPolicy = () => {
  const [active, setActive] = useState(SECTIONS[0].id);

  // Open at the linked section if the URL has one, otherwise at the top
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && document.getElementById(id)) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    } else {
      window.scrollTo({ top: 0 });
    }
  }, []);

  // Highlight the section being read in the contents list
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = SECTIONS[0].id;
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= 120) current = s.id;
        }
        // the last sections are short, so reaching the bottom counts as reading them
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = SECTIONS[SECTIONS.length - 1].id;
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-slate-800 antialiased" style={FONT}>
      <header className="sticky top-0 z-40 bg-[#F7FAFF]/90 backdrop-blur-xl border-b border-slate-200/70 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <BrandMark tone="light" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#0B1B34]">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* title */}
        <div className="pt-12 sm:pt-16 pb-8 border-b border-slate-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1B34]">Privacy policy</h1>
          <p className="mt-3 max-w-2xl text-slate-600 leading-7">
            PresentMe is committed to protecting your privacy and ensuring full transparency in how your information is handled.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>Effective {EFFECTIVE_DATE}</span>
            <span className="text-slate-300 print:hidden">·</span>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 hover:text-[#0A80F5] print:hidden">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

        <div className="py-10 grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-12">
          {/* contents */}
          <nav className="print:hidden" aria-label="Contents">
            {/* phones: collapsed list */}
            <details className="lg:hidden group rounded-xl bg-white ring-1 ring-slate-200">
              <summary className="flex items-center justify-between px-4 py-3 text-sm font-bold text-[#0B1B34] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                Contents
                <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <ol className="px-4 pb-3 space-y-1">
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} onClick={(e) => goTo(e, s.id)} className="flex gap-3 py-1 text-sm text-slate-600 hover:text-[#0A80F5]">
                      <span className="w-5 tabular-nums text-slate-400">{i + 1}.</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            {/* desktop: sticky list */}
            <ol className="hidden lg:block sticky top-24 border-l border-slate-200">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => goTo(e, s.id)}
                    className={`-ml-px block border-l-2 pl-4 py-1.5 text-sm transition ${
                      s.id === active ? "border-[#0A80F5] font-semibold text-[#0A80F5]" : "border-transparent text-slate-500 hover:text-[#0B1B34]"
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 max-w-3xl">
            {SECTIONS.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 pb-10 mb-10 border-b border-slate-200 last:border-0 last:mb-0">
                <h2 className="text-xl font-extrabold tracking-tight text-[#0B1B34]">
                  <span className="mr-2 text-[#0A80F5]">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4">{s.body}</div>
              </section>
            ))}

            <p className="rounded-xl bg-white ring-1 ring-slate-200 p-5 text-sm leading-6 text-slate-600">
              By using PresentMe, you agree to this Privacy Policy and consent to the collection and use of your information as described. You acknowledge the use of
              hotspot-based and biometric attendance verification.
            </p>
          </article>
        </div>
      </div>

      <footer className="border-t border-slate-200/80 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Present-Me</span>
          <span className="flex items-center gap-4">
            <Link to="/" className="hover:text-[#0B1B34]">
              Home
            </Link>
            <Link to="/delete_account" className="hover:text-[#0B1B34]">
              Delete account
            </Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#0B1B34]">
              {SUPPORT_EMAIL}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
