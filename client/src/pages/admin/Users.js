import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { SearchIcon } from "../../components/icons/Icons";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await API.get("/users");
      // Show all accounts except the super-admin (admin@edu.in)
      setUsers(res.data.filter(u => u.role === "user"));
    } catch (err) {
      console.error("Users load error:", err);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.department || "").toLowerCase().includes(search.toLowerCase())
  );

  const getRisk = (score) => {
    if (score < 20)  return { label: "High Risk",  cls: "badge-red" };
    if (score <= 50) return { label: "Moderate",   cls: "badge-amber" };
    return { label: "Healthy", cls: "badge-green" };
  };

  const colors = ["#4F46E5","#7C3AED","#0EA5E9","#10B981","#F59E0B","#EF4444","#EC4899","#14B8A6"];
  const getColor = (name) => colors[name.charCodeAt(0) % colors.length];

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Students</div>
          <div className="section-subtitle">{users.length} registered users</div>
        </div>
        <div className="topbar-search-wrap">
          <span className="topbar-search-icon">
            <SearchIcon size={14} aria-label="Search" />
          </span>
          <input
            className="topbar-search"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search students"
            style={{ width: 280 }}
          />
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Department</th>
              <th>Engagement Score</th>
              <th>Risk Level</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>No students found</td></tr>
            ) : filtered.map(u => {
              const score = u.engagementScore || 0;
              const risk  = getRisk(score);
              const color = getColor(u.name);
              const pct   = Math.min(score, 100);
              return (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="avatar" style={{ background: color }}>
                        {u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#111827" }}>{u.name}</div>
                        <div className="small-text">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{u.department || "General"}</span>
                  </td>
                  <td>
                    <div style={{ minWidth: 140 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{score}</span>
                        <span className="small-text">{pct}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{
                          width: `${pct}%`,
                          background: score < 20 ? "#EF4444" : score <= 50 ? "#F59E0B" : "#10B981"
                        }} />
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${risk.cls}`}>{risk.label}</span></td>
                  <td className="small-text" style={{ color: "#6B7280" }}>
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <button
                      className="btn-outline btn-sm"
                      onClick={() => navigate(`/admin/users/${u._id}`)}
                    >
                      View Profile
                    </button>
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