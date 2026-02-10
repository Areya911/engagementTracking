import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    API.get("/auth/me").then(res => {
      setUser(res.data);
      setPhone(res.data.phone || "");
      setBio(res.data.bio || "");
    });
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length === 1
      ? parts[0][0]
      : parts[0][0] + parts[1][0];
  };

  const saveProfile = async () => {
    await API.put("/users/profile", { phone, bio });
    alert("Profile updated");
  };

  if (!user) return <h2 style={{ padding: 30 }}>Loading...</h2>;

  return (
    <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20 }}>My Profile</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 20
      }}>
        
        {/* LEFT SIDE */}
        <div style={card}>
          
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            
            <div style={avatar}>
              {getInitials(user.name)}
            </div>

            <div>
              <h2>{user.name}</h2>
              <p style={{ color: "#64748b" }}>{user.email}</p>
              <span style={badge}>{user.department || "General"}</span>
            </div>
          </div>

          <div style={{ marginTop: 25 }}>
            <label>Phone</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={input}
            />

            <label style={{ marginTop: 15 }}>Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              style={{ ...input, height: 80 }}
            />

            <button style={button} onClick={saveProfile}>
              Save Changes
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          
          <div style={card}>
            <h3>Learning Stats</h3>

            <Stat label="Courses Enrolled" value="6" />
            <Stat label="Courses Completed" value="3" />
            <Stat label="Overall Progress" value="72%" />
            <Stat label="Current Streak" value="12 days 🔥" />
          </div>

          <div style={{ ...card, marginTop: 20 }}>
            <h3>Security</h3>

            <input placeholder="New Password" type="password" style={input} />
            <input placeholder="Confirm Password" type="password" style={input} />

            <button style={button}>
              Update Password
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Stat({ label, value }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
      <b>{value}</b>
    </div>
  );
}

/* STYLES */

const card = {
  background: "white",
  padding: 25,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const avatar = {
  width: 70,
  height: 70,
  borderRadius: "50%",
  background: "#6366f1",
  color: "white",
  fontSize: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold"
};

const badge = {
  background: "#eef2ff",
  color: "#4f46e5",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12
};

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  marginTop: 6,
  marginBottom: 10
};

const button = {
  marginTop: 15,
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer"
};
