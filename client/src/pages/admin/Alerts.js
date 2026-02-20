import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Alerts() {
  const [users, setUsers] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [showInactiveList, setShowInactiveList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data));
    API.get("/engagements").then(res => setEngagements(res.data));
  }, []);

  const now = new Date();

  // -----------------------------
  // LAST ACTIVITY PER USER
  // -----------------------------
  const lastActivityMap = {};

  engagements.forEach(e => {
    const date = new Date(e.createdAt);
    if (!lastActivityMap[e.user] || lastActivityMap[e.user] < date) {
      lastActivityMap[e.user] = date;
    }
  });

  // -----------------------------
  // INACTIVE USERS (7+ days)
  // -----------------------------
  const inactiveUsers = users.filter(u => {
    const last = lastActivityMap[u._id];
    if (!last) return true;

    const diffDays = (now - last) / (1000 * 60 * 60 * 24);
    return diffDays >= 7;
  });

  // -----------------------------
  // COMPLETION RATE
  // -----------------------------
  const completed = engagements.filter(e => e.status === "completed").length;
  const completionRate = engagements.length
    ? Math.round((completed / engagements.length) * 100)
    : 0;

  const engagementDrop = completionRate < 50;

  // Users with low performance (<30% completion)
  const dropRiskUsers = users.filter(u => {
    const userEng = engagements.filter(e => e.user === u._id);
    if (userEng.length === 0) return false;

    const done = userEng.filter(e => e.status === "completed").length;
    const score = (done / userEng.length) * 100;
    return score < 30;
  });

  return (
    <div style={{ padding: 30 }}>
      <h1>Alerts & Notifications</h1>

      {/* CRITICAL */}
      {engagementDrop && (
        <AlertCard
          color="#fee2e2"
          border="#ef4444"
          title="Critical: Engagement Drop Detected"
          message={`Completion rate is ${completionRate}%. Users may be disengaging.`}
          time="Recent"
          actions={[
            {
              label: "View Affected Users",
              primary: true,
              onClick: () => setShowDropList(!showDropList)
            },
            { label: "Dismiss" }
          ]}
        />
      )}

      {/* WARNING */}
      <AlertCard
        color="#fef3c7"
        border="#f59e0b"
        title={`Warning: ${inactiveUsers.length} Users Inactive 7+ Days`}
        message="These users haven’t participated recently."
        time="Recent"
        actions={[
          {
            label: "Send Reminder",
            primary: true,
            onClick: () => alert("Reminder emails triggered (simulation)")
          },
          {
            label: "View List",
            onClick: () => setShowInactiveList(!showInactiveList)
          }
        ]}
      />

      {/* INFO */}
      <AlertCard
        color="#dbeafe"
        border="#3b82f6"
        title="Info: Weekly Report Ready"
        message="Your weekly engagement summary is ready."
        time="1 day ago"
        actions={[
          { label: "Download Report", primary: true },
          { label: "View Details" }
        ]}
      />

      {/* SUCCESS */}
      {completionRate >= 75 && (
        <AlertCard
          color="#dcfce7"
          border="#22c55e"
          title="Success: Milestone Reached!"
          message={`Engagement crossed ${completionRate}% completion.`}
          time="2 days ago"
          actions={[
            { label: "View Analytics", primary: true },
            { label: "Share Achievement" }
          ]}
        />
      )}

      {/* INACTIVE USERS PANEL */}
      {showInactiveList && (
        <UserPanel
          title="Inactive Users (7+ days)"
          users={inactiveUsers}
        />
      )}

      {/* DROP RISK USERS PANEL */}
      {showDropList && (
        <UserPanel
          title="Low Engagement Users"
          users={dropRiskUsers}
        />
      )}
    </div>
  );
}

// -----------------------------
// ALERT CARD
// -----------------------------
function AlertCard({ color, border, title, message, actions, time }) {
  return (
    <div style={{
      background: color,
      border: `1px solid ${border}`,
      padding: 20,
      borderRadius: 12,
      marginTop: 20
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <small>{time}</small>
      </div>

      <p style={{ marginTop: 8 }}>{message}</p>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {actions.map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            style={{
              background: btn.primary ? border : "white",
              color: btn.primary ? "white" : border,
              border: `1px solid ${border}`,
              padding: "6px 14px",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// -----------------------------
// USER LIST PANEL
// -----------------------------
function UserPanel({ title, users }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 12,
      marginTop: 25
    }}>
      <h3>{title}</h3>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map(u => (
          <div key={u._id} style={{
            padding: 10,
            borderBottom: "1px solid #eee"
          }}>
            <b>a{u.name}</b> — {u.email}
          </div>
        ))
      )}
    </div>
  );
}
