import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div style={container}>

      {/* SIDEBAR */}
      <div style={sidebar}>

        <div>
          <h2 style={{ marginBottom: 5 }}>EduTrack</h2>
          <p style={subText}>User Panel</p>
        </div>

        <nav style={{ marginTop: 40 }}>

          <NavLink
            to="/user/dashboard"
            style={({ isActive }) =>
              isActive ? activeLink : link
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/user/activities"
            style={({ isActive }) =>
              isActive ? activeLink : link
            }
          >
            Activities
          </NavLink>

          <NavLink
            to="/user/courses"
            style={({ isActive }) =>
              isActive ? activeLink : link
            }
          >
            Courses
          </NavLink>

          <NavLink
            to="/user/progress"
            style={({ isActive }) =>
              isActive ? activeLink : link
            }
          >
            My Progress
          </NavLink>

          <NavLink
            to="/user/profile"
            style={({ isActive }) =>
              isActive ? activeLink : link
            }
          >
            Profile
          </NavLink>

        </nav>

      </div>

      {/* MAIN CONTENT */}
      <div style={mainContent}>
        <Outlet />
      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  minHeight: "100vh",
  background: "#f3f4f6"
};

const sidebar = {
  width: 230,
  background: "linear-gradient(180deg, #0b1a3a, #111c44)",
  color: "white",
  padding: "25px 20px",
  display: "flex",
  flexDirection: "column"
};

const subText = {
  fontSize: 12,
  opacity: 0.6,
  marginTop: -5
};

const link = {
  display: "block",
  color: "white",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 8,
  marginBottom: 10,
  transition: "all 0.2s ease"
};

const activeLink = {
  ...link,
  background: "#5a4de1",
  fontWeight: "600"
};

const mainContent = {
  flex: 1,
  padding: "35px",
  background: "#f3f4f6"
};