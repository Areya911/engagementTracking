import { useEffect, useState } from "react";
import API from "../../api/axios";

const CATEGORY_COLORS = {
  Quiz:       { bg: "#dbeafe", color: "#2563eb" },
  Hackathon:  { bg: "#fef3c7", color: "#d97706" },
  Conference: { bg: "#dcfce7", color: "#16a34a" },
  Workshop:   { bg: "#ede9fe", color: "#7c3aed" },
  Course:     { bg: "#e0e7ff", color: "#4f46e5" },
};

const CATEGORY_ICONS = { Quiz:"📝", Hackathon:"💻", Conference:"🎙️", Workshop:"🔧", Course:"🎓" };

export default function UserActivities() {
  const [activities, setActivities] = useState([]);
  const [filterCat, setFilterCat] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await API.get("/activities/student");
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const register = async (id) => {
    setLoading(true);
    try {
      await API.post("/activities/register", { activityId: id });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(activities.map(a => a.category))];
  const filtered   = filterCat === "All" ? activities : activities.filter(a => a.category === filterCat);

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="section-title">My Activities</div>
          <div className="section-subtitle">{activities.filter(a => a.status).length} enrolled of {activities.length} available</div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            style={{
              padding: "7px 16px", borderRadius: 20, border: "1.5px solid",
              borderColor: filterCat === cat ? "#4f46e5" : "#e2e8f0",
              background: filterCat === cat ? "#4f46e5" : "white",
              color: filterCat === cat ? "white" : "#475569",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
            }}>
            {CATEGORY_ICONS[cat] || "📌"} {cat}
          </button>
        ))}
      </div>

      {/* ACTIVITY CARDS GRID */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🗓️</div>
          <h3>No activities found</h3>
          <p>Check back later for new activities.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 18 }}>
          {filtered.map(a => {
            const cc   = CATEGORY_COLORS[a.category] || { bg: "#f1f5f9", color: "#475569" };
            const icon = CATEGORY_ICONS[a.category] || "📌";
            const displayDate = a.category === "Course"
              ? (a.startDate ? new Date(a.startDate).toLocaleDateString("en-IN",{ day:"numeric",month:"short",year:"numeric" }) : "No date")
              : (a.date ? new Date(a.date).toLocaleDateString("en-IN",{ day:"numeric",month:"short",year:"numeric" }) : "No date");

            return (
              <div key={a._id} className="card" style={{ border: "1.5px solid #f1f5f9", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ background: cc.bg, color: cc.color, borderRadius: 12,
                    width: 44, height: 44, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                  </div>
                  <span style={{ background: cc.bg, color: cc.color, borderRadius: 20,
                    padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                    {a.category}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 4 }}>{a.name}</div>
                {a.description && (
                  <div style={{ fontSize: 12.5, color: "#64748b", marginBottom: 8, lineHeight: 1.5 }}>
                    {a.description.slice(0, 80)}{a.description.length > 80 ? "…" : ""}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>📅 {displayDate}</div>

                {!a.status ? (
                  <button
                    disabled={loading}
                    onClick={() => register(a._id)}
                    style={{
                      width: "100%", background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                      color: "white", border: "none", borderRadius: 10, padding: "9px 0",
                      fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "inherit", opacity: loading ? 0.7 : 1
                    }}>
                    + Register
                  </button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {a.status === "present"    && <span className="badge badge-green">✅ Attended</span>}
                    {a.status === "absent"     && <span className="badge badge-red">❌ Absent</span>}
                    {a.status === "registered" && <span className="badge badge-indigo">⏳ Registered</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}