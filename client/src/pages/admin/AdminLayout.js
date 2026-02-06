import { Link, Outlet } from "react-router-dom";
import "../../styles/admin.css";
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaTasks,
  FaFileAlt,
  FaBell,
  FaCog
} from "react-icons/fa";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      
      <div className="sidebar">
        <h2>EduTrack</h2>
        <p>Engagement Analytics</p>

        <Link to="/admin"><FaTachometerAlt /> Dashboard</Link>
        <Link to="/admin/users"><FaUsers /> Users</Link>
        <Link to="/admin/activities"><FaTasks /> Activities</Link>
        <Link to="/admin/analytics"><FaChartBar /> Analytics</Link>
        <Link to="/admin/reports"><FaFileAlt /> Reports</Link>
        <Link to="/admin/alerts"><FaBell /> Alerts</Link>
        <Link to="/admin/settings"><FaCog /> Settings</Link>
      </div>

      <div className="main-content">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <div className="topbar">
      <input placeholder="Search..." />
      <div>Admin</div>
    </div>
  );
}
