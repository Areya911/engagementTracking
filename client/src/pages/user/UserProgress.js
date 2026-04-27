import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

export default function UserProgress() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const res = await API.get("/users/progress/analytics");
      setData(res.data);
    } catch (err) {
      setError("Could not load progress data.");
      console.error(err);
    }
  };

  if (error) return <div style={{ padding: 60, color: "#ef4444" }}>{error}</div>;
  if (!data)  return <div style={{ padding: 60, color: "#94a3b8" }}>Loading…</div>;

  const score = data.engagementScore || 0;
  const scoreColor = score < 20 ? "#ef4444" : score <= 50 ? "#f59e0b" : "#10b981";
  const riskLabel  = data.riskLevel === "high" ? "High Risk ⚠️"
    : data.riskLevel === "moderate" ? "Moderate 📌" : "Healthy ✅";

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">My Progress</div>
          <div className="section-subtitle">Your engagement analytics and learning overview</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22, marginBottom: 22 }}>
        {/* WEEKLY CHART */}
        <div className="card">
          <h3 style={cardTitle}>Weekly Study Time</h3>
          <p style={cardSub}>Hours studied per day this week</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }}
                formatter={(v) => [`${v}h`, "Study Time"]} />
              <Bar dataKey="hours" fill="#4f46e5" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SCORE CARD */}
        <div className="card" style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3 style={cardTitle}>Engagement Score</h3>
          <div style={{ fontSize: 80, fontWeight: 900, color: scoreColor, lineHeight: 1, margin: "18px 0 6px" }}>
            {score}
          </div>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Your overall score</p>
          <div className="progress-track" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: `${Math.min(score/2, 100)}%`, background: scoreColor }} />
          </div>
          <div style={{ marginTop: 12, fontWeight: 700, fontSize: 15, color: scoreColor }}>
            {riskLabel}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
            {score < 20 ? "Participate more to improve!" : score <= 50 ? "Keep it up!" : "Excellent work!"}
          </div>
        </div>
      </div>

      {/* COURSE PROGRESS */}
      {data.courses?.length > 0 && (
        <div className="card">
          <h3 style={cardTitle}>Course Progress</h3>
          <p style={cardSub}>Completion status for enrolled courses</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {data.courses.map((c, i) => {
              const barColor = c.progress >= 100 ? "#10b981" : c.progress >= 50 ? "#f59e0b" : "#4f46e5";
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{c.name}</span>
                    <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
                      <span style={{ color: "#64748b" }}>⏱ {c.hours}h</span>
                      <span style={{ fontWeight: 700, color: barColor }}>{c.progress}%</span>
                    </div>
                  </div>
                  <div className="progress-track" style={{ height: 10 }}>
                    <div className="progress-fill" style={{ width: `${c.progress}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.courses?.length === 0 && (
        <div className="card empty-state">
          <div className="empty-icon">📊</div>
          <h3>No course progress yet</h3>
          <p>Enroll in courses and start watching to track your progress.</p>
        </div>
      )}
    </div>
  );
}

const cardTitle = { fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 2 };
const cardSub   = { fontSize: 12.5, color: "#64748b", marginBottom: 14 };