import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function AdminUserProfile() {

  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [engagements, setEngagements] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userRes = await API.get(`/users/${id}`);
    const engRes = await API.get("/engagements");

    setUser(userRes.data);
    setEngagements(
      engRes.data.filter(e => e.user?._id === id)
    );
  };

  if (!user) return <p>Loading...</p>;

  const courses = engagements.filter(e => e.activity?.category === "Course");
  const quizzes = engagements.filter(e => e.activity?.category === "Quiz");
  const hackathons = engagements.filter(e => e.activity?.category === "Hackathon");
  const conferences = engagements.filter(e => e.activity?.category === "Conference");

  return (
    <div>

      <h1>Student Report</h1>

      <div style={card}>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>Department: {user.department}</p>
        <p>Engagement Score: <strong>{user.engagementScore || 0}</strong></p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>

        <Stat title="Courses" value={courses.length} />
        <Stat title="Quizzes" value={quizzes.length} />
        <Stat title="Hackathons" value={hackathons.length} />
        <Stat title="Conferences" value={conferences.length} />

      </div>
      
<br></br>

      <div style={card}>
        <h3>All Activities</h3>

        {engagements.map(e => (
          <div key={e._id} style={activityRow}>
            <div>
              <strong>{e.activity?.name}</strong>
              <div style={{ fontSize: 12 }}>{e.activity?.category}</div>
            </div>

            <div>
              Status: {e.attendanceStatus}
            </div>

            <div>
              Progress: {e.progress || 0}%
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 15
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 15,
  marginBottom: 20
};

const activityRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: 10,
  borderTop: "1px solid #eee"
};