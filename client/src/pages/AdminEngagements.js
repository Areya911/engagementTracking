import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminEngagements() {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await API.get("/engagements");
        setData(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (id, status) => {
        await API.put(`/engagements/${id}`, { status });
        fetchData();
    };

    return (
        <div style={{ padding: 50 }}>
            <h2>Engagement Records (Admin)</h2>

            {data.map(e => (
                <div key={e._id} style={{ marginBottom: 20 }}>
                    <b>User:</b> {e.user.name} <br />
                    <b>Activity:</b> {e.activity.name} <br />
                    <b>Status:</b> {e.attendanceStatus} <br />

                    <button onClick={() => updateStatus(e._id, "attended")}>
                        Mark Attended
                    </button>

                    <button onClick={() => updateStatus(e._id, "completed")}>
                        Mark Completed
                    </button>

                    <hr />
                </div>
            ))}
        </div>
    );
}
