import { useState } from "react";
import React from "react";
import { BaseUrl } from "../../utils/constants";
import axios from "axios";

export default function DeleteAccount() {
  const [email, setEmail]     = useState("");
  const [reason, setReason]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        BaseUrl + "/delete-request", 
        {
        email,
        reason
      });
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please email us at support@presentme.in");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Request Submitted</h2>
          <p style={styles.successText}>
            We have received your account deletion request. Your account and
            all associated data will be permanently deleted within{" "}
            <strong>30 days</strong>. You will receive a confirmation email at{" "}
            <strong>{email}</strong>.
          </p>
          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              🔒 What will be deleted: Profile data, attendance records,
              uploaded notes, class history, and all personal information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.warningIcon}>⚠️</div>
          <h1 style={styles.title}>Delete Your Account</h1>
          <p style={styles.subtitle}>
            This action is <strong>permanent and irreversible</strong>. All
            your data will be deleted within 30 days of your request.
          </p>
        </div>

        {/* What gets deleted */}
        <div style={styles.infoBox}>
          <p style={styles.infoLabel}>Data that will be permanently deleted:</p>
          {[
            "Profile information (name, email, phone, photo)",
            "Attendance records",
            "Uploaded notes and PYQs",
            "Class history and enrollments",
            "All account credentials",
          ].map((item) => (
            <div key={item} style={styles.infoItem}>
              <span style={styles.dot} />
              <span style={styles.infoText}>{item}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Registered Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={styles.input}
          />

          <label style={styles.label}>Reason (optional)</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.input}
          >
            <option value="">Select a reason</option>
            <option value="no_longer_using">No longer using the app</option>
            <option value="privacy_concerns">Privacy concerns</option>
            <option value="switching_institution">Switching institution</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.btnDisabled : styles.btn}
          >
            {loading ? "Submitting..." : "Submit Deletion Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f0f6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "2.5rem",
    maxWidth: "520px",
    width: "100%",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
  },
  header: { textAlign: "center", marginBottom: "1.5rem" },
  warningIcon: { fontSize: "2.5rem", marginBottom: "1rem" },
  title: { fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" },
  subtitle: { fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6 },
  infoBox: {
    background: "#fff8f0",
    border: "1px solid #fed7aa",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    marginBottom: "1.5rem",
  },
  infoLabel: { fontSize: "0.8rem", fontWeight: 700, color: "#92400e", marginBottom: "0.5rem" },
  infoItem: { display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.3rem" },
  dot: { width: "5px", height: "5px", borderRadius: "50%", background: "#f97316", marginTop: "6px", flexShrink: 0 },
  infoText: { fontSize: "0.82rem", color: "#78350f" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#475569" },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.9rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: "none",
    background: "#f8fafc",
    color: "#0f172a",
  },
  btn: {
    padding: "0.875rem",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
    marginTop: "0.5rem",
  },
  btnDisabled: {
    padding: "0.875rem",
    background: "#cbd5e1",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "not-allowed",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    marginTop: "0.5rem",
  },
  footer: { textAlign: "center", fontSize: "0.8rem", color: "#94a3b8", marginTop: "1.25rem" },
  link: { color: "#0A80F5", textDecoration: "none", fontWeight: 600 },
  successIcon: {
    width: "64px", height: "64px", borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.75rem", color: "#fff", margin: "0 auto 1.25rem",
  },
  successTitle: { fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", textAlign: "center", marginBottom: "0.75rem" },
  successText: { fontSize: "0.9rem", color: "#64748b", lineHeight: 1.7, textAlign: "center", marginBottom: "1rem" },
};