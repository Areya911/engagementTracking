import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {

  const [users, setUsers] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userRes = await API.get("/users");
    const engRes = await API.get("/engagements");

    setUsers(userRes.data);
    setEngagements(engRes.data);

    generateTrend(engRes.data);
  };

  // ===============================
  // LIVE METRICS CALCULATIONS
  // ===============================

  const totalStudents = users.filter(u => u.role === "user").length;

  const activeToday = engagements.filter(e => {
    const today = new Date().toDateString();
    return new Date(e.updatedAt).toDateString() === today;
  }).length;

  const avgEngagement =
    users.length === 0
      ? 0
      : Math.round(
          users.reduce((acc, u) => acc + (u.engagementScore || 0), 0) /
          users.length
        );

  const atRisk = users.filter(
    u => u.role === "user" && (u.engagementScore || 0) < 30
  ).length;

  // ===============================
  // TREND GENERATOR (REAL DATA)
  // ===============================

  const generateTrend = (engData) => {
    const monthlyMap = {};

    engData.forEach(e => {
      const month = new Date(e.createdAt).toLocaleString("default", {
        month: "short"
      });

      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    const formatted = Object.keys(monthlyMap).map(m => ({
      month: m,
      value: monthlyMap[m]
    }));

    setTrendData(formatted);
  };

  // ===============================
  // PREDICTION LOGIC
  // ===============================

  const dropOffUsers = users.filter(
    u => u.role === "user" && (u.engagementScore || 0) < 30
  );

  const highPerformers = users
    .filter(u => (u.engagementScore || 0) >= 70)
    .slice(0, 2);

  // ===============================

  return (
    <div>

      <h1 style={{ fontSize: 28 }}>Dashboard</h1>
      <p style={{ color: "#777", marginBottom: 30 }}>
        EduTrack — Admin Panel
      </p>

      {/* HERO */}
      <div style={hero}>
        <h2 style={{ margin: 0 }}>
          Good morning, Admin
        </h2>
        <p style={{ opacity: 0.9 }}>
          Here is what is happening across your institution today.
        </p>
      </div>

      {/* STATS */}
      <div style={statsGrid}>
        <StatCard color="#5a4de1" value={totalStudents} label="Total Students" />
        <StatCard color="#10b981" value={activeToday} label="Active Today" />
        <StatCard color="#f59e0b" value={avgEngagement} label="Avg Engagement" />
        <StatCard color="#ef4444" value={atRisk} label="At Risk Students" />
      </div>

      {/* LOWER SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>

        {/* TREND */}
        <div style={card}>
          <h3>Engagement Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5a4de1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PREDICTIONS */}
        <div>
          <div style={predictionCard("#fee2e2", "#ef4444")}>
            <h4>Drop-off Risk</h4>
            <p>{dropOffUsers.length} students likely to disengage</p>
            {dropOffUsers.slice(0, 2).map(u => (
              <Tag key={u._id}>{u.name}</Tag>
            ))}
          </div>

          <div style={predictionCard("#fef3c7", "#f59e0b")}>
            <h4>Peak Hours</h4>
            <p>Highest engagement between 6PM and 9PM</p>
          </div>

          <div style={predictionCard("#dcfce7", "#10b981")}>
            <h4>High Performers</h4>
            {highPerformers.map(u => (
              <Tag key={u._id}>{u.name}</Tag>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ===============================
// COMPONENTS
// ===============================

function StatCard({ color, value, label }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 20,
      borderLeft: `6px solid ${color}`
    }}>
      <h2 style={{ color }}>{value}</h2>
      <p style={{ color: "#555" }}>{label}</p>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      background: "#e5e7eb",
      padding: "6px 12px",
      borderRadius: 20,
      fontSize: 12,
      marginRight: 6
    }}>
      {children}
    </span>
  );
}

// ===============================
// STYLES
// ===============================

const hero = {
  background: "linear-gradient(90deg,#5a4de1,#7c6bff)",
  padding: 30,
  borderRadius: 25,
  color: "white",
  marginBottom: 30
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 20,
  marginBottom: 30
};

const card = {
  background: "white",
  padding: 25,
  borderRadius: 25
};

const predictionCard = (bg, border) => ({
  background: bg,
  padding: 20,
  borderRadius: 20,
  borderLeft: `6px solid ${border}`,
  marginBottom: 20
});