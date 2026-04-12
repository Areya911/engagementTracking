import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const { token, role, ...rest } = res.data;
      localStorage.setItem("token", token);
      setUser({ ...rest, role, token });
      navigate(role === "admin" ? "/admin" : "/user/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (!err.response) {
        setError("Cannot connect to server. Please try again later.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>📚</div>
            <span style={styles.logoText}>EduTrack</span>
          </div>
          <h1 style={styles.heroTitle}>
            Student Engagement<br />
            <span style={styles.heroAccent}>Intelligence Platform</span>
          </h1>
          <p style={styles.heroSub}>
            Track, analyze, and improve student engagement with real-time analytics,
            risk detection, and smart notifications.
          </p>

          <div style={styles.featureList}>
            {[
              { icon: "📊", text: "Real-time engagement analytics" },
              { icon: "🎯", text: "Risk detection & smart alerts" },
              { icon: "🎓", text: "Course progress tracking" },
              { icon: "🏆", text: "Activity & attendance management" },
            ].map((f, i) => (
              <div key={i} style={styles.featureRow}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div style={{ ...styles.circle, width: 300, height: 300, top: -80, right: -80, opacity: 0.08 }} />
        <div style={{ ...styles.circle, width: 200, height: 200, bottom: 60, right: 40, opacity: 0.06 }} />
      </div>

      {/* RIGHT PANEL – FORM */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Welcome back</h2>
          <p style={styles.formSub}>Sign in to your EduTrack account</p>

          {error && (
            <div style={styles.errorBox}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@university.edu"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={styles.divider} />

          <div style={styles.demoHint}>
            <strong>Demo Credentials</strong><br />
            <span style={{ color: "#7c3aed" }}>Admin:</span> admin@edu.in / admin123<br />
            <span style={{ color: "#0ea5e9" }}>Student:</span> kavya@edu.in / student123
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(140deg, #1e1b4b, #312e81, #4c1d95)",
    color: "white",
    padding: "60px 56px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  leftContent: { position: "relative", zIndex: 2 },
  logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 48 },
  logoIcon: {
    fontSize: 32,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    width: 52,
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" },
  heroTitle: {
    fontSize: "clamp(28px, 3vw, 42px)",
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: 18,
    letterSpacing: "-0.5px",
  },
  heroAccent: {
    background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: { fontSize: 15, opacity: 0.75, lineHeight: 1.6, maxWidth: 440, marginBottom: 40 },
  featureList: { display: "flex", flexDirection: "column", gap: 14 },
  featureRow: { display: "flex", alignItems: "center", gap: 12 },
  featureIcon: {
    fontSize: 20,
    width: 40,
    height: 40,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { fontSize: 14.5, opacity: 0.88 },
  circle: {
    position: "absolute",
    borderRadius: "50%",
    background: "white",
  },
  rightPanel: {
    width: "42%",
    minWidth: 400,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  formCard: {
    background: "white",
    borderRadius: 24,
    padding: "44px 40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: 6,
  },
  formSub: { fontSize: 14, color: "#64748b", marginBottom: 28 },
  errorBox: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13.5,
    marginBottom: 18,
  },
  fieldGroup: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "inherit",
    color: "#1e293b",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 8,
    boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
    transition: "opacity 0.2s",
  },
  divider: { height: 1, background: "#e2e8f0", margin: "24px 0" },
  demoHint: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 18px",
    fontSize: 13,
    lineHeight: 1.7,
    color: "#475569",
  },
};