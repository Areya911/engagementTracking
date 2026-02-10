import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [activities, setActivities] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    // Temporary mock data
    setActivities([
      {
        title: "Module 3 Assessment",
        type: "Quiz",
        subject: "Data Structures & Algorithms",
        progress: 75,
        due: "Due: 2 days"
      },
      {
        title: "Project Proposal",
        type: "Assignment",
        subject: "Final Year Research Project",
        progress: 40,
        due: "Due: 5 days"
      },
      {
        title: "AI Ethics Forum",
        type: "Discussion",
        subject: "3 new posts waiting",
        progress: 0,
        status: "Active Now"
      },
      {
        title: "Data Science Masterclass",
        type: "Live Session",
        subject: "Dr. Smith - Advanced Analytics",
        progress: 0,
        status: "Starting in 2h"
      }
    ]);

    setRecommended([
      { name: "Advanced Python", tag: "Python • Beginner" },
      { name: "ML Basics", tag: "Machine Learning • Advanced" },
      { name: "React Masterclass", tag: "Web Dev • Intermediate" }
    ]);
  }, []);

  return (
    <div style={{ padding: 30 }}>
      {/* HEADER */}
      <h1 style={{ marginBottom: 5 }}>Welcome back, Sarah! 👋</h1>
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
        <StatCard title="Learning Time" value="8.5h" subtitle="This Week" />
        <StatCard title="Tasks Completed" value="12" subtitle="Completed" />
        <StatCard title="Overall Progress" value="84%" subtitle="Average" />
        <StatCard title="Days Active" value="12" subtitle="Streak 🔥" />
      </div>

      {/* CURRENT ACTIVITIES */}
      <h2 style={{ marginTop: 40 }}>Your Current Activities</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 20,
        marginTop: 15
      }}>
        {activities.map((a, i) => (
          <ActivityCard key={i} data={a} />
        ))}
      </div>

      {/* RECOMMENDED */}
      <h2 style={{ marginTop: 40 }}>Recommended For You</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 20,
        marginTop: 15
      }}>
        {recommended.map((r, i) => (
          <div key={i} style={card}>
            <div style={{ height: 80, borderRadius: 10, background: "linear-gradient(45deg,#6d28d9,#4338ca)" }} />
            <div style={{ padding: 15 }}>
              <small style={{ color: "#777" }}>{r.tag}</small>
              <h3>{r.name}</h3>
              <button style={btn}>Explore</button>
            </div>
          </div>
        ))}
      </div>
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
function ActivityCard({ data }) {
  return (
    <div style={card}>
      <small style={{ color: "#6366f1" }}>{data.type}</small>
      <h3>{data.title}</h3>
      <p style={{ color: "#777" }}>{data.subject}</p>

      {data.progress > 0 && (
        <>
          <div style={progressBg}>
            <div style={{
              ...progressFill,
              width: `${data.progress}%`
            }} />
          </div>
          <small>{data.progress}%</small>
        </>
      )}

      <button style={btn}>
        {data.type === "Discussion"
          ? "Join Discussion"
          : data.type === "Live Session"
          ? "Set Reminder"
          : "Continue"}
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
  height: 8,
  background: "#eee",
  borderRadius: 10,
  marginTop: 10
};

const progressFill = {
  height: "100%",
  background: "#8b5cf6",
  borderRadius: 10
};
