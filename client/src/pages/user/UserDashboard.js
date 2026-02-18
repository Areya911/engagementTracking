import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UserDashboard() {
  const [activities, setActivities] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadUser();
    loadMyActivities();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserName(res.data.name);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMyActivities = async () => {
    const res = await API.get("/engagements/my");
    setActivities(res.data);
  };

  const openVideo = (activity) => {
    // TEMP default video (you can later store per activity in DB)
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
  };

  return (
    <div style={{ padding: 30 }}>
      
      {/* HEADER */}
      <h1 style={{ marginBottom: 5 }}>
        Welcome back, {userName || "User"}! 👋
      </h1>
      <p style={{ color: "#777" }}>
        Here's your learning journey at a glance
      </p>

      {/* TOP STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
        marginTop: 25
      }}>
        <StatCard title="Learning Time" value="--" subtitle="This Week" />
        <StatCard title="Tasks Completed" value={activities.length} subtitle="Enrolled" />
        <StatCard title="Overall Progress" value="0%" subtitle="Average" />
        <StatCard title="Days Active" value="--" subtitle="Streak 🔥" />
      </div>

      {/* CURRENT ACTIVITIES */}
      <h2 style={{ marginTop: 40 }}>Your Current Activities</h2>

      {activities.length === 0 ? (
        <p style={{ color: "#777", marginTop: 10 }}>
          No activities enrolled yet. Go to Activities page and register.
        </p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginTop: 15
        }}>
          {activities.map((e, i) => (
            <ActivityCard
              key={i}
              activity={e.activity}
              status={e.attendanceStatus}
              onOpen={() => openVideo(e.activity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value, subtitle }) {
  return (
    <div style={card}>
      <small style={{ color: "#777" }}>{subtitle}</small>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

/* ACTIVITY CARD */
function ActivityCard({ activity, status, onOpen }) {
  const progress = status === "completed" ? 100 : 0;

  return (
    <div style={card}>
      <small style={{ color: "#6366f1" }}>{activity?.category}</small>
      <h3>{activity?.name}</h3>
      <p style={{ color: "#777" }}>{activity?.description}</p>

      <div style={progressBg}>
        <div style={{
          ...progressFill,
          width: `${progress}%`
        }} />
      </div>

      <small>{progress}%</small>

      <button style={btn} onClick={onOpen}>
        Start Learning
      </button>
    </div>
  );
}

/* STYLES */
const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const btn = {
  marginTop: 12,
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer"
};

const progressBg = {
  height: 10,
  background: "#eee",
  borderRadius: 10,
  marginTop: 10,
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  background: "#8b5cf6",
  borderRadius: 10,
  transition: "width 0.4s ease"
};
