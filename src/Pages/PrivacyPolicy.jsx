import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import logo from "../assets/image.png";

const sections = [
  {
    id: "overview",
    num: "01",
    title: "Overview",
    icon: "◈",
    content: `PresentMe is an educational platform designed for institutes, enabling interaction between teachers and students. The app provides features such as user registration and profile management (Teacher & Student roles), class creation and joining via class codes, smart attendance system using hotspot-based verification and biometric authentication, attendance tracking and report generation (PDF/Excel), notice system (General and Class-specific), and Notes and Previous Year Questions (PYQs) sharing system.`,
  },
  {
    id: "information",
    num: "02",
    title: "Information We Collect",
    icon: "◉",
    subsections: [
      {
        label: "Teachers",
        items: ["Full name", "Phone number", "Email address", "Institute/College name", "Hotspot name", "Office location", "Department", "Specialization", "Qualification", "Years of experience", "Employee ID", "Profile picture"],
      },
      {
        label: "Students",
        items: ["Full name", "Email address", "Institute name", "Roll number", "Phone number", "Semester", "Branch", "Year", "Section"],
      },
    ],
  },
  {
    id: "biometric",
    num: "03",
    title: "Biometric Authentication",
    icon: "◎",
    highlight: true,
    highlightText: "We do NOT collect, store, or transmit any biometric data.",
    content: `PresentMe uses fingerprint authentication to ensure secure and accurate attendance marking. Fingerprint authentication is used only at the time of attendance submission. Authentication is handled entirely by your device's secure system (Android/iOS biometric framework). PresentMe only receives a confirmation (success/failure), not the fingerprint data itself.`,
  },
  {
    id: "network",
    num: "04",
    title: "Network-Based Attendance",
    icon: "◐",
    highlight: true,
    highlightText: "We do NOT track GPS location or continuously monitor network activity.",
    content: `To prevent proxy attendance, the app verifies whether a student is connected to the teacher's hotspot during an active attendance session. Attendance can only be marked when the teacher has started a session, the student is connected to the teacher's hotspot network, and fingerprint authentication is successfully completed. This ensures physical proximity to the classroom and identity verification of the student.`,
  },
  {
    id: "usage",
    num: "05",
    title: "How We Use Your Information",
    icon: "◇",
    list: [
      "Account creation and authentication",
      "Profile management",
      "Class creation and joining",
      "Attendance recording and validation",
      "Attendance report generation (PDF/Excel)",
      "Deliver notices (general and class-specific)",
      "Enable sharing and accessing notes and PYQs",
      "Monitor performance and fix bugs",
      "Prevent fraud, misuse, or unauthorized access",
    ],
  },
  {
    id: "sharing",
    num: "06",
    title: "Data Sharing & Visibility",
    icon: "◈",
    content: `We respect your privacy and do not sell or rent your data. Data may be visible to teachers (attendance, class data, student lists), students (their own attendance, notices, shared content), and users within the same institute (notes, PYQs, general notices). We may share data with secure backend/cloud service providers, when legally required, or to protect platform integrity and user safety.`,
  },
  {
    id: "security",
    num: "07",
    title: "Data Storage & Security",
    icon: "◉",
    highlight: true,
    highlightText: "Biometric data is NEVER stored on our servers.",
    content: `We implement industry-standard security measures including secure authentication systems, encrypted data transmission (HTTPS), and controlled access to user data. Sensitive actions require authentication. Despite our efforts, no system is 100% secure, so we encourage users to keep their credentials safe.`,
  },
  {
    id: "permissions",
    num: "08",
    title: "Permissions We Request",
    icon: "◎",
    list: [
      "Internet Access – for app functionality",
      "WiFi/Network Access – for hotspot-based attendance verification",
      "Storage Access – for file uploads/downloads",
      "Camera/Gallery Access – for profile images",
      "Biometric Permission – for secure attendance authentication",
    ],
  },
  {
    id: "rights",
    num: "09",
    title: "Your Rights",
    icon: "◐",
    list: [
      "Access and review your data",
      "Update or correct information",
      "Request deletion of your account",
      "Revoke permissions anytime",
    ],
  },
  {
    id: "children",
    num: "10",
    title: "Children's Privacy",
    icon: "◇",
    content: `PresentMe is intended for educational institutions and is not designed for children under 13. We do not knowingly collect data from minors without proper authorization.`,
  },
  {
    id: "changes",
    num: "11",
    title: "Changes to This Policy",
    icon: "◈",
    content: `We may update this Privacy Policy periodically. Updates will be reflected by changing the Effective Date. We recommend reviewing this page regularly.`,
  },
  {
    id: "contact",
    num: "12",
    title: "Contact Us",
    icon: "◉",
    isContact: true,
    content: `If you have any questions, concerns, or requests regarding your privacy, reach out to us.`,
    contactEmail: "support@presentme.in",
  },
];

