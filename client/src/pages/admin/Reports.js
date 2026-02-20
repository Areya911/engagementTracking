import { useState } from "react";
import API from "../../api/axios";

export default function Reports() {

  const [search, setSearch] = useState("");
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    const users = await API.get("/users");
    const found = users.data.find(u =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!found) {
      alert("Student not found");
      return;
    }

    const res = await API.get(`/users/report/${found._id}`);
    setReport(res.data);
  };

  return (
    <div>

      <h1>Reports</h1>

      <div style={searchBox}>
        <input
          placeholder="Enter student name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={input}
        />
        <button style={btn} onClick={generateReport}>
          Generate
        </button>
      </div>

      {report && (
        <div style={card}>

          <h2>{report.user.name}</h2>
          <p>{report.user.department}</p>

          <div style={statsRow}>
            <Stat title="Engagement Score" value={`${report.engagementScore}/100`} />
            <Stat title="Total Activities" value={report.totalActivities} />
            <Stat title="Attended" value={report.attended} />
            <Stat title="Completed" value={report.completed} />
          </div>

          <h3>Registered Events</h3>
          {report.engagements.map(e => (
            <div key={e._id} style={engRow}>
              <span>{e.activity?.name}</span>
              <span>{e.attendanceStatus}</span>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={statBox}>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

/* styles */

const searchBox = {
  display: "flex",
  gap: 10,
  marginBottom: 20
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const btn = {
  background: "#5a4de1",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8
};

const card = {
  background: "white",
  padding: 30,
  borderRadius: 20
};

const statsRow = {
  display: "flex",
  gap: 20,
  marginTop: 20
};

const statBox = {
  background: "#f4f5fa",
  padding: 20,
  borderRadius: 15,
  minWidth: 150
};

const engRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: 10,
  borderBottom: "1px solid #eee"
};