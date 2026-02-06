import React from "react";

export default function UserDashboard() {
  return (
    <div>
      <h1>My Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Engagement Score" value="82%" />
        <Card title="Activities Completed" value="12" />
        <Card title="Time Spent" value="24 hrs" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      width: "200px"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
