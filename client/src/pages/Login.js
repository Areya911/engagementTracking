import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      login(res.data);

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
        <h2 className="title">EduTrack</h2>
        <p className="subtitle">Sign in to continue</p>

        <input
          className="input"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
