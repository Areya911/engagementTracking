import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const [form, setForm] = useState({
        name: "",
        category: "",
        date: "",
        duration: "",
        description: ""
    });

    const fetchActivities = async () => {
        const res = await API.get("/activities");
        setActivities(res.data);
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleCreate = async () => {
        await API.post("/activities", form);
        fetchActivities();
    };

    return (
        <div style={{ padding: 50 }}>
            <h2>Activities</h2>

            <h3>Create Activity (Admin)</h3>
            <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
            <br /><br />
            <input placeholder="Category" onChange={e => setForm({...form, category: e.target.value})} />
            <br /><br />
            <input type="date" onChange={e => setForm({...form, date: e.target.value})} />
            <br /><br />
            <input placeholder="Duration" onChange={e => setForm({...form, duration: e.target.value})} />
            <br /><br />
            <input placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
            <br /><br />
            <button onClick={handleCreate}>Create</button>

            <hr />

            <h3>All Activities</h3>
            {activities.map(a => (
                <div key={a._id}>
                    <b>{a.name}</b> - {a.category} - {a.duration}
                </div>
            ))}
        </div>
    );
}
