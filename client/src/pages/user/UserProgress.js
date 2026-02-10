export default function UserProgress() {
  const weeklyHours = 8.5;

  const courses = [
    { name: "Data Structures", progress: 75 },
    { name: "ML Basics", progress: 52 },
    { name: "Advanced Python", progress: 0 },
    { name: "Web Dev", progress: 100 }
  ];

  return (
    <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20 }}>Your Progress</h1>

      {/* TOP SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        
        {/* LEARNING TIME */}
        <div style={card}>
          <h3>Learning Time This Week</h3>

          <div style={chartBox}>
            <div style={{ marginTop: 80, color: "#64748b" }}>
              Mon &nbsp; Tue &nbsp; Wed &nbsp; Thu &nbsp; Fri &nbsp; Sat &nbsp; Sun
            </div>

            <div style={{ marginTop: 20, fontWeight: 600 }}>
              Total: {weeklyHours} hours
            </div>
          </div>
        </div>

        {/* COURSE PROGRESS */}
        <div style={card}>
          <h3>Course Progress</h3>

          {courses.map((c, i) => (
            <div key={i} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{c.name}</span>
                <b style={{ color: "#4f46e5" }}>{c.progress}%</b>
              </div>

              <div style={progressBg}>
                <div
                  style={{
                    ...progressFill,
                    width: `${c.progress}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PERFORMANCE SUMMARY */}
      <div style={{ marginTop: 25 }}>
        <h3 style={{ marginBottom: 12 }}>Performance Summary</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20
        }}>
          <Summary title="Avg Quiz Score" value="88%" />
          <Summary title="Assignments Done" value="12/15" />
          <Summary title="Discussion Posts" value="34" />
          <Summary title="Live Sessions" value="8/10" />
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Summary({ title, value }) {
  return (
    <div style={summaryCard}>
      <div style={{ color: "#64748b", fontSize: 13 }}>{title}</div>
      <h2 style={{ marginTop: 8, color: "#4f46e5" }}>{value}</h2>
    </div>
  );
}

/* ---------- STYLES ---------- */

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const chartBox = {
  height: 180,
  marginTop: 15,
  borderRadius: 10,
  background: "#f1f5f9",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const progressBg = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 10,
  marginTop: 6
};

const progressFill = {
  height: "100%",
  background: "#6366f1",
  borderRadius: 10
};

const summaryCard = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};
