import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then(res => setStats(res.data));
  }, []);

  if (!stats) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Dashboard Overview</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
        marginTop: 20
      }}>
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Active Projects" value={stats.totalActivities} />
        <Card title="Engagements" value={stats.totalEngagements} />
        <Card title="Completion Rate" value="78%" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
