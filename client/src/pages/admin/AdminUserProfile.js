import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function AdminUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [id]);

  const load = async () => {
    try {
      const res = await API.get(`/users/report/${id}`);
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  const sendNotif = async () => {
    if (!data) return;
    const score = data.user?.engagementScore || 0;
    const msg = score < 20
      ? "⚠️ Your engagement is very low. Please participate in more activities."
      : score <= 50
      ? "📌 Your engagement score is moderate. Stay active and attend upcoming events."
      : "🎉 Great work! Keep maintaining your excellent engagement.";
    try {
      await API.post("/notifications/send", { userId: id, message: msg });
      alert("Notification sent!");
    } catch { alert("Failed to send"); }
  };

  if (!data) return <div style={{ padding: 60, color: "#94a3b8" }}>Loading…</div>;

  const { user, totalActivities, attended, absent, engagementScore, riskLevel, engagements } = data;
  const scoreColor = engagementScore < 20 ? "#ef4444" : engagementScore <= 50 ? "#f59e0b" : "#10b981";
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "ST";

  const riskCfg = {
    high:     { label: "High Risk",  cls: "badge-red" },
    moderate: { label: "Moderate",   cls: "badge-amber" },
    healthy:  { label: "Healthy",    cls: "badge-green" },
  };
  const risk = riskCfg[riskLevel] || riskCfg.healthy;

  return (
    <div>
      <button onClick={() => navigate("/admin/users")} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "transparent", border: "none", color: "#64748b",
        fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: "inherit"
      }}>← Back to Users</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 22 }}>
        {/* PROFILE CARD */}
        <div className="card" style={{ textAlign: "center", padding: 30 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "white", margin: "0 auto 14px"
          }}>{initials}</div>

          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{user?.email}</div>
          <span className="badge badge-indigo">{user?.department || "General"}</span>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: scoreColor }}>{engagementScore}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Engagement Score</div>
            <span className={`badge ${risk.cls}`}>{risk.label}</span>
          </div>

          <button className="btn-primary" style={{ width: "100%", marginTop: 16, fontSize: 13 }}
            onClick={sendNotif}>
            🔔 Send Notification
          </button>
        </div>

        {/* STATS + ACTIVITIES */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              { icon: "🗓️", label: "Registered",  value: totalActivities,  color: "#4f46e5", bg: "#eef2ff" },
              { icon: "✅", label: "Attended",    value: attended,           color: "#10b981", bg: "#dcfce7" },
              { icon: "❌", label: "Absent",      value: absent,             color: "#ef4444", bg: "#fee2e2" },
            ].map(c => (
              <div className="stat-card" key={c.label}>
                <div className="stat-icon" style={{ background: c.bg }}>{c.icon}</div>
                <div>
                  <div className="stat-value" style={{ color: c.color, fontSize: 22 }}>{c.value}</div>
                  <div className="stat-label">{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ENGAGEMENT HISTORY */}
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>
              Activity History
            </h3>
            {(!engagements || engagements.length === 0) ? (
              <p style={{ color: "#94a3b8", fontSize: 13 }}>No activities registered.</p>
            ) : (
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {engagements.map(e => (
                  <div key={e._id} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{e.activity?.name || "Unknown"}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{e.activity?.category}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {e.activity?.category === "Course" && (
                        <span style={{ fontSize: 12, color: "#64748b" }}>{e.progress || 0}%</span>
                      )}
                      {e.attendanceStatus === "present"    && <span className="badge badge-green">Attended</span>}
                      {e.attendanceStatus === "absent"     && <span className="badge badge-red">Absent</span>}
                      {e.attendanceStatus === "registered" && <span className="badge badge-indigo">Registered</span>}
                    </div>
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