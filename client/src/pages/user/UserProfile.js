import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Profile() {

  const [data, setData] = useState(null);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/users/profile/data");
    setData(res.data);
    setPhone(res.data.user.phone || "");
    setBio(res.data.user.bio || "");
  };

  const saveChanges = async () => {
    await API.put("/users/profile", { phone, bio });
    load();
  };

  if (!data) return <p style={{ padding: 30 }}>Loading...</p>;

  const { user, stats } = data;

  return (
    <div style={{ padding: 30 }}>

      <h1>My Profile</h1>

      <div style={grid}>

        {/* LEFT CARD */}
        <div style={card}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.department}</p>

          <h4>Phone</h4>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={input}
          />

          <h4>Bio</h4>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            style={textarea}
          />

          <button onClick={saveChanges} style={btn}>
            Save Changes
          </button>
        </div>

        {/* RIGHT CARD */}
        <div style={card}>
          <h3>Learning Stats</h3>

          <p>Courses Enrolled: <b>{stats.enrolled}</b></p>
          <p>Courses Completed: <b>{stats.completed}</b></p>
          <p>Overall Progress: <b>{stats.overallProgress}%</b></p>
          <p>Current Streak: <b>{stats.streak} days </b></p>
        </div>

      </div>

    </div>
  );
}

/* STYLES */

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 25
};

const card = {
  background: "white",
  padding: 25,
  borderRadius: 20
};

const input = {
  width: "100%",
  padding: 8,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const textarea = {
  width: "100%",
  height: 100,
  padding: 8,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const btn = {
  marginTop: 10,
  padding: "8px 16px",
  background: "#5a4de1",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};