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
    window.open(activity?.youtubeLink || "https://www.youtube.com", "_blank");
  };

  return (
    <div style={container}>
      
      {/* HEADER */}
      <h1 style={{ marginBottom: 5 }}>
        Welcome back, {userName || "User"} 👋
      </h1>
      <p style={{ color: "#777" }}>
        Here's your enrolled learning activities
      </p>

      {/* ENROLLED ACTIVITIES */}
      <h2 style={{ marginTop: 30 }}>Enrolled Activities</h2>

      {activities.length === 0 ? (
        <p style={{ color: "#777", marginTop: 10 }}>
          No activities enrolled yet.
        </p>
      ) : (
        <div style={grid}>
          {activities.map((e, i) => (
            <ActivityCard
              key={i}
              activity={e.activity}
              status={e.attendanceStatus}
              progress={e.progress || 0}
              onOpen={() => openVideo(e.activity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ACTIVITY CARD */
function ActivityCard({ activity, status, progress, onOpen }) {
  const isCourse = activity?.category?.toLowerCase() === "course";

  return (
    <div style={card}>
      <small style={categoryTag}>{activity?.category}</small>

      <h3 style={{ margin: "6px 0" }}>{activity?.name}</h3>

      <p style={{ color: "#777", fontSize: 14 }}>
        {activity?.description}
      </p>

      {/* SHOW PROGRESS ONLY FOR COURSES */}
      {isCourse && (
        <>
          <div style={progressBg}>
            <div
              style={{
                ...progressFill,
                width: `${progress}%`
              }}
            />
          </div>
          <small style={{ color: "#666" }}>
            {progress}% completed
          </small>
        </>
      )}

      <button style={btn} onClick={onOpen}>
        {isCourse ? "Continue Course" : "View Activity"}
      </button>
    </div>
  );
}

/* STYLES */

const container = {
  padding: 30,
  background: "#f8fafc",
  minHeight: "100vh"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 20,
  marginTop: 15
};

const card = {
  background: "white",
  padding: 22,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  transition: "0.2s"
};

const categoryTag = {
  color: "#6366f1",
  fontWeight: 600,
  fontSize: 12
};

const btn = {
  marginTop: 10,
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14
};

const progressBg = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 10,
  marginTop: 8,
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  background: "#8b5cf6",
  borderRadius: 10,
  transition: "width 0.4s ease"
};
