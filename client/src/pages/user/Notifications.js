import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await API.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) { console.error(err); }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">Notifications 🔔</div>
          <div className="section-subtitle">
            {unread > 0 ? <><strong>{unread}</strong> unread notification{unread !== 1 ? "s" : ""}</> : "All caught up!"}
          </div>
        </div>
        {unread > 0 && (
          <button className="btn-outline" onClick={() => {
            notifications.filter(n => !n.read).forEach(n => markRead(n._id));
          }}>
            ✓ Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p>You're all caught up! Notifications from your institution will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notifications.map(n => (
            <div key={n._id}
              onClick={() => { if (!n.read) markRead(n._id); }}
              style={{
                background: n.read ? "white" : "#eef2ff",
                border: `1.5px solid ${n.read ? "#e2e8f0" : "#c7d2fe"}`,
                borderRadius: 16, padding: "16px 20px",
                display: "flex", alignItems: "flex-start", gap: 16,
                cursor: n.read ? "default" : "pointer",
                transition: "all 0.2s"
              }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: n.read ? "#f1f5f9" : "#e0e7ff",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
              }}>
                {n.message?.startsWith("⚠️") ? "⚠️" : n.message?.startsWith("🎉") ? "🎉" : "📌"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: "#1e293b", margin: "0 0 6px", lineHeight: 1.5 }}>
                  {n.message}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                  {!n.read && (
                    <span style={{ background: "#4f46e5", color: "white", fontSize: 10,
                      fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.04em" }}>
                      NEW
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}