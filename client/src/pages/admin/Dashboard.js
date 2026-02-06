import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    API.get("/dashboard").then(res => setStats(res.data));
    API.get("/users").then(res => setUsers(res.data));
    API.get("/activities").then(res => setActivities(res.data));
    API.get("/engagements").then(res => setEngagements(res.data));
  }, []);

  if (!stats) return <h2>Loading...</h2>;

  // Map activityId -> activityName
  const activityMap = {};
  activities.forEach(a => {
    activityMap[a._id] = a.name;
  });

  // Engagement status stats map
  const engagementMap = {};
  stats.statusStats.forEach(s => {
    engagementMap[s._id] = s.count;
  });

  // -------- USER ENGAGEMENT RANKING --------
  const userScore = {};
  engagements.forEach(e => {
    const name = e.user?.name || "Unknown";
    userScore[name] = (userScore[name] || 0) + 1;
  });

  const topUsers = Object.entries(userScore)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // -------- FILTERED ACTIVITIES --------
  const filteredActivities = stats.activityStats
    .filter(a =>
      activityMap[a._id]?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 5);

  // -------- LINE CHART DATA (simulated growth) --------
  const lineData = stats.statusStats.map(s => ({
    name: s._id,
    value: s.count
  }));

  return (
    <div>
      <h1>Dashboard Overview</h1>

      {/* STAT CARDS */}
      <div className="card-grid">
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Active Projects" value={stats.totalActivities} />
        <Card title="Total Engagements" value={stats.totalEngagements} />
        <Card title="Completion Rate" value="78%" />
      </div>

      {/* ENGAGEMENT STATS */}
      <div style={{ marginTop: 40 }}>
        <h2>Engagement Stats</h2>

        <div className="card-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          <Card title="Registered" value={engagementMap.registered || 0} />
          <Card title="Attended" value={engagementMap.attended || 0} />
          <Card title="Completed" value={engagementMap.completed || 0} />
        </div>
      </div>

      {/* LINE CHART */}
      <div style={{ marginTop: 50 }}>
        <h2>Engagement Growth</h2>
        <div style={{ height: 300, background: "white", padding: 20, borderRadius: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVITY FILTER */}
      <div style={{ marginTop: 50 }}>
        <h2>Top Activities</h2>

        <input
          placeholder="Filter activity..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: 8,
            marginBottom: 15,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />

        {filteredActivities.map((act, index) => {
          const max = stats.activityStats[0]?.participants || 1;
          const percent = (act.participants / max) * 100;

          return (
            <div key={index} className="list-box">
              <b>{activityMap[act._id] || "Unknown Activity"}</b>
              <br />
              Participants: {act.participants}

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: percent + "%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* USER ENGAGEMENT RANKING */}
      <div style={{ marginTop: 50 }}>
        <h2>Top Active Users</h2>

        {topUsers.map((u, index) => (
          <div key={index} className="list-box">
            <b>{u.name}</b>
            <br />
            Engagement Score: {u.score}
          </div>
        ))}
      </div>

      {/* RECENT USERS */}
      <div style={{ marginTop: 50 }}>
        <h2>Recent Users</h2>

        {users.slice(0, 5).map(u => (
          <div key={u._id} className="list-box">
            <b>{u.name}</b> — {u.email} — {u.role}
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITIES */}
      <div style={{ marginTop: 50 }}>
        <h2>Recent Activities</h2>

        {activities.slice(0, 5).map(a => (
          <div key={a._id} className="list-box">
            <b>{a.name}</b>
            <p>{a.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
