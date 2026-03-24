import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend
} from "recharts";

const COLORS = ["#4f46e5","#f59e0b","#10b981","#ef4444","#8b5cf6"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [aRes, uRes] = await Promise.all([
      API.get("/dashboard/analytics"),
      API.get("/users"),
    ]);
    setAnalytics(aRes.data);
    setUsers(uRes.data.filter(u => u.role === "user"));
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">Analytics</div>
          <div className="section-subtitle">Engagement insights across the institution</div>
        </div>
      </div>

      {/* ROW 1 */}
      <div className="grid-2" style={{ marginBottom: 22 }}>
        {/* Monthly engagement trend */}
        <div className="card">
          <h3 style={cardTitle}>Monthly Engagement Trend</h3>
          <p style={cardSub}>Total activity registrations per month</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics?.monthly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="card">
          <h3 style={cardTitle}>Activity Type Distribution</h3>
          <p style={cardSub}>Breakdown by category</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={analytics?.categoryData || []} dataKey="value" nameKey="name"
                outerRadius={100} innerRadius={55} paddingAngle={3} label>
                {(analytics?.categoryData || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid-2">
        {/* Department engagement */}
        <div className="card">
          <h3 style={cardTitle}>Department Engagement</h3>
          <p style={cardSub}>Registrations vs Attendance by department</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics?.departmentData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="registered" fill="#c7d2fe" name="Registered" radius={[4,4,0,0]} />
              <Bar dataKey="present"    fill="#4f46e5"  name="Present"    radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student score list */}
        <div className="card">
          <h3 style={cardTitle}>Student Engagement Scores</h3>
          <p style={cardSub}>Individual engagement breakdown</p>
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {users.map(u => {
              const score = u.engagementScore || 0;
              const pct   = Math.min(score, 100);
              const color = score < 20 ? "#ef4444" : score <= 50 ? "#f59e0b" : "#10b981";
              return (
                <div key={u._id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b" }}>{u.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
            {users.length === 0 && <p style={{ color: "#94a3b8", fontSize: 13 }}>No students yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardTitle = { fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 2 };
const cardSub   = { fontSize: 12.5, color: "#64748b", marginBottom: 14 };