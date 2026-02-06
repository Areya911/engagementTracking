import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: 230,
        background: "#0f172a",
        color: "white",
        padding: 20
      }}>
        <h2>EduTrack</h2>
        <p style={{ fontSize: 12, opacity: 0.7 }}>Engagement Analytics</p>

        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 15 }}>
          <Link to="/admin" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/admin/users" style={{ color: "white" }}>Users</Link>
          <Link to="/admin/analytics" style={{ color: "white" }}>Analytics</Link>
          <Link to="/admin/activities" style={{ color: "white" }}>Activities</Link>
          <Link to="/admin/reports" style={{ color: "white" }}>Reports</Link>
          <Link to="/admin/alerts" style={{ color: "white" }}>Alerts</Link>
          <Link to="/admin/settings" style={{ color: "white" }}>Settings</Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 30, background: "#f8fafc" }}>
        <Outlet />
      </div>
    </div>
  );
}
