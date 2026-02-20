import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userRes = await API.get("/users");
    const engRes = await API.get("/engagements");

    setUsers(userRes.data.filter(u => u.role === "user"));
    setEngagements(engRes.data);
  };

  // =============================
  // LIVE ACTIVITY COUNTS
  // =============================

  const getStats = (userId) => {
    const userEng = engagements.filter(e => e.user?._id === userId);

    const quiz = userEng.filter(e => e.activity?.category === "Quiz").length;
    const hack = userEng.filter(e => e.activity?.category === "Hackathon").length;
    const conf = userEng.filter(e => e.activity?.category === "Conference").length;

    return { quiz, hack, conf };
  };

  const getSignal = (score) => {
    if (score >= 70) return { label: "Healthy", color: "#10b981" };
    if (score >= 40) return { label: "Moderate", color: "#f59e0b" };
    return { label: "At Risk", color: "#ef4444" };
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <h1>User Management</h1>
      <p style={{ color: "#777" }}>{filtered.length} students</p>

      <input
        placeholder="Search name or department..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchBox}
      />

      <div style={table}>
        <div style={headerRow}>
          <div>Student</div>
          <div>Department</div>
          <div>Score</div>
          <div>Activities</div>
          <div>Signal</div>
          <div>Action</div>
        </div>

        {filtered.map(u => {
          const stats = getStats(u._id);
          const signal = getSignal(u.engagementScore || 0);

          return (
            <div key={u._id} style={row}>

              <div>
                <strong>{u.name}</strong>
                <div style={{ fontSize: 12, color: "#777" }}>{u.email}</div>
              </div>

              <div>{u.department}</div>

              <div>
                <ScoreCircle score={u.engagementScore || 0} />
              </div>

              <div>
                <Chip label={`Quiz: ${stats.quiz}`} />
                <Chip label={`Hack: ${stats.hack}`} />
                <Chip label={`Conf: ${stats.conf}`} />
              </div>

              <div style={{ color: signal.color }}>
                ● {signal.label}
              </div>

              <div>
                <button
                  style={btn}
                  onClick={() => navigate(`/admin/users/${u._id}`)}
                >
                  View Profile
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

// =======================
// COMPONENTS
// =======================

function ScoreCircle({ score }) {

  const color =
    score >= 70 ? "#10b981"
    : score >= 40 ? "#f59e0b"
    : "#ef4444";

  return (
    <div style={{
      width: 60,
      height: 60,
      borderRadius: "50%",
      border: `4px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color
    }}>
      <strong>{score}</strong>
    </div>
  );
}

function Chip({ label }) {
  return (
    <span style={{
      background: "#e5e7eb",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 12,
      marginRight: 6
    }}>
      {label}
    </span>
  );
}

// =======================
// STYLES
// =======================

const table = {
  background: "white",
  marginTop: 20,
  borderRadius: 15,
  padding: 20
};

const headerRow = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr 1fr",
  fontWeight: 600,
  marginBottom: 15
};

const row = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr 1fr",
  alignItems: "center",
  padding: "15px 0",
  borderTop: "1px solid #eee"
};

const btn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  background: "#5a4de1",
  color: "white",
  cursor: "pointer"
};

const searchBox = {
  marginTop: 15,
  padding: 10,
  width: 300,
  borderRadius: 8,
  border: "1px solid #ddd"
};