import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";
import {
  DashboardIcon, UsersIcon, ActivitiesIcon, AnalyticsIcon,
  ReportsIcon, AlertsIcon, SettingsIcon, LogoutIcon, SearchIcon,
  MenuIcon
} from "../../components/icons/Icons";

const navItems = [
  { to: "/admin",            label: "Dashboard",  Icon: DashboardIcon,  end: true },
  { to: "/admin/users",      label: "Users",      Icon: UsersIcon },
  { to: "/admin/activities", label: "Activities", Icon: ActivitiesIcon },
  { to: "/admin/analytics",  label: "Analytics",  Icon: AnalyticsIcon },
  { to: "/admin/reports",    label: "Reports",    Icon: ReportsIcon },
  { to: "/admin/alerts",     label: "Alerts",     Icon: AlertsIcon },
  { to: "/admin/settings",   label: "Settings",   Icon: SettingsIcon },
];

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className={`sidebar${collapsed ? " collapsed" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <AnalyticsIcon size={18} aria-label="EduTrack" />
          </div>
          <div className="sidebar-brand-text">
            <h2>EduTrack</h2>
            <p>Engagement Intelligence</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
              <div className="sidebar-user-name">{user?.name || "Admin"}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} aria-label="Sign out">
            <LogoutIcon size={15} />
            <span className="sidebar-link-label">Sign Out</span>
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", padding: 4 }}
              aria-label="Toggle sidebar"
            >
              <MenuIcon size={20} />
            </button>
            <div className="topbar-search-wrap">
              <span className="topbar-search-icon">
                <SearchIcon size={15} aria-label="Search" />
              </span>
              <input className="topbar-search" placeholder="Search anything..." aria-label="Search" />
            </div>
          </div>
          <div className="topbar-right">
            <span className="topbar-role-badge">ADMIN</span>
            <span className="topbar-user-name">{user?.name || "Admin"}</span>
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
