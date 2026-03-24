import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function UserProfile() {
  const { user: authUser } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", department: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await API.get("/users/profile/data");
    setData(res.data);
    setForm({ name: res.data.user?.name || "", department: res.data.user?.department || "" });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await API.put("/users/profile", form);
      setSaved(true);
      setEditing(false);
      await load();
      setTimeout(() => setSaved(false), 3000);
    } catch { alert("Failed to save"); }
    finally { setSaving(false); }
  };

  if (!data) return <div style={{ padding: 60, color: "#94a3b8" }}>Loading…</div>;

  const { user, stats } = data;
  const score = stats?.engagementScore || 0;
  const scoreColor = score < 20 ? "#ef4444" : score <= 50 ? "#f59e0b" : "#10b981";
  const initials = user?.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() || "ST";

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div className="section-title">My Profile</div>
      </div>

      {saved && (
        <div style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0",
          borderRadius: 10, padding: "10px 18px", marginBottom: 18, fontWeight: 600, fontSize: 13.5 }}>
          ✅ Profile updated successfully
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 22 }}>
        {/* AVATAR CARD */}
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 900, color: "white",
            margin: "0 auto 16px"
          }}>{initials}</div>

          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{user?.email}</div>
          <span className="badge badge-indigo">{user?.department || "General"}</span>

          <div style={{ marginTop: 18, padding: "14px 0", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: scoreColor }}>{score}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Engagement Score</div>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: 14, fontSize: 13 }}
            onClick={() => setEditing(!editing)}
          >
            ✏️ {editing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* INFO CARD */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { icon: "🎓", label: "Courses Enrolled",   value: stats?.enrolled || 0,        color: "#4f46e5", bg: "#eef2ff" },
              { icon: "✅", label: "Courses Completed",  value: stats?.completed || 0,       color: "#10b981", bg: "#dcfce7" },
              { icon: "📊", label: "Overall Progress",   value: `${stats?.overallProgress || 0}%`, color: "#f59e0b", bg: "#fef3c7" },
              { icon: "🗓️", label: "Total Activities",   value: stats?.totalActivities || 0, color: "#0ea5e9", bg: "#e0f2fe" },
            ].map(c => (
              <div className="stat-card" key={c.label}>
                <div className="stat-icon" style={{ background: c.bg }}>{c.icon}</div>
                <div>
                  <div className="stat-value" style={{ color: c.color, fontSize: 24 }}>{c.value}</div>
                  <div className="stat-label">{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT FORM or INFO */}
          <div className="card">
            {editing ? (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Edit Profile</h3>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input className="form-input" value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })} />
                </div>
                <button className="btn-primary" onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving…" : "💾 Save Changes"}
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Account Information</h3>
                {[
                  { label: "Full Name",   value: user?.name },
                  { label: "Email",       value: user?.email },
                  { label: "Department",  value: user?.department || "General" },
                  { label: "Member Since",value: new Date(user?.createdAt).toLocaleDateString("en-IN",{ day:"numeric",month:"long",year:"numeric" }) },
                  { label: "Risk Level",  value: stats?.riskLevel || "–" },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ width: 130, fontSize: 13, color: "#64748b", fontWeight: 600 }}>{f.label}</span>
                    <span style={{ fontSize: 13.5, color: "#1e293b", fontWeight: 500 }}>{f.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}