import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await API.get("/users/courses/student"); // ✅ CORRECT
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>My Courses</h1>

      {courses.length === 0 && <p>No courses enrolled yet.</p>}

      <div style={grid}>
        {courses.map(c => (
          <div key={c._id} style={card}>
            <h3>{c.activity.name}</h3>

            <p>Progress: {c.progress || 0}%</p>

            <button
              style={btn}
              onClick={() => navigate(`/user/course/${c._id}`)}
            >
              Start Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
  gap: 20,
  marginTop: 20
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 16
};

const btn = {
  marginTop: 10,
  background: "#5a4de1",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 10,
  cursor: "pointer"
};