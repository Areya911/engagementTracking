import { useState } from "react";

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    institutionName: "State University",
    adminEmail: "admin@state.edu",
    scoreThresholdHigh: 20,
    scoreThresholdModerate: 50,
    autoNotify: true,
    emailAlerts: true,
  });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">Settings</div>
          <div className="section-subtitle">Platform configuration and preferences</div>
        </div>
      </div>

      {saved && (
        <div style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0",
          borderRadius: 10, padding: "10px 18px", marginBottom: 18, fontWeight: 600, fontSize: 13.5 }}>
          ✅ Settings saved successfully
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {/* Institution */}
        <div className="card">
          <h3 style={sectionH}>🏫 Institution</h3>
          <div className="form-group">
            <label className="form-label">Institution Name</label>
            <input className="form-input" value={config.institutionName}
              onChange={e => setConfig({ ...config, institutionName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input className="form-input" type="email" value={config.adminEmail}
              onChange={e => setConfig({ ...config, adminEmail: e.target.value })} />
          </div>
        </div>

        {/* Score thresholds */}
        <div className="card">
          <h3 style={sectionH}>📊 Engagement Thresholds</h3>
          <div className="form-group">
            <label className="form-label">High Risk — Score Below</label>
            <input className="form-input" type="number" value={config.scoreThresholdHigh}
              onChange={e => setConfig({ ...config, scoreThresholdHigh: +e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Moderate Risk — Score Below</label>
            <input className="form-input" type="number" value={config.scoreThresholdModerate}
              onChange={e => setConfig({ ...config, scoreThresholdModerate: +e.target.value })} />
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 style={sectionH}>🔔 Notifications</h3>
          <ToggleRow
            label="Auto-notify at-risk students"
            desc="Automatically send alerts to high-risk students"
            on={config.autoNotify}
            toggle={() => setConfig({ ...config, autoNotify: !config.autoNotify })}
          />
          <ToggleRow
            label="Email Alerts for admin"
            desc="Send email digest to admin for risk alerts"
            on={config.emailAlerts}
            toggle={() => setConfig({ ...config, emailAlerts: !config.emailAlerts })}
          />
        </div>

        {/* Score rules */}
        <div className="card">
          <h3 style={sectionH}>🎯 Scoring Rules</h3>
          {[
            ["Course completion",      "+40 pts"],
            ["Hackathon participation", "+25 pts"],
            ["Workshop attendance",    "+15 pts"],
            ["Quiz completion",        "+10 pts"],
            ["Conference participation","+8 pts"],
          ].map(([label, pts]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between",
              padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
              <span style={{ color: "#475569" }}>{label}</span>
              <span style={{ fontWeight: 700, color: "#4f46e5" }}>{pts}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <button className="btn-primary" onClick={save}>💾 Save Settings</button>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, on, toggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>{desc}</div>
      </div>
      <div onClick={toggle} style={{
        width: 42, height: 24, borderRadius: 12, cursor: "pointer",
        background: on ? "#4f46e5" : "#e2e8f0",
        position: "relative", transition: "background 0.2s"
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "white",
          position: "absolute", top: 3,
          left: on ? 20 : 3, transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)"
        }} />
      </div>
    </div>
  );
}

const sectionH = { fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 16 };