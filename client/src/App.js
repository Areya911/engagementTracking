import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import UserActivities from "./pages/UserActivities";
import AdminEngagements from "./pages/AdminEngagements";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/user-activities" element={<UserActivities />} />
          <Route path="/admin-engagements" element={<AdminEngagements />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
