import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      // Load all activities marked as Course that student is registered for
      const [coursesRes, activitiesRes] = await Promise.all([
        API.get("/users/courses/student"),
        API.get("/activities/student"),
      ]);
      setCourses(coursesRes.data);
      // Activities that are Courses and student hasn't registered for yet
      setActivities(activitiesRes.data.filter(a => a.category === "Course" && !a.status));
    } catch (err) {
      console.error(err);
    }
  };

  const register = async (activityId) => {
    try {
      await API.post("/activities/register", { activityId });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">My Courses</div>
          <div className="section-subtitle">{courses.length} enrolled courses</div>
        </div>
      </div>

      {/* ENROLLED COURSES */}
      {courses.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
            📚 Enrolled Courses
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
            {courses.map(c => {
              const prog = c.progress || 0;
              const barColor = prog >= 100 ? "#10b981" : prog >= 50 ? "#f59e0b" : "#4f46e5";
              return (
                <div key={c._id} className="card" style={{ border: "1.5px solid #e0e7ff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 28, background: "#e0e7ff", borderRadius: 12,
                      width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      🎓
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{c.activity?.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {c.activity?.startDate
                          ? `${new Date(c.activity.startDate).toLocaleDateString()} – ${new Date(c.activity.endDate||c.activity.startDate).toLocaleDateString()}`
                          : "Ongoing"}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#64748b" }}>Progress</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{prog}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${prog}%`, background: barColor }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, fontSize: 13 }}
                      onClick={() => navigate(`/user/course/${c._id}`)}
                    >
                      {prog > 0 ? "▶ Continue" : "▶ Start"} Course
                    </button>
                    {prog >= 100 && (
                      <span className="badge badge-green" style={{ alignSelf: "center" }}>✅ Done</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AVAILABLE COURSES */}
      {activities.length > 0 && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
            📋 Available Courses
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
            {activities.map(a => (
              <div key={a._id} className="card" style={{ border: "1.5px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 28, background: "#f1f5f9", borderRadius: 12,
                    width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    🎓
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      {a.startDate ? new Date(a.startDate).toLocaleDateString() : "No date"}
                    </div>
                  </div>
                </div>
                {a.description && (
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>{a.description}</p>
                )}
                <button
                  className="btn-primary"
                  style={{ width: "100%", fontSize: 13 }}
                  onClick={() => register(a._id)}
                >
                  + Enroll in Course
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {courses.length === 0 && activities.length === 0 && (
        <div className="card empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No courses available</h3>
          <p>Check back later when courses are added by your institution.</p>
        </div>
      )}
    </div>
  );
}