function useIntersection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function Section({ section, index }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  return (
    <div
      ref={ref}
      id={section.id}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${index * 0.05}s, transform 0.65s ease ${index * 0.05}s`,
        marginBottom: "2.5rem",
        background: "#fff",
        borderRadius: "20px",
        padding: "2.25rem 2.5rem",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, #0BCCEB, #0A80F5)",
        borderRadius: "20px 20px 0 0",
      }} />

      {/* Section number + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "#0A80F5",
          background: "linear-gradient(135deg, rgba(11,204,235,0.08), rgba(10,128,245,0.08))",
          border: "1px solid rgba(10,128,245,0.15)",
          borderRadius: "8px",
          padding: "4px 10px",
          letterSpacing: "0.05em",
        }}>
          {section.num}
        </div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "#0f172a",
          margin: 0,
          letterSpacing: "-0.01em",
        }}>
          {section.title}
        </h2>
      </div>

      {/* Highlight box */}
      {section.highlight && (
        <div style={{
          background: "linear-gradient(135deg, rgba(11,204,235,0.06), rgba(10,128,245,0.06))",
          border: "1px solid rgba(10,128,245,0.2)",
          borderRadius: "12px",
          padding: "0.875rem 1.25rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <span style={{ fontSize: "1.1rem" }}>🔒</span>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "#0A80F5",
            margin: 0,
          }}>
            {section.highlightText}
          </p>
        </div>
      )}

      {/* Subsections (Teachers / Students) */}
      {section.subsections && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.5rem" }}>
          {section.subsections.map((sub) => (
            <div key={sub.label} style={{
              background: "#f8faff",
              borderRadius: "14px",
              padding: "1.25rem",
              border: "1px solid #eef2ff",
            }}>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#0A80F5",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 0.875rem",
              }}>{sub.label}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {sub.items.map((item) => (
                  <li key={item} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    fontSize: "0.825rem", color: "#475569",
                    marginBottom: "0.45rem",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0BCCEB", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Body text */}
      {section.content && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.9rem",
          lineHeight: 1.8,
          color: "#475569",
          margin: 0,
        }}>
          {section.content}
        </p>
      )}

      {/* List */}
      {section.list && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {section.list.map((item, i) => (
            <li key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "0.75rem",
              padding: "0.6rem 0",
              borderBottom: i < section.list.length - 1 ? "1px solid #f1f5f9" : "none",
            }}>
              <span style={{
                width: "22px", height: "22px", borderRadius: "6px",
                background: "linear-gradient(135deg, #0BCCEB, #0A80F5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: "1px",
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Contact */}
      {section.isContact && (
        <a
          href={`mailto:${section.contactEmail}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.625rem",
            marginTop: "1rem",
            background: "linear-gradient(135deg, #0BCCEB, #0A80F5)",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 700,
            boxShadow: "0 4px 16px rgba(10,128,245,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(10,128,245,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(10,128,245,0.3)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {section.contactEmail}
        </a>
      )}
    </div>
  );
}

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("overview");
 
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const onScroll = () => {
      

      sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) setActiveSection(s.id);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f8faff; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#0BCCEB, #0A80F5); border-radius: 3px; }
        @media (max-width: 768px) {
          .layout { flex-direction: column !important; }
          .sidebar { display: none; }
          .sidebar.open { display: flex !important; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 200; background: rgba(255,255,255,0.97); flex-direction: column; padding: 5rem 2rem 2rem; overflow-y: auto; }
          .subsections-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>


      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(248,250,255,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(10,128,245,0.1)",
        padding: "0 2rem",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
             >
              <motion.div
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg p-0.5 overflow-hidden relative"
                animate={{
                  boxShadow: [
                    "0 10px 15px -3px rgba(11, 204, 235, 0.3)",
                    "0 10px 15px -3px rgba(10, 128, 245, 0.3)",
                    "0 10px 15px -3px rgba(11, 204, 235, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src={logo}
                  alt="Present-Me Logo"
                  className="w-full h-full object-cover scale-110"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent">
                  PRESENT-ME
                </span>
                {/* <span className="text-gray-400">-ME</span> */}
              </span>
            </motion.div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#94a3b8" }}>Privacy Policy</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "1px solid #e2e8f0", borderRadius: "8px",
              padding: "6px 10px", cursor: "pointer", color: "#475569",
              display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem",
              fontFamily: "'DM Sans', sans-serif",
            }}
            className="mobile-menu-btn"
          >
            ☰ Sections
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        padding: "5rem 2rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(11,204,235,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(10,128,245,0.12) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(11,204,235,0.1)", border: "1px solid rgba(11,204,235,0.3)",
            borderRadius: "100px", padding: "0.375rem 1rem", marginBottom: "1.5rem",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0BCCEB", display: "block" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#0BCCEB", letterSpacing: "0.1em" }}>
              EFFECTIVE DATE — 2025
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}>
            Privacy <span style={{ background: "linear-gradient(90deg, #0BCCEB, #0A80F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Policy</span>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 2rem",
          }}>
            PresentMe is committed to protecting your privacy and ensuring full transparency in how your information is handled.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {["12 Sections", "Biometric Safe", "No Data Selling"].map(tag => (
              <span key={tag} style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "4px 12px",
                letterSpacing: "0.05em",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="layout" style={{ display: "flex", maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem", gap: "2.5rem", alignItems: "flex-start" }}>

        {/* Sidebar */}
        <aside className={`sidebar ${menuOpen ? "open" : ""}`} style={{
          width: "260px", flexShrink: 0, position: "sticky", top: "80px",
          background: "#fff", borderRadius: "20px",
          border: "1px solid #f0f0f0", padding: "1.5rem",
          boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            color: "#94a3b8",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>Contents</p>
          <nav>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.625rem",
                  width: "100%", textAlign: "left",
                  background: activeSection === s.id
                    ? "linear-gradient(135deg, rgba(11,204,235,0.08), rgba(10,128,245,0.08))"
                    : "transparent",
                  border: "none",
                  borderLeft: activeSection === s.id ? "2px solid #0A80F5" : "2px solid transparent",
                  borderRadius: "0 8px 8px 0",
                  padding: "0.55rem 0.75rem",
                  cursor: "pointer",
                  marginBottom: "2px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.background = "#f8faff"; }}
                onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  color: activeSection === s.id ? "#0A80F5" : "#cbd5e1",
                  minWidth: "22px",
                }}>{s.num}</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: activeSection === s.id ? 600 : 400,
                  color: activeSection === s.id ? "#0A80F5" : "#64748b",
                }}>{s.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {sections.map((section, i) => (
            <Section key={section.id} section={section} index={i} />
          ))}

          {/* Consent footer */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
            borderRadius: "20px",
            padding: "2.5rem",
            textAlign: "center",
            color: "#fff",
            marginTop: "1rem",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg, #0BCCEB, #0A80F5)",
              margin: "0 auto 1.25rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              Your Privacy, Our Commitment
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 1.5rem" }}>
              By using PresentMe, you agree to this Privacy Policy and consent to the collection and use of your information as described. You acknowledge the use of hotspot-based and biometric attendance verification.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href="mailto:support@presentme.in" style={{
                background: "linear-gradient(135deg, #0BCCEB, #0A80F5)",
                color: "#fff", textDecoration: "none",
                padding: "0.75rem 1.75rem", borderRadius: "12px",
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.875rem",
                boxShadow: "0 4px 16px rgba(10,128,245,0.4)",
              }}>Contact Us</a>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: "center", padding: "2rem",
        borderTop: "1px solid #f1f5f9",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        color: "#94a3b8",
        letterSpacing: "0.05em",
      }}>
        © 2025 PRESENT-ME — ALL RIGHTS RESERVED
      </footer>
    </>
  );
}
