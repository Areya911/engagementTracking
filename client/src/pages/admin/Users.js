import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [engagements, setEngagements] = useState([]);

  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data));
    API.get("/engagements").then(res => setEngagements(res.data));
  }, []);

  // Calculate engagement score per user
  const getUserScore = (userId) => {
    const userEng = engagements.filter(e => e.user === userId);

    if (userEng.length === 0) return 0;

    const completed = userEng.filter(e => e.status === "completed").length;
    return Math.round((completed / userEng.length) * 100);
  };

  const getStatus = (score) => {
    if (score >= 70) return { text: "Active", color: "#22c55e" };
    if (score >= 40) return { text: "Moderate", color: "#f59e0b" };
    return { text: "Inactive", color: "#ef4444" };
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length === 1
      ? parts[0][0]
      : parts[0][0] + parts[1][0];
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>User Management</h1>

      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th>User</th>
              <th>Department</th>
              <th>Engagement</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => {
              const score = getUserScore(user._id);
              const status = getStatus(score);

              return (
                <tr key={user._id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                  
                  {/* USER INFO */}
                  <td style={{ padding: "14px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      
                      {/* Avatar */}
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#6366f1",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold"
                      }}>
                        {getInitials(user.name)}
                      </div>

                      {/* Name + Email */}
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: "#777" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DEPARTMENT */}
                  <td>{user.department || "General"}</td>

                  {/* ENGAGEMENT BAR */}
                  <td style={{ width: 220 }}>
                    <div style={{
                      background: "#eee",
                      borderRadius: 10,
                      height: 8,
                      width: 160
                    }}>
                      <div style={{
                        width: `${score}%`,
                        height: "100%",
                        background:
                          score >= 70 ? "#22c55e" :
                          score >= 40 ? "#f59e0b" :
                          "#ef4444",
                        borderRadius: 10
                      }} />
                    </div>
                    <small>{score}%</small>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span style={{
                      background: status.color,
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      {status.text}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <Link
                      to={`/admin/users/${user._id}`}
                      style={{
                        color: "#6c6eda",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      View Profile
                    </Link>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
