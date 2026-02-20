import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Activities() {

  const [activities, setActivities] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [newActivity, setNewActivity] = useState({
    name: "",
    category: "Quiz",
    date: ""
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const act = await API.get("/activities");
    const eng = await API.get("/engagements");

    setActivities(act.data);
    setEngagements(eng.data);
  };

  const createActivity = async () => {
    await API.post("/activities", newActivity);
    setShowAdd(false);
    setNewActivity({ name: "", category: "Quiz", date: "" });
    load();
  };

  const openAttendance = (activity) => {
    const participants = engagements.filter(
      e => e.activity?._id === activity._id
    );

    setSelected({ ...activity, participants });
  };

  const markAttendance = async (id, status) => {
    await API.put(`/engagements/${id}`, { status });
    load();
    openAttendance(selected);
  };

  const getStatus = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate < today ? "Completed" : "Upcoming";
  };

  return (
    <div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Activities & Events</h1>
        <button style={addBtn} onClick={() => setShowAdd(true)}>
          + Add Event
        </button>
      </div>

      {activities.length === 0 && (
        <div style={emptyBox}>
          <h3>No activities created yet</h3>
          <p>Create an event to start tracking engagement.</p>
        </div>
      )}

      {activities.length > 0 && (
        <div style={table}>
          <div style={header}>
            <div>Event Name</div>
            <div>Category</div>
            <div>Date</div>
            <div>Participants</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {activities.map(a => {
            const count = engagements.filter(
              e => e.activity?._id === a._id
            ).length;

            return (
              <div key={a._id} style={row}>
                <div>{a.name}</div>
                <div>{a.category}</div>
                <div>{new Date(a.date).toLocaleDateString()}</div>
                <div>{count}</div>
                <div>{getStatus(a.date)}</div>
                <div>
                  <button
                    style={actionBtn}
                    onClick={() => openAttendance(a)}
                  >
                    Mark Attendance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showAdd && (
        <div style={overlay}>
          <div style={modal}>
            <h2>Add Event</h2>

            <input
              placeholder="Event Name"
              value={newActivity.name}
              onChange={e =>
                setNewActivity({ ...newActivity, name: e.target.value })
              }
              style={input}
            />

            <select
              value={newActivity.category}
              onChange={e =>
                setNewActivity({ ...newActivity, category: e.target.value })
              }
              style={input}
            >
              <option>Quiz</option>
              <option>Hackathon</option>
              <option>Conference</option>
              <option>Workshop</option>
              <option>Course</option>
            </select>

            <input
              type="date"
              value={newActivity.date}
              onChange={e =>
                setNewActivity({ ...newActivity, date: e.target.value })
              }
              style={input}
            />

            <button style={addBtn} onClick={createActivity}>
              Create Event
            </button>

            <button onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/* STYLES */

const addBtn = {
  background: "#5a4de1",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};

const actionBtn = {
  background: "#5a4de1",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: 8
};

const emptyBox = {
  background: "white",
  padding: 40,
  borderRadius: 20,
  textAlign: "center",
  marginTop: 20
};

const table = {
  background: "white",
  padding: 20,
  borderRadius: 20,
  marginTop: 20
};

const header = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
  fontWeight: 600
};

const row = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
  padding: 15,
  borderTop: "1px solid #eee",
  alignItems: "center"
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "white",
  padding: 30,
  borderRadius: 20,
  width: 400,
  display: "flex",
  flexDirection: "column",
  gap: 10
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd"
};