import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { subDays, isAfter } from "date-fns";

export default function Analytics() {
  const [engagements, setEngagements] = useState([]);
  const [users, setUsers] = useState([]);
  const [range, setRange] = useState(7);

  useEffect(() => {
    API.get("/engagements").then(res => setEngagements(res.data));

    API.get("/users").then(res => setUsers(res.data));
  }, []);

  /* ---------------- DATE FILTER ---------------- */
  const filteredEngagements = engagements.filter(e =>
    isAfter(new Date(e.createdAt), subDays(new Date(), range))
  );

  /* ---------------- ENGAGEMENT GROWTH ---------------- */
  const getGrowthData = () => {
    const map = {};
    filteredEngagements.forEach(e => {
      const d = new Date(e.createdAt).toLocaleDateString();
      map[d] = (map[d] || 0) + 1;
    });

    return Object.keys(map).map(date => ({
      date,
      count: map[date]
    }));
  };

 
  /* ---------------- STATUS PIE ---------------- */
  const getStatusStats = () => {
    const map = { registered: 0, attended: 0, completed: 0 };

    filteredEngagements.forEach(e => {
      map[e.status] = (map[e.status] || 0) + 1;
    });

    return [
      { name: "Registered", value: map.registered },
      { name: "Attended", value: map.attended },
      { name: "Completed", value: map.completed }
    ];
  };

  /* ---------------- TOP USERS LEADERBOARD ---------------- */
  const getTopUsers = () => {
    const map = {};

    filteredEngagements.forEach(e => {
      map[e.user] = (map[e.user] || 0) + 1;
    });

    return Object.keys(map)
      .map(uid => {
        const user = users.find(u => u._id === uid);
        return {
          name: user?.name || "Unknown",
          score: map[uid]
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  /* ---------------- DROP-OFF DETECTION ---------------- */
  const getDropOffUsers = () => {
    const inactiveCutoff = subDays(new Date(), 14);

    return users.filter(u => {
      const lastEngagement = engagements
        .filter(e => e.user === u._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      return !lastEngagement || new Date(lastEngagement.createdAt) < inactiveCutoff;
    }).slice(0, 5);
  };

  /* ---------------- DEPARTMENT COMPARISON ---------------- */
  const getDepartmentStats = () => {
    const map = {};

    filteredEngagements.forEach(e => {
      const user = users.find(u => u._id === e.user);
      const dept = user?.department || "General";
      map[dept] = (map[dept] || 0) + 1;
    });

    return Object.keys(map).map(dept => ({
      department: dept,
      count: map[dept]
    }));
  };

  /* ---------------- HEATMAP ---------------- */
  const getHeatmap = () => {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const grid = {};

    filteredEngagements.forEach(e => {
      const d = new Date(e.createdAt);
      const day = days[d.getDay()];
      const hour = d.getHours();

      const key = `${day}-${hour}`;
      grid[key] = (grid[key] || 0) + 1;
    });

    return grid;
  };

  const heatmap = getHeatmap();

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

  return (
    <div style={{ padding: 30 }}>
      <h1>Engagement Analytics</h1>

      {/* DATE FILTER */}
      <div style={{ marginBottom: 20 }}>
        <select value={range} onChange={e => setRange(Number(e.target.value))}>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      {/* ROW 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={card}>
          <h3>Engagement Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getGrowthData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getStatusStats()} dataKey="value" outerRadius={100} label>
                {getStatusStats().map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend/>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 30 }}>
        <div style={card}>
          <h3>Top Active Users</h3>
          {getTopUsers().map((u, i) => (
            <div key={i}>{u.name} — {u.score} activities</div>
          ))}
        </div>

        <div style={card}>
          <h3>Drop-off Risk (14+ days inactive)</h3>
          {getDropOffUsers().map(u => (
            <div key={u._id}>{u.name}</div>
          ))}
        </div>
      </div>

      {/* ROW 3 */}
      <div style={{ marginTop: 30 }}>
        <div style={card}>
          <h3>Department Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDepartmentStats()}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="department"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="count" fill="#22c55e"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HEATMAP */}
      <div style={{ marginTop: 30 }}>
        <div style={card}>
          <h3>Activity Heatmap (Hour vs Day)</h3>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
            <div key={day} style={{ display: "flex", gap: 4, marginBottom: 6 }}>
              <div style={{ width: 50 }}>{day}</div>
              {Array.from({ length: 24 }).map((_, hour) => {
                const val = heatmap[`${day}-${hour}`] || 0;
                return (
                  <div key={hour} style={{
                    width: 12,
                    height: 12,
                    background: `rgba(99,102,241,${val / 5})`,
                    borderRadius: 2
                  }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};
