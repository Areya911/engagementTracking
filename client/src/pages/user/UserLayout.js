import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      <div style={{
        width: "220px",
        background: "#0b1a3a",
        color: "white",
        padding: "20px"
      }}>
        <h2>EduTrack</h2>
        <p style={{ fontSize: "12px", opacity: 0.7 }}>User Panel</p>

        <nav style={{ marginTop: "30px" }}>
          <Link to="/user/dashboard" style={link}>Dashboard</Link>
          <Link to="/user/activities" style={link}>Activities</Link>
          <Link to="/user/progress" style={link}>My Progress</Link>
          <Link to="/user/profile" style={link}>Profile</Link>
        </nav>
      </div>

      <div style={{ flex: 1, padding: "30px" }}>
        <Outlet />
      </div>
    </div>
  );
}

const link = {
  display: "block",
  color: "white",
  textDecoration: "none",
  margin: "12px 0"
};
