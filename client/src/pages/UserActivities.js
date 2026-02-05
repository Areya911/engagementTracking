import { useEffect, useState } from "react";
import API from "../api/axios";

export default function UserActivities() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        API.get("/activities")
            .then(res => setActivities(res.data));
    }, []);

    const handleRegister = async (id) => {
        await API.post(`/engagements/register/${id}`);
        alert("Registered successfully!");
    };

    return (
        <div style={{ padding: 50 }}>
            <h2>Available Activities</h2>

            {activities.map(a => (
                <div key={a._id} style={{ marginBottom: 20 }}>
                    <b>{a.name}</b> - {a.category} - {a.duration}
                    <br />
                    <button onClick={() => handleRegister(a._id)}>
                        Register
                    </button>
                </div>
            ))}
        </div>
    );
}
