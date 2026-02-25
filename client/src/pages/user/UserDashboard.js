import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function StudentHome() {

  const [data, setData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const res = await API.get("/users/dashboard");
    setData(res.data);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>

      {/* Welcome */}
      <div style={banner}>
        <h2>Welcome back!</h2>
        <p>You are building consistency. Keep going.</p>
      </div>

      {/* Stats Cards */}
      <div style={grid}>
        <Card title="Enrolled Activities" value={data.enrolled} />
        <Card title="Events Attended" value={data.attended} />
        <Card title="Engagement Score" value={`${data.engagementScore}`} />
      </div>

      {/* Engagement Score Bar */}
      <div style={card}>
        <h3>Engagement Score</h3>

        <div style={progressBg}>
          <div
            style={{
              ...progressFill,
              width: `${data.engagementScore}%`,
              background:
                data.engagementScore >= 70
                  ? "#10b981"
                  : data.engagementScore >= 40
                  ? "#f59e0b"
                  : "#ef4444"
            }}
          />
        </div>

        <p>
          Risk Level: <strong>{data.riskLevel}</strong>
        </p>
      </div>

      {/* Enrolled Activities List */}
      <div style={card}>
        <h3>My Activities</h3>

        {data.engagements.length === 0 && <p>No activities enrolled.</p>}

        {data.engagements.map(e => (
          <div key={e._id} style={activityRow}>
            <span>{e.activity?.name}</span>
            <span>{e.attendanceStatus}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
  marginBottom: 20
};

const banner = {
  background: "linear-gradient(90deg, #5a4de1, #8b5cf6)",
  color: "white",
  padding: 30,
  borderRadius: 20,
  marginBottom: 25
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 15,
  marginBottom: 20
};

const progressBg = {
  height: 10,
  background: "#e5e7eb",
  borderRadius: 10,
  margin: "10px 0"
};

const progressFill = {
  height: "100%",
  borderRadius: 10
};

const activityRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee"
};