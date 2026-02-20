import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user/dashboard");
      }

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h1 className="logo">EDUTRACK</h1>
        <p className="subtitle">Engagement Tracking System</p>

        {/* ROLE TOGGLE */}
        <div className="role-toggle">
          <button
            className={role === "admin" ? "active-role" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>

          <button
            className={role === "student" ? "active-role" : ""}
            onClick={() => setRole("student")}
          >
            Student
          </button>
        </div>

        {/* EMAIL */}
        <label>Email Address</label>
        <input
          type="email"
          placeholder={role === "admin" ? "admin@edu.in" : "kavya@edu.in"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Sign In to EduTrack
        </button>

  

      </div>
    </div>
  );
}