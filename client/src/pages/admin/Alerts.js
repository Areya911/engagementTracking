import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [notifying, setNotifying] = useState(null);

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    try {
      const res = await API.get("/dashboard/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error("Alerts load error:", err);
    }
  };

  const sendNotification = async (student) => {
    setNotifying(student._id);
    let message = "";
    if (student.riskLevel === "high") {
      message = "⚠️ Your engagement is very low. Please participate in more activities.";
    } else if (student.riskLevel === "moderate") {
      message = "📌 Your engagement is dropping. Stay active and attend upcoming events.";
    } else {
      message = "🎉 Great work! Keep maintaining your excellent engagement.";
    }
    try {
      await API.post("/notifications/send", { userId: student._id, message });
      alert(`Notification sent to ${student.name}`);
    } catch (err) {
      alert("Failed to send notification");
    } finally {
      setNotifying(null);
    }
  };

  const highRisk    = alerts.filter(a => a.riskLevel === "high");
  const moderate    = alerts.filter(a => a.riskLevel === "moderate");
  const healthy     = alerts.filter(a => a.riskLevel === "healthy");

  const riskConfig = {
    high:     { label: "High Risk",     cls: "badge-red",   icon: "🔴" },
    moderate: { label: "Moderate Risk", cls: "badge-amber", icon: "🟡" },
    healthy:  { label: "Healthy",       cls: "badge-green", icon: "🟢" },
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">Alerts & Risk Detection</div>
          <div className="section-subtitle">Students ranked by engagement risk level</div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2" }}>🔴</div>
          <div>
            <div className="stat-value" style={{ color: "#dc2626" }}>{highRisk.length}</div>
            <div className="stat-label">High Risk Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>🟡</div>
          <div>
            <div className="stat-value" style={{ color: "#d97706" }}>{moderate.length}</div>
            <div className="stat-label">Moderate Risk</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7" }}>✅</div>
          <div>
            <div className="stat-value" style={{ color: "#16a34a" }}>{healthy.length}</div>
            <div className="stat-label">Healthy Students</div>
          </div>
        </div>
      </div>

      {/* ACTIVE ALERTS TABLE */}
      <div className="card">
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Active Alerts</h3>
        {alerts.length === 0 ? (
          <div className="empty-state" style={{ padding: "40px 0" }}>
            <div className="empty-icon">🎉</div>
            <h3>No alerts</h3>
            <p>All students appear to be doing well!</p>
          </div>
        ) : (
          <div>
            {alerts.map(student => {
              const cfg = riskConfig[student.riskLevel] || riskConfig.healthy;
              const pct = Math.min(student.score, 100);
              const barColor = student.riskLevel === "high" ? "#ef4444"
                : student.riskLevel === "moderate" ? "#f59e0b" : "#10b981";
              return (
                <div key={student._id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 0", borderBottom: "1px solid #f1f5f9", gap: 16
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                    <div style={{ fontSize: 22 }}>{cfg.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{student.name}</span>
                        <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                        {student.department && (
                          <span className="badge badge-indigo">{student.department}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1, maxWidth: 200 }}>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 13, color: "#64748b" }}>Score: <strong style={{ color: "#1e293b" }}>{student.score}</strong></span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ whiteSpace: "nowrap", fontSize: 13 }}
                    disabled={notifying === student._id}
                    onClick={() => sendNotification(student)}
                  >
                    {notifying === student._id ? "Sending…" : "🔔 Notify"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
