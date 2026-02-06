import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then(res => setStats(res.data));
  }, []);

  if (!stats) return <h2>Loading analytics...</h2>;

  // Convert engagement status stats into chart data
  const engagementData = stats.statusStats.map(item => ({
    name: item._id,
    value: item.count
  }));

  // Activity participation chart
  const activityData = stats.activityStats.map(item => ({
    name: item._id,
    participants: item.participants
  }));

  const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

  return (
    <div>
      <h1>Analytics</h1>

      {/* PIE CHART — Engagement Distribution */}
      <div style={{ width: "100%", height: 350, marginTop: 40 }}>
        <h3>Engagement Distribution</h3>

        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={engagementData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
              nameKey="name"
            >
              {engagementData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART — Activity Participation */}
      <div style={{ width: "100%", height: 350, marginTop: 50 }}>
        <h3>Activity Participation</h3>

        <ResponsiveContainer>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="participants" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
