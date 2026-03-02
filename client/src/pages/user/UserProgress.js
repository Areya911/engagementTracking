import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function UserProgress() {

  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/users/progress/analytics");
    setData(res.data);
  };

  if (!data) return <p style={{ padding: 30 }}>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>

      <h1 style={{ marginBottom: 25 }}>Progress</h1>

      {/* TOP SECTION */}
      <div style={topGrid}>

        {/* WEEKLY CHART */}
        <div style={card}>
          <h3>Weekly Study Time</h3>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <Tooltip />
              <Bar dataKey="hours" fill="#5a4de1" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ENGAGEMENT SCORE */}
        <div style={cardCenter}>
          <h3>Engagement Score</h3>

          <div style={{
            fontSize: 70,
            fontWeight: 700,
            color:
              data.engagementScore >= 70
                ? "#10b981"
                : data.engagementScore >= 40
                ? "#f59e0b"
                : "#ef4444"
          }}>
            {data.engagementScore}
          </div>

          <p>out of 100</p>

          <div style={{
            marginTop: 10,
            color:
              data.riskLevel === "Healthy"
                ? "#10b981"
                : data.riskLevel === "Moderate"
                ? "#f59e0b"
                : "#ef4444"
          }}>
            ● {data.riskLevel}
          </div>
        </div>

      </div>

      {/* COURSE PROGRESS */}
      <div style={{ ...card, marginTop: 30 }}>
        <h3>Course Progress</h3>

        {data.courses.map((c, i) => (
          <div key={i} style={{ marginTop: 20 }}>
            <div style={row}>
              <span>{c.name}</span>
              <span>{c.hours}h · {c.progress}%</span>
            </div>

            <div style={progressBg}>
              <div
                style={{
                  ...progressFill,
                  width: `${c.progress}%`,
                  background:
                    c.progress >= 70
                      ? "#10b981"
                      : c.progress >= 40
                      ? "#f59e0b"
                      : "#ef4444"
                }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const topGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 25
};

const card = {
  background: "white",
  padding: 25,
  borderRadius: 20
};

const cardCenter = {
  ...card,
  textAlign: "center"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6
};

const progressBg = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 10
};

const progressFill = {
  height: "100%",
  borderRadius: 10
};