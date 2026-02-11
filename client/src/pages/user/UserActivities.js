import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UserActivities() {
  const [myActivities, setMyActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMyActivities();
  }, []);

  const loadMyActivities = async () => {
    const res = await API.get("/engagements/my");
    setMyActivities(res.data);
  };

  const openRegister = async () => {
    const res = await API.get("/activities");
    setAllActivities(res.data);
    setShowModal(true);
  };

  const register = async (activityId) => {
    await API.post(`/engagements/register/${activityId}`);
    setShowModal(false);
    loadMyActivities();
  };

  return (
    <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>My Activities</h1>

        <button onClick={openRegister} style={registerBtn}>
          + Register Activity
        </button>
      </div>

      <div style={card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={headerRow}>
              <th style={th}>Activity</th>
              <th style={th}>Category</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {myActivities.map((e) => (
              <tr key={e._id} style={row}>
                <td style={td}>
                  <b>{e.activity?.name}</b>
                </td>

                <td style={td}>{e.activity?.category}</td>

                <td style={td}>
                  <span style={statusBadge(e.attendanceStatus)}>
                    {e.attendanceStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {myActivities.length === 0 && (
          <p style={{ color: "#64748b", marginTop: 20 }}>
            No activities registered yet.
          </p>
        )}
      </div>

      {/* REGISTER MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Register for Activity</h3>

            {allActivities.map(a => (
              <div key={a._id} style={activityCard}>
                <div>
                  <b>{a.name}</b>
                  <p style={{ fontSize: 12, color: "#64748b" }}>{a.category}</p>
                </div>

                <button
                  onClick={() => register(a._id)}
                  style={smallBtn}
                >
                  Register
                </button>
              </div>
            ))}

            <button onClick={() => setShowModal(false)} style={cancelBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */

const card = {
  background: "white",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const registerBtn = {
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer"
};

const headerRow = {
  textAlign: "left",
  borderBottom: "1px solid #eee"
};

const th = {
  padding: "12px 0",
  fontSize: 12,
  color: "#64748b"
};

const row = {
  borderBottom: "1px solid #f1f5f9"
};

const td = {
  padding: "16px 0"
};

const statusBadge = (status) => ({
  background:
    status === "registered"
      ? "#f59e0b"
      : status === "attended"
      ? "#10b981"
      : "#ef4444",
  color: "white",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12
});

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modal = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  width: 400,
  maxHeight: 500,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const activityCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 12,
  border: "1px solid #eee",
  borderRadius: 8
};

const smallBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer"
};

const cancelBtn = {
  marginTop: 10,
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6
};
