import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Alerts() {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const res = await API.get("/dashboard/alerts");
    setAlerts(res.data);
  };

  const highRisk = alerts.filter(a => a.riskLevel === "high");
  const moderateRisk = alerts.filter(a => a.riskLevel === "moderate");
  const healthy = alerts.filter(a => a.riskLevel === "healthy");

  return (
    <div>

      <h1>Alerts</h1>

      {/* Summary Cards */}
      <div style={cardRow}>
        <StatCard value={highRisk.length} label="High Risk" color="#ef4444" />
        <StatCard value={moderateRisk.length} label="Moderate Risk" color="#f59e0b" />
        <StatCard value={alerts.length} label="Total Students" color="#10b981" />
      </div>

      {/* Active Alerts */}
      <div style={box}>
        <h2>Active Alerts</h2>

        {alerts.map(student => (
          <div key={student._id} style={row}>
            <div>
              <strong>{student.name}</strong>
              <div style={{ fontSize: 13 }}>Score: {student.score}</div>
            </div>

            <div>
              <RiskBadge level={student.riskLevel} />
              <button style={notifyBtn}>Notify</button>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div style={{ ...card, borderLeft: `6px solid ${color}` }}>
      <h2 style={{ color }}>{value}</h2>
      <p>{label}</p>
    </div>
  );
}

function RiskBadge({ level }) {
  const config = {
    high: { text: "Low Engagement", color: "#ef4444" },
    moderate: { text: "At Risk", color: "#f59e0b" },
    healthy: { text: "High Performer", color: "#10b981" }
  };

  return (
    <span style={{
      background: config[level].color + "20",
      color: config[level].color,
      padding: "6px 12px",
      borderRadius: 20,
      marginRight: 10,
      fontSize: 13
    }}>
      {config[level].text}
    </span>
  );
}

/* styles */

const cardRow = {
  display: "flex",
  gap: 20,
  marginBottom: 30
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 15,
  minWidth: 200
};

const box = {
  background: "white",
  padding: 25,
  borderRadius: 20
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: 15,
  borderBottom: "1px solid #eee"
};

const notifyBtn = {
  background: "#5a4de1",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 8
};