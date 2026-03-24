import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";
import {
  DashboardIcon, CoursesIcon, ActivitiesIcon, ProgressIcon,
  NotificationsIcon, ProfileIcon, LogoutIcon, AnalyticsIcon
} from "../../components/icons/Icons";

const navItems = [
  { to: "/user/dashboard",     label: "Dashboard",      Icon: DashboardIcon },
  { to: "/user/courses",       label: "My Courses",     Icon: CoursesIcon },
  { to: "/user/activities",    label: "My Activities",  Icon: ActivitiesIcon },
  { to: "/user/progress",      label: "Progress",       Icon: ProgressIcon },
  { to: "/user/notifications", label: "Notifications",  Icon: NotificationsIcon },
  { to: "/user/profile",       label: "Profile",        Icon: ProfileIcon },
];

export default function UserLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "ST";

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <AnalyticsIcon size={18} aria-label="EduTrack" />
          </div>
          <div className="sidebar-brand-text">
            <h2>EduTrack</h2>
            <p>Student Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <span className="sidebar-icon">
                <Icon size={18} aria-label={label} />
              </span>
              <span className="sidebar-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-row">
            <div className="topbar-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
              {initials}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || "Student"}</div>
              <div className="sidebar-user-role">Student</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} aria-label="Sign out">
            <LogoutIcon size={15} />
            <span className="sidebar-link-label">Sign Out</span>
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-user-name" style={{ fontSize: 14, fontWeight: 600 }}>
              Welcome back, {user?.name?.split(" ")[0] || "Student"}
            </span>
          </div>
          <div className="topbar-right">
            <span className="topbar-role-badge student">STUDENT</span>
            <div className="topbar-avatar">{initials}</div>
          </div>
        </div>
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}