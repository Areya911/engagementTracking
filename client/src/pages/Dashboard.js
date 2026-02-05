import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        API.get("/dashboard")
            .then(res => setStats(res.data));
    }, []);

    if (!stats) return <h3>Loading...</h3>;

    return (
        <div style={{ padding: 50 }}>
            <h2>Admin Dashboard</h2>
            <p>Total Users: {stats.totalUsers}</p>
            <p>Total Activities: {stats.totalActivities}</p>
            <p>Total Engagements: {stats.totalEngagements}</p>
        </div>
    );
}
