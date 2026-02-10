export default function UserActivities() {
  const activities = [
    {
      title: "Module 3 Quiz",
      subject: "Data Structures",
      type: "Quiz",
      status: "In Progress",
      score: "-",
      due: "Dec 20, 2024"
    },
    {
      title: "Assignment 2",
      subject: "Machine Learning",
      type: "Assignment",
      status: "Submitted",
      score: "92/100",
      due: "Dec 18, 2024"
    },
    {
      title: "Live Session Recording",
      subject: "Advanced Analytics",
      type: "Live Session",
      status: "Attended",
      score: "✓",
      due: "Dec 15, 2024"
    }
  ];

  return (
    <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20 }}>My Activities</h1>

      <div style={card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={headerRow}>
              <th style={th}>ACTIVITY</th>
              <th style={th}>TYPE</th>
              <th style={th}>STATUS</th>
              <th style={th}>SCORE</th>
              <th style={th}>DUE DATE</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((a, i) => (
              <tr key={i} style={row}>
                {/* ACTIVITY */}
                <td style={td}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {a.subject}
                    </div>
                  </div>
                </td>

                {/* TYPE */}
                <td style={td}>
                  <span style={typeBadge(a.type)}>{a.type}</span>
                </td>

                {/* STATUS */}
                <td style={td}>
                  <span style={statusBadge(a.status)}>{a.status}</span>
                </td>

                {/* SCORE */}
                <td style={td}>{a.score}</td>

                {/* DATE */}
                <td style={td}>{a.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const card = {
  background: "white",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const headerRow = {
  textAlign: "left",
  borderBottom: "1px solid #eee"
};

const th = {
  padding: "12px 0",
  fontSize: 12,
  color: "#64748b",
  fontWeight: 600
};

const row = {
  borderBottom: "1px solid #f1f5f9"
};

const td = {
  padding: "16px 0"
};

/* TYPE COLORS */
function typeBadge(type) {
  const map = {
    Quiz: "#22c55e",
    Assignment: "#3b82f6",
    "Live Session": "#ef4444"
  };

  return {
    background: map[type],
    color: "white",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500
  };
}

/* STATUS COLORS */
function statusBadge(status) {
  const map = {
    "In Progress": "#f59e0b",
    Submitted: "#22c55e",
    Attended: "#10b981"
  };

  return {
    background: map[status],
    color: "white",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12
  };
}
