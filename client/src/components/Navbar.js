import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) return null;

    return (
        <div style={{ padding: 20, borderBottom: "1px solid black", marginBottom: 20 }}>
            <Link to="/dashboard">Dashboard</Link> |{" "}

            {user.role === "admin" && (
                <>
                    <Link to="/activities">Activities</Link> |{" "}
                    <Link to="/admin-engagements">Engagements</Link> |{" "}
                </>
            )}

            {user.role === "user" && (
                <>
                    <Link to="/user-activities">Activities</Link> |{" "}
                </>
            )}

            <button onClick={handleLogout} style={{ marginLeft: 20 }}>
                Logout
            </button>
        </div>
    );
}
