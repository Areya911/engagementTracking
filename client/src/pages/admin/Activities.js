import { useEffect, useState } from "react";
import API from "../../api/axios";

const CATEGORIES = ["Quiz", "Hackathon", "Conference", "Workshop", "Course"];

const EMPTY_FORM = {
  name: "", category: "Quiz", description: "", date: "",
  startDate: "", endDate: "", youtubeUrl: ""
};

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null); // attendance panel
  const [filterCat, setFilterCat] = useState("All");
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [actRes, engRes] = await Promise.all([
      API.get("/activities"),
      API.get("/engagements"),
    ]);
    setActivities(actRes.data);
    setEngagements(engRes.data);
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (a) => {
    setForm({
      name: a.name,
      category: a.category,
      description: a.description || "",
      date: a.date ? a.date.split("T")[0] : "",
      startDate: a.startDate ? a.startDate.split("T")[0] : "",
      endDate: a.endDate ? a.endDate.split("T")[0] : "",
      youtubeUrl: a.youtubeUrl || ""
    });
    setEditId(a._id);
    setShowModal(true);
  };

  const saveActivity = async () => {
    try {
      if (editId) {
        await API.put(`/activities/${editId}`, form);
        setMsg("Activity updated!");
      } else {
        await API.post("/activities", form);
        setMsg("Activity created!");
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      load();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving activity");
    }
  };

  const deleteActivity = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    await API.delete(`/activities/${id}`);
    load();
  };

  const openAttendance = (a) => {
    const participants = engagements.filter(e => e.activity?._id === a._id);
    setSelected({ ...a, participants });
  };

  const markAttendance = async (id, status) => {
    await API.put(`/engagements/${id}`, { status });
    load();
    if (selected) {
      const updated = engagements.map(e => e._id === id ? { ...e, attendanceStatus: status } : e);
      setSelected(prev => ({
        ...prev,
        participants: updated.filter(e => e.activity?._id === prev._id)
      }));
    }
  };

  const getCatBadge = (cat) => {
    const map = {
      Quiz: "badge-blue", Hackathon: "badge-amber",
      Conference: "badge-green", Workshop: "badge-purple", Course: "badge-indigo"
    };
    return map[cat] || "badge-indigo";
  };

  const filtered = filterCat === "All" ? activities
    : activities.filter(a => a.category === filterCat);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Activities & Events</div>
          <div className="section-subtitle">{activities.length} total activities</div>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Create Activity</button>
      </div>

      {msg && (
        <div style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0",
          borderRadius: 10, padding: "10px 18px", marginBottom: 18, fontSize: 13.5, fontWeight: 600 }}>
          ✅ {msg}
        </div>
      )}

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            style={{
              padding: "7px 16px", borderRadius: 20, border: "1.5px solid",
              borderColor: filterCat === cat ? "#4f46e5" : "#e2e8f0",
              background: filterCat === cat ? "#4f46e5" : "white",
              color: filterCat === cat ? "white" : "#475569",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
            }}
          >{cat}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🗓️</div>
          <h3>No activities yet</h3>
          <p>Create your first activity to start tracking engagement.</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Category</th>
                <th>Date</th>
                <th>Participants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const count = engagements.filter(e => e.activity?._id === a._id).length;
                const displayDate = a.category === "Course"
                  ? (a.startDate ? new Date(a.startDate).toLocaleDateString() : "–")
                  : (a.date ? new Date(a.date).toLocaleDateString() : "–");
                const isUpcoming = a.date ? new Date(a.date) > new Date() : true;
                return (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>{a.name}</div>
                      {a.description && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{a.description.slice(0,60)}{a.description.length > 60 ? "…" : ""}</div>}
                    </td>
                    <td><span className={`badge ${getCatBadge(a.category)}`}>{a.category}</span></td>
                    <td style={{ fontSize: 13, color: "#64748b" }}>{displayDate}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#1e293b" }}>
                        <span style={{ background: "#e0e7ff", color: "#4f46e5", borderRadius: 20, padding: "3px 10px", fontSize: 13 }}>
                          {count}
                        </span>
                      </span>
                    </td>
                    <td>
                      {a.category === "Course"
                        ? <span className="badge badge-teal">Course</span>
                        : <span className={`badge ${isUpcoming ? "badge-blue" : "badge-green"}`}>
                            {isUpcoming ? "Upcoming" : "Completed"}
                          </span>
                      }
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-outline" style={{ fontSize: 12, padding: "5px 10px" }}
                          onClick={() => openAttendance(a)}>Attendance</button>
                        <button className="btn-warning" style={{ fontSize: 12, padding: "5px 10px" }}
                          onClick={() => openEdit(a)}>Edit</button>
                        <button className="btn-danger" style={{ fontSize: 12, padding: "5px 10px" }}
                          onClick={() => deleteActivity(a._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target.className === "modal-overlay") setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">{editId ? "Edit Activity" : "Create Activity"}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Activity Name</label>
              <input className="form-input" placeholder="e.g. Python Workshop"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea className="form-textarea" placeholder="Brief description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            {form.category === "Course" ? (
              <>
                <div className="form-group">
                  <label className="form-label">YouTube URL</label>
                  <input className="form-input" type="url" placeholder="https://youtube.com/watch?v=..."
                    value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" type="date"
                      value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" type="date"
                      value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Activity Date</label>
                <input className="form-input" type="date"
                  value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn-primary" onClick={saveActivity} style={{ flex: 1 }}>
                {editId ? "Update Activity" : "Create Activity"}
              </button>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE PANEL */}
      {selected && (
        <div className="modal-overlay" onClick={e => { if (e.target.className === "modal-overlay") setSelected(null); }}>
          <div className="modal-box" style={{ width: 540 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Attendance: {selected.name}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{selected.participants.length} registered</div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            {selected.participants.length === 0 ? (
              <div className="empty-state" style={{ padding: "30px 0" }}>
                <div className="empty-icon" style={{ fontSize: 36 }}>👤</div>
                <p>No students registered yet</p>
              </div>
            ) : selected.participants.map(p => (
              <div key={p._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.user?.name || "Student"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{p.user?.email}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {p.attendanceStatus === "present" && <span className="badge badge-green">Present</span>}
                  {p.attendanceStatus === "absent"  && <span className="badge badge-red">Absent</span>}
                  {p.attendanceStatus === "registered" && <span className="badge badge-indigo">Registered</span>}
                  <button className="btn-primary" style={{ fontSize: 12, padding: "5px 12px" }}
                    onClick={() => markAttendance(p._id, "present")}>✓ Present</button>
                  <button className="btn-danger" style={{ fontSize: 12, padding: "5px 12px" }}
                    onClick={() => markAttendance(p._id, "absent")}>✗ Absent</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}