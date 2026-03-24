import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Reports() {
  const [users, setUsers] = useState([]);
  const [engagements, setEngagements] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [uRes, eRes] = await Promise.all([API.get("/users"), API.get("/engagements")]);
    setUsers(uRes.data.filter(u => u.role === "user"));
    setEngagements(eRes.data);
  };

  const getRisk = (score) => {
    if (score < 20)  return { label: "High Risk",  color: "#dc2626", bg: "#fee2e2" };
    if (score <= 50) return { label: "Moderate",   color: "#d97706", bg: "#fef3c7" };
    return { label: "Healthy", color: "#16a34a", bg: "#dcfce7" };
  };

  const total  = users.length;
  const avgScore = total ? Math.round(users.reduce((a, u) => a + (u.engagementScore || 0), 0) / total) : 0;
  const highRiskCount = users.filter(u => (u.engagementScore || 0) < 20).length;
  const healthyCount  = users.filter(u => (u.engagementScore || 0) > 50).length;

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">Reports</div>
          <div className="section-subtitle">Comprehensive engagement reports per student</div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Students",    value: total,           color: "#4f46e5", bg: "#eef2ff",  icon: "👥" },
          { label: "Average Score",     value: avgScore,        color: "#0ea5e9", bg: "#e0f2fe",  icon: "📊" },
          { label: "High Risk",         value: highRiskCount,   color: "#ef4444", bg: "#fee2e2",  icon: "⚠️" },
          { label: "Healthy Students",  value: healthyCount,    color: "#10b981", bg: "#dcfce7",  icon: "✅" },
        ].map(c => (
          <div className="stat-card" key={c.label}>
            <div className="stat-icon" style={{ background: c.bg }}>{c.icon}</div>
            <div>
              <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* STUDENT REPORT TABLE */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Department</th>
              <th>Engagement Score</th>
              <th>Risk Level</th>
              <th>Registered Activities</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const score = u.engagementScore || 0;
              const risk  = getRisk(score);
              const count = engagements.filter(e => e.user?._id === u._id || e.user === u._id).length;
              return (
                <tr key={u._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{u.email}</div>
                  </td>
                  <td><span className="badge badge-indigo">{u.department || "General"}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="progress-track" style={{ flex: 1, maxWidth: 120 }}>
                        <div className="progress-fill" style={{ width: `${Math.min(score,100)}%`,
                          background: score < 20 ? "#ef4444" : score <= 50 ? "#f59e0b" : "#10b981" }} />
                      </div>
                      <strong style={{ fontSize: 14 }}>{score}</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ background: risk.bg, color: risk.color,
                      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {risk.label}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}