import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function MyActivities() {

  const [activities, setActivities] = useState([]);
  const [showRegisterPanel, setShowRegisterPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const res = await API.get("/activities/student");
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to load activities", err);
    }
  };

  const register = async (id) => {
    try {
      setLoading(true);

      await API.post("/activities/register", {
        activityId: id
      });

      await loadActivities(); // real-time refresh
      setShowRegisterPanel(false);

    } catch (err) {
      console.error("Registration failed", err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const unregisteredActivities = activities.filter(a => !a.status);

  return (
    <div style={{ padding: 30 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>My Activities</h1>

        <button
          style={registerBtn}
          onClick={() => setShowRegisterPanel(!showRegisterPanel)}
        >
          + Register for Activity
        </button>
      </div>

      {/* REGISTER PANEL */}
      {showRegisterPanel && (
        <div style={registerPanel}>
          <h3>Available Activities</h3>

          {unregisteredActivities.length === 0 && (
            <p style={{ color: "#777" }}>No available activities</p>
          )}

          {unregisteredActivities.map(a => (
            <div key={a._id} style={registerRow}>
              <span>{a.name}</span>
              <button
                style={smallRegisterBtn}
                disabled={loading}
                onClick={() => register(a._id)}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TABLE */}
      <div style={tableContainer}>

        {/* TABLE HEADER */}
        <div style={{ ...row, fontWeight: "600", color: "#666" }}>
          <div>ACTIVITY</div>
          <div>TYPE</div>
          <div>DATE</div>
          <div>STATUS</div>
        </div>

        {/* TABLE ROWS */}
        {activities.map(a => (
          <div key={a._id} style={row}>

            <div>{a.name}</div>

            <div>
              <TypeBadge type={a.category} />
            </div>

            <div>
              {new Date(a.date).toLocaleDateString()}
            </div>

            <div>
              {a.status === "present" && (
                <Status text="Attended" color="#10b981" />
              )}

              {a.status === "registered" && (
                <Status text="Registered" color="#5a4de1" />
              )}

              {a.status === "absent" && (
                <Status text="Missed" color="#ef4444" />
              )}

              {!a.status && (
                <span style={{ color: "#999" }}>Not Registered</span>
              )}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Status({ text, color }) {
  return (
    <span style={{
      background: color + "20",
      color,
      padding: "5px 12px",
      borderRadius: 20,
      fontSize: 13
    }}>
      {text}
    </span>
  );
}

function TypeBadge({ type }) {

  const colors = {
    Quiz: "#60a5fa",
    Hackathon: "#f59e0b",
    Conference: "#10b981",
    Workshop: "#8b5cf6"
  };

  return (
    <span style={{
      padding: "6px 14px",
      borderRadius: 20,
      background: (colors[type] || "#999") + "20",
      color: colors[type] || "#333",
      fontSize: 13
    }}>
      {type}
    </span>
  );
}

/* ================= STYLES ================= */

const tableContainer = {
  background: "white",
  borderRadius: 20,
  padding: 20,
  marginTop: 20
};

const row = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  alignItems: "center",
  padding: "16px 0",
  borderBottom: "1px solid #eee"
};

const registerPanel = {
  background: "white",
  padding: 20,
  borderRadius: 15,
  marginTop: 20,
  marginBottom: 20,
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const registerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10
};

const registerBtn = {
  background: "#5a4de1",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 10,
  cursor: "pointer"
};

const smallRegisterBtn = {
  background: "#5a4de1",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: 20,
  cursor: "pointer"
};