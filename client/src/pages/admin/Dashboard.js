import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  UsersIcon, ActivitiesIcon, TrendingIcon, AlertsIcon,
  AnalyticsIcon, ScoreIcon
} from "../../components/icons/Icons";

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [statsRes, usersRes, engRes] = await Promise.all([
        API.get("/dashboard"),
        API.get("/users"),
        API.get("/engagements"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.filter(u => u.role === "user"));
      setEngagements(engRes.data);
      buildTrend(engRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const buildTrend = (data) => {
    const map = {};
    data.forEach(e => {
      const m = new Date(e.createdAt).toLocaleString("default", { month: "short" });
      map[m] = (map[m] || 0) + 1;
    });
    setTrendData(Object.keys(map).map(m => ({ month: m, value: map[m] })));
  };

  const activeToday = engagements.filter(e =>
    new Date(e.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  const atRisk = users.filter(u => (u.engagementScore || 0) < 20).length;
  const avgScore = users.length
    ? Math.round(users.reduce((a, u) => a + (u.engagementScore || 0), 0) / users.length)
    : 0;

  const dropOff  = users.filter(u => (u.engagementScore || 0) < 20).slice(0, 3);
  const topUsers = users.filter(u => (u.engagementScore || 0) > 50).slice(0, 3);

  const statCards = [
    { Icon: UsersIcon,      label: "Total Students",  value: stats?.totalUsers ?? "–",    color: "#4F46E5", bg: "#EEF2FF" },
    { Icon: ActivitiesIcon, label: "Total Activities", value: stats?.totalActivities ?? "–", color: "#0EA5E9", bg: "#E0F2FE" },
    { Icon: TrendingIcon,   label: "Active Today",    value: activeToday,                 color: "#10B981", bg: "#DCFCE7" },
    { Icon: AlertsIcon,     label: "At Risk",         value: atRisk,                     color: "#EF4444", bg: "#FEE2E2" },
  ];

  return (
    <div>
      {/* HERO */}
      <div className="hero-banner" style={{ marginBottom: 24 }}>
        <div className="hero-title">Good morning, Admin</div>
        <div className="hero-sub">Here is what's happening across your institution today.</div>
        <div className="hero-pills">
          <div className="hero-pill">
            <ScoreIcon size={15} aria-label="Average score" />
            Avg Score: <strong>{avgScore}</strong>
          </div>
          <div className="hero-pill">
            <AnalyticsIcon size={15} aria-label="Total engagements" />
            Engagements: <strong>{stats?.totalEngagements ?? "–"}</strong>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {statCards.map(c => (
          <div className="stat-card" key={c.label}>
            <div className="stat-icon" style={{ background: c.bg, color: c.color }}>
              <c.Icon size={22} aria-label={c.label} />
            </div>
            <div>
              <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS + INSIGHTS */}
      <div className="grid-2-1">
        {/* TREND CHART */}
        <div className="card">
          <div style={{ marginBottom: 14 }}>
            <div className="card-title">Engagement Trend</div>
            <div className="small-text">Monthly activity registrations</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2.5}
                dot={{ r: 4, fill: "#4F46E5" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INSIGHT CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InsightCard
            color="#FEF2F2" border="#FCA5A5"
            title="Drop-off Risk"
            desc={`${dropOff.length} students at high risk`}
            tags={dropOff.map(u => u.name)}
            dotClass="danger"
          />
          <InsightCard
            color="#FFFBEB" border="#FCD34D"
            title="Peak Activity"
            desc="Highest engagement 6 PM – 9 PM"
            tags={[]}
            dotClass="warning"
          />
          <InsightCard
            color="#F0FDF4" border="#6EE7B7"
            title="Top Performers"
            desc={`${topUsers.length} students with score > 50`}
            tags={topUsers.map(u => u.name)}
            dotClass="success"
          />
        </div>
      </div>

      {/* DISTRIBUTION */}
      {stats?.engagementDistribution && (
        <div className="card" style={{ marginTop: 22 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>Engagement Distribution</div>
          <div style={{ display: "flex", gap: 14 }}>
            <DistBar label="High Risk"  value={stats.engagementDistribution.highRisk}
              total={stats.totalUsers} color="#EF4444" />
            <DistBar label="Moderate"   value={stats.engagementDistribution.moderate}
              total={stats.totalUsers} color="#F59E0B" />
            <DistBar label="Healthy"    value={stats.engagementDistribution.healthy}
              total={stats.totalUsers} color="#10B981" />
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ color, border, title, desc, tags, dotClass }) {
  return (
    <div style={{ background: color, borderLeft: `3px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span className={`status-dot ${dotClass}`} />
        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#111827" }}>{title}</div>
      </div>
      <div style={{ fontSize: 13, color: "#374151", marginBottom: tags.length ? 8 : 0 }}>{desc}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tags.map((t, i) => (
          <span key={i} style={{ background: "rgba(255,255,255,0.65)", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#374151" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function DistBar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ flex: 1, background: "#F9FAFB", borderRadius: 10, padding: "16px 18px", border: "1px solid #E5E7EB" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
        <strong style={{ color }}>{value}</strong>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="small-text" style={{ marginTop: 6 }}>{pct}% of students</div>
    </div>
  );
}