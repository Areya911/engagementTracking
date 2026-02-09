import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "Administration",
    phone: ""
  });

  const [rules, setRules] = useState({
    loginWeight: 25,
    timeWeight: 25,
    activityWeight: 25,
    completionWeight: 25
  });

  useEffect(() => {
    API.get("/auth/me").then(res => {
      setProfile({
        name: res.data.name,
        email: res.data.email,
        department: res.data.department || "Administration",
        phone: res.data.phone || ""
      });
    }).catch(() => {});
  }, []);

  const handleProfileSave = () => {
    API.put("/users/profile", profile)
      .then(() => alert("Profile updated"))
      .catch(() => alert("Update failed"));
  };

  const handleRulesUpdate = () => {
    alert("Engagement scoring rules updated (frontend simulation)");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Settings</h1>

      {/* PROFILE + ROLES */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }}>

        {/* ADMIN PROFILE */}
        <div style={card}>
          <h3>Admin Profile</h3>

          <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#14b8a6",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: "bold"
            }}>
              AD
            </div>

            <div>
              <div style={{ fontWeight: 600 }}>{profile.name}</div>
              <div style={{ color: "#777" }}>Super Administrator</div>
              <div style={{ color: "#6366f1", fontSize: 13, cursor: "pointer" }}>
                Change Avatar
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 20 }}>
            <input
              style={input}
              value={profile.name}
              placeholder="Full Name"
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              style={input}
              value={profile.email}
              placeholder="Email"
              onChange={e => setProfile({ ...profile, email: e.target.value })}
            />

            <select
              style={input}
              value={profile.department}
              onChange={e => setProfile({ ...profile, department: e.target.value })}
            >
              <option>Administration</option>
              <option>Computer Science</option>
              <option>Business</option>
              <option>Engineering</option>
            </select>

            <input
              style={input}
              value={profile.phone}
              placeholder="Phone"
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <button style={primaryBtn} onClick={handleProfileSave}>
            Save Changes
          </button>
        </div>

        {/* ROLE MANAGEMENT */}
        <div style={card}>
          <h3>Role Management</h3>

          <RoleCard title="Super Admin" desc="Full system access" users="2 users" />
          <RoleCard title="Moderator" desc="Manage users & content" users="5 users" />
          <RoleCard title="Viewer" desc="View-only access" users="12 users" />

          <div style={{
            marginTop: 15,
            padding: 12,
            border: "2px dashed #ddd",
            textAlign: "center",
            borderRadius: 10,
            cursor: "pointer"
          }}>
            + Add New Role
          </div>
        </div>
      </div>

      {/* ENGAGEMENT RULES */}
      <div style={{ ...card, marginTop: 25 }}>
        <h3>Engagement Score Rules</h3>

        <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 35
                    }}>
          <RuleInput label="Login Frequency Weight"
            value={rules.loginWeight}
            onChange={v => setRules({ ...rules, loginWeight: v })}
          />
          <RuleInput label="Time Spent Weight"
            value={rules.timeWeight}
            onChange={v => setRules({ ...rules, timeWeight: v })}
          />
          <RuleInput label="Activity Weight"
            value={rules.activityWeight}
            onChange={v => setRules({ ...rules, activityWeight: v })}
          />
          <RuleInput label="Completion Weight"
            value={rules.completionWeight}
            onChange={v => setRules({ ...rules, completionWeight: v })}
          />
        </div>

        <button style={{ ...primaryBtn, marginTop: 15 }} onClick={handleRulesUpdate}>
          Update Rules
        </button>
      </div>

      {/* INTEGRATIONS */}
      <div style={{ ...card, marginTop: 25 }}>
        <h3>App Integrations</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 15 }}>
          <Integration name="Google Workspace" status="Connected" />
          <Integration name="Email Service" status="Connected" />

          <div style={{
            border: "2px dashed #ddd",
            padding: 20,
            borderRadius: 10,
            textAlign: "center",
            color: "#777"
          }}>
            + Add Integration
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function RoleCard({ title, desc, users }) {
  return (
    <div style={{
      background: "#f9fafb",
      padding: 12,
      borderRadius: 10,
      marginTop: 10
    }}>
      <b>{title}</b>
      <div style={{ fontSize: 12, color: "#666" }}>{desc}</div>
      <div style={{
        float: "right",
        fontSize: 12,
        background: "#e0e7ff",
        padding: "2px 8px",
        borderRadius: 10
      }}>
        {users}
      </div>
    </div>
  );
}

function RuleInput({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 13 }}>{label}</div>
      <input
        type="number"
        value={value}
        style={input}
        onChange={e => onChange(Number(e.target.value))}
      />
      <small>% of total score</small>
    </div>
  );
}

function Integration({ name, status }) {
  return (
    <div style={{
      background: "#f9fafb",
      padding: 15,
      borderRadius: 10
    }}>
      <b>{name}</b>
      <div style={{ color: "#16a34a", fontSize: 13 }}>{status}</div>
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

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const primaryBtn = {
  marginTop: 15,
  background: "#6366f1",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};
