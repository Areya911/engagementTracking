import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    API.get("/dashboard").then(res => setStats(res.data));
    API.get("/users").then(res => setUsers(res.data));
    API.get("/activities").then(res => setActivities(res.data));
  }, []);

  if (!stats) return <h2>Loading...</h2>;

  // Convert engagement status stats into easy lookup
  const engagementMap = {};
  stats.statusStats.forEach(s => {
    engagementMap[s._id] = s.count;
  });

  return (
    <div>
      <h1>Dashboard Overview</h1>

      {/* TOP STAT CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
        marginTop: 20
      }}>
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Active Projects" value={stats.totalActivities} />
        <Card title="Total Engagements" value={stats.totalEngagements} />
        <Card title="Completion Rate" value="78%" />
      </div>

      {/* ENGAGEMENT STATS */}
      <div style={{ marginTop: 40 }}>
        <h2>Engagement Stats</h2>

        <div style={{ display: "flex", gap: 20 }}>
          <Card title="Registered" value={engagementMap.registered || 0} />
          <Card title="Attended" value={engagementMap.attended || 0} />
          <Card title="Completed" value={engagementMap.completed || 0} />
        </div>
      </div>

      {/* TOP ACTIVITIES */}
      <div style={{ marginTop: 40 }}>
        <h2>Top Activities</h2>

        {stats.activityStats
          .sort((a, b) => b.participants - a.participants)
          .slice(0, 5)
          .map((act, index) => (
            <div key={index} style={{
              background: "white",
              padding: 15,
              marginTop: 10,
              borderRadius: 10
            }}>
              Activity ID: {act._id}  
              <br />
              Participants: {act.participants}
            </div>
          ))
        }
      </div>

      {/* RECENT USERS */}
      <div style={{ marginTop: 40 }}>
        <h2>Recent Users</h2>

        {users.slice(0, 5).map(u => (
          <div key={u._id} style={{
            background: "white",
            padding: 15,
            marginTop: 10,
            borderRadius: 10
          }}>
            <b>{u.name}</b> — {u.email} — {u.role}
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITIES */}
      <div style={{ marginTop: 40 }}>
        <h2>Recent Activities</h2>

        {activities.slice(0, 5).map(a => (
          <div key={a._id} style={{
            background: "white",
            padding: 15,
            marginTop: 10,
            borderRadius: 10
          }}>
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
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
