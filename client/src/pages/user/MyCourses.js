import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function MyCourses() {

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const res = await API.get("/users/courses/student");
    setCourses(res.data);
  };

  return (
    <div style={{ padding: 30 }}>

      <h1>My Courses</h1>

      <div style={grid}>

        {courses.map(course => (
          <div key={course._id} style={card}>

            <div style={thumbnail}>
              ▶
            </div>

            <h3>{course.activity.name}</h3>

            <p>Progress: {course.progress || 0}%</p>

            <div style={progressBg}>
              <div
                style={{
                  ...progressFill,
                  width: `${course.progress || 0}%`
                }}
              />
            </div>

            <button
              style={btn}
              onClick={() =>
                navigate(`/student/course/${course._id}`)
              }
            >
              Start Watching
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 20,
  marginTop: 20
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 20
};

const thumbnail = {
  height: 150,
  background: "#ddd",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30
};

const progressBg = {
  height: 6,
  background: "#eee",
  borderRadius: 10,
  marginTop: 10
};

const progressFill = {
  height: "100%",
  background: "#5a4de1",
  borderRadius: 10
};

const btn = {
  marginTop: 15,
  background: "#5a4de1",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: 10,
  cursor: "pointer"
};