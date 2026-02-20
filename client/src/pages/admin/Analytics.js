import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

export default function Analytics() {

  const [engagements, setEngagements] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const engRes = await API.get("/engagements");
    const userRes = await API.get("/users");

    setEngagements(engRes.data);
    setUsers(userRes.data.filter(u => u.role === "user"));
  };

  // ===============================
  // ENGAGEMENT OVER TIME
  // ===============================

  const monthlyMap = {};

  engagements.forEach(e => {
    const month = new Date(e.createdAt).toLocaleString("default", {
      month: "short"
    });

    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const trendData = Object.keys(monthlyMap).map(m => ({
    month: m,
    value: monthlyMap[m]
  }));

  // ===============================
  // ACTIVITY DISTRIBUTION
  // ===============================

  const activityMap = {};

  engagements.forEach(e => {
    const category = e.activity?.category || "Other";
    activityMap[category] = (activityMap[category] || 0) + 1;
  });

  const pieData = Object.keys(activityMap).map(k => ({
    name: k,
    value: activityMap[k]
  }));

  const COLORS = ["#5a4de1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

  // ===============================
  // WEEKLY STUDY PATTERN (based on updates)
  // ===============================

  const weeklyMap = {
    Mon: 0, Tue: 0, Wed: 0,
    Thu: 0, Fri: 0, Sat: 0, Sun: 0
  };

  engagements.forEach(e => {
    const day = new Date(e.updatedAt).toLocaleString("default", {
      weekday: "short"
    });

    if (weeklyMap[day] !== undefined) {
      weeklyMap[day] += 1;
    }
  });

  const weeklyData = Object.keys(weeklyMap).map(d => ({
    day: d,
    value: weeklyMap[d]
  }));

  return (
    <div>

      <h1>Analytics</h1>
      <p style={{ color: "#777", marginBottom: 30 }}>
        EduTrack — Admin Panel
      </p>

      {/* TOP SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Engagement Trend */}
        <div style={card}>
          <h3>Engagement Over Time</h3>

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

        {/* Activity Distribution */}
        <div style={card}>
          <h3>Activity Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 25 }}>

        {/* Weekly Study Pattern */}
        <div style={card}>
          <h3>Weekly Study Patterns</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Student Engagement Scores */}
        <div style={card}>
          <h3>Student Engagement Scores</h3>

          {users.map(u => (
            <div key={u._id} style={{ marginBottom: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{u.name}</span>
                <strong>{u.engagementScore || 0}</strong>
              </div>

              <div style={progressBg}>
                <div
                  style={{
                    ...progressFill,
                    width: `${u.engagementScore || 0}%`,
                    background:
                      u.engagementScore >= 70
                        ? "#10b981"
                        : u.engagementScore >= 40
                        ? "#f59e0b"
                        : "#ef4444"
                  }}
                />
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

const card = {
  background: "white",
  padding: 25,
  borderRadius: 20
};

const progressBg = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 10,
  marginTop: 6
};

const progressFill = {
  height: "100%",
  borderRadius: 10
};