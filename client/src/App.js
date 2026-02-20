import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminUserProfile from "./pages/admin/AdminUserProfile";
import Activities from "./pages/admin/Activities";
import Analytics from "./pages/admin/Analytics";
import Reports from "./pages/admin/Reports";
import Alerts from "./pages/admin/Alerts";
import Settings from "./pages/admin/Settings";

// User Pages
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import UserActivities from "./pages/user/UserActivities";
import WatchActivity from "./pages/user/WatchActivity";
import UserProgress from "./pages/user/UserProgress";
import UserProfile from "./pages/user/UserProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<AdminUserProfile />} />
            <Route path="activities" element={<Activities />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
          </Route>
            <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="activities" element={<UserActivities />} />
            <Route path="watch/:id" element={<WatchActivity />} /> link
            <Route path="progress" element={<UserProgress />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
