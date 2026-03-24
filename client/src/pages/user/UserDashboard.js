import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function UserDashboard() {
  const [data, setData]  = useState(null);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [dashRes, progRes] = await Promise.all([
        API.get("/users/dashboard"),
        API.get("/users/progress/analytics"),
      ]);
      setData(dashRes.data);
      setWeekly(progRes.data.weekly || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 80, color: "#94a3b8" }}>
      Loading…
    </div>
  );

  const score = data.engagementScore || 0;
  const risk  = data.riskLevel;
  const scoreColor = score < 20 ? "#ef4444" : score <= 50 ? "#f59e0b" : "#10b981";
  const riskLabel  = risk === "high" ? "⚠️ High Risk" : risk === "moderate" ? "📌 Moderate" : "✅ Healthy";

  return (
    <div>
      {/* BANNER */}
      <div style={{
        background: "linear-gradient(135deg, #312e81, #4f46e5, #7c3aed)",
        color: "white", borderRadius: 22, padding: "28px 36px", marginBottom: 24,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Welcome back! 🎓</h2>
          <p style={{ opacity: 0.82, fontSize: 14 }}>Track your learning journey and stay engaged.</p>
          <div style={{ display: "flex", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
            <div style={heroPill}>📊 Score: <strong style={{ marginLeft: 4 }}>{score}</strong></div>
            <div style={heroPill}>🎯 {riskLabel}</div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#eef2ff" }}>🗓️</div>
          <div>
            <div className="stat-value" style={{ color: "#4f46e5" }}>{data.enrolled}</div>
            <div className="stat-label">Enrolled Activities</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7" }}>✅</div>
          <div>
            <div className="stat-value" style={{ color: "#16a34a" }}>{data.attended}</div>
            <div className="stat-label">Events Attended</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>⭐</div>
          <div>
            <div className="stat-value" style={{ color: "#d97706" }}>{score}</div>
            <div className="stat-label">Engagement Score</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22 }}>
        {/* WEEKLY CHART */}
        <div className="card">
          <h3 style={cardTitle}>Weekly Study Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="hours" fill="#4f46e5" radius={[8,8,0,0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SCORE GAUGE */}
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={cardTitle}>Engagement Score</h3>
          <div style={{ fontSize: 72, fontWeight: 900, color: scoreColor, lineHeight: 1, margin: "16px 0 8px" }}>
            {score}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>out of 200 max</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min(score / 2, 100)}%`, background: scoreColor }} />
          </div>
          <div style={{ marginTop: 12, fontWeight: 700, fontSize: 14, color: scoreColor }}>{riskLabel}</div>
        </div>
      </div>

      {/* RECENT ACTIVITIES */}
      <div className="card" style={{ marginTop: 22 }}>
        <h3 style={cardTitle}>Recent Activities</h3>
        {(data.engagements || []).length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: 13 }}>No activities enrolled yet.</p>
        ) : (
          <div>
            {data.engagements.map(e => (
              <div key={e._id} style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{e.activity?.name || "–"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{e.activity?.category}</div>
                </div>
                <StatusBadge status={e.attendanceStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    present:    { cls: "badge-green",  label: "Attended" },
    absent:     { cls: "badge-red",    label: "Absent" },
    registered: { cls: "badge-indigo", label: "Registered" },
  };
  const cfg = map[status] || { cls: "badge-indigo", label: status };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

const cardTitle = { fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 14 };
const heroPill  = {
  display: "inline-flex", alignItems: "center",
  background: "rgba(255,255,255,0.15)", borderRadius: 20,
  padding: "7px 16px", fontSize: 13.5, color: "white"
};