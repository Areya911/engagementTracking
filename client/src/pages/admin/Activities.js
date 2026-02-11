import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Search,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [engagements, setEngagements] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    API.get("/activities").then(res => setActivities(res.data));
    API.get("/engagements").then(res => setEngagements(res.data));
  };

  const getStats = (activityId) => {
    const data = engagements.filter(e => e.activity === activityId);
    const total = data.length;
    const completed = data.filter(e => e.status === "completed").length;

    return {
      participants: total,
      completion: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  };

  const getColor = (type) => {
    switch (type?.toLowerCase()) {
      case "quiz": return "#22c55e";
      case "video": return "#6366f1";
      case "assignment": return "#f59e0b";
      case "discussion": return "#a855f7";
      case "live": return "#ef4444";
      default: return "#06b6d4";
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (act) => {
    setEditing(act);
    setForm(act);
    setShowModal(true);
  };

  const saveActivity = async () => {
    if (editing) {
      await API.put(`/activities/${editing._id}`, form);
    } else {
      await API.post("/activities", form);
    }
    setShowModal(false);
    fetchData();
  };

  const deleteActivity = async (id) => {
    await API.delete(`/activities/${id}`);
    fetchData();
  };

  const filtered = activities
    .filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(a =>
      categoryFilter === "All" ? true : a.category === categoryFilter
    )
    .sort((a, b) => {
      const aStats = getStats(a._id);
      const bStats = getStats(b._id);

      if (sortBy === "popular")
        return bStats.participants - aStats.participants;

      return bStats.completion - aStats.completion;
    });

  const categories = ["All", ...new Set(activities.map(a => a.category))];

  return (
    <div style={{ padding: 30 }}>
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20
      }}>
        <h1>Activities & Content</h1>

        <button onClick={openAdd} style={addBtn}>
          <Plus size={16} /> Add Activity
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{
        display: "flex",
        gap: 15,
        marginBottom: 20
      }}>
        <div style={searchBox}>
          <Search size={16} />
          <input
            placeholder="Search activities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        <select onChange={e => setCategoryFilter(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <select onChange={e => setSortBy(e.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="completion">Highest Completion</option>
        </select>
      </div>

      {/* GRID */}
      <div style={grid}>
        {filtered.map(act => {
          const stats = getStats(act._id);
          const color = getColor(act.category);

          return (
            <div key={act._id} style={card}>
              <div style={{ ...topBar, background: color }} />

              <div style={badge(color)}>{act.category}</div>

              <h3>{act.name}</h3>
              <p style={{ color: "#777" }}>{act.description}</p>

              <div style={statRow}>
                <div>
                  <small>Participants</small>
                  <div>{stats.participants}</div>
                </div>

                <div>
                  <small>Completion</small>
                  <div>{stats.completion}%</div>
                </div>
              </div>

              <div style={progressBg}>
                <div style={{
                  ...progressBar,
                  width: `${stats.completion}%`,
                  background: color
                }} />
              </div>
              <div style={{ marginTop: 12 }}>
              {engagements
                .filter(e => e.activity === act._id)
                .map(e => (
                  <div key={e._id} style={{
                    background: "#f8fafc",
                    padding: 8,
                    marginTop: 6,
                    borderRadius: 8
                  }}>
                    {e.user.name}

                    <div style={{ marginTop: 6 }}>
                      <button
                        onClick={() =>
                          API.put(`/engagements/${e._id}`, { status: "attended" })
                            .then(fetchData)
                        }
                      >
                        Attended
                      </button>

                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() =>
                          API.put(`/engagements/${e._id}`, { status: "absent" })
                            .then(fetchData)
                        }
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
            </div>

              <div style={actions}>
                <Pencil size={16} onClick={() => openEdit(act)} style={iconBtn}/>
                <Trash2 size={16} onClick={() => deleteActivity(act._id)} style={iconBtn}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editing ? "Edit Activity" : "Add Activity"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <button onClick={saveActivity}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))",
  gap: 20
};

const card = {
  background: "white",
  borderRadius: 14,
  padding: 20,
  position: "relative",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const topBar = {
  height: 5,
  borderRadius: "10px 10px 0 0",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0
};

const badge = (color) => ({
  display: "inline-block",
  background: `${color}20`,
  color,
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  marginBottom: 10
});

const statRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10
};

const progressBg = {
  marginTop: 12,
  height: 8,
  background: "#eee",
  borderRadius: 10
};

const progressBar = {
  height: "100%",
  borderRadius: 10
};

const actions = {
  marginTop: 12,
  display: "flex",
  justifyContent: "flex-end",
  gap: 12
};

const iconBtn = {
  cursor: "pointer"
};

const addBtn = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: 8,
  cursor: "pointer"
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "white",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #eee"
};

const searchInput = {
  border: "none",
  outline: "none"
};

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
  borderRadius: 10,
  width: 300,
  display: "flex",
  flexDirection: "column",
  gap: 10
};
