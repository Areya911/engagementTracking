import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Settings() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    institution: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await API.get("/auth/me");
    setForm({
      name: res.data.name,
      email: res.data.email,
      institution: res.data.institution || ""
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    const res = await API.put("/users/profile", {
      name: form.name,
      institution: form.institution
    });

    setForm({
      name: res.data.name,
      email: res.data.email,
      institution: res.data.institution
    });

    alert("Profile updated successfully ");
  };

  return (
    <div>
      <h1>Settings</h1>

      <div style={card}>
        <h2>Admin Profile</h2>

        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={input}
        />

        <label>Email</label>
        <input
          value={form.email}
          disabled
          style={input}
        />

        <label>Institution</label>
        <input
          name="institution"
          value={form.institution}
          onChange={handleChange}
          style={input}
        />

        <button style={btn} onClick={saveProfile}>
          Save Profile
        </button>
      </div>
    </div>
  );
}

/* styles */

const card = {
  background: "white",
  padding: 30,
  borderRadius: 20,
  maxWidth: 600
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const btn = {
  background: "#5a4de1",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: 10
};