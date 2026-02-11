import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AllActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    API.get("/activities").then(res => setActivities(res.data));
  }, []);

  const register = async (id) => {
    await API.post(`/engagements/register/${id}`);
    alert("Registered successfully");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Available Activities</h1>

      {activities.map(a => (
        <div key={a._id} style={card}>
          <h3>{a.name}</h3>
          <p>{a.category}</p>
          <button onClick={() => register(a._id)}>Register</button>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: 15,
  marginTop: 12,
  borderRadius: 10
};
