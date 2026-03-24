import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function CoursePlayer() {
  const { engagementId } = useParams();
  const navigate = useNavigate();

  const [engagement, setEngagement] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  
  const playerRef = useRef(null);
  const syncIntervalRef = useRef(null);
  const playTimeRef = useRef(0);
  const lastTimeRef = useRef(-1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    load();
    return () => stopTracking();
  }, [engagementId]);

  const load = async () => {
    try {
      const res = await API.get(`/engagements/${engagementId}`);
      setEngagement(res.data);
    } catch { console.error("Failed to load course"); }
  };

  const initYouTubePlayer = (videoId) => {
    if (window.YT && window.YT.Player) {
      createPlayer(videoId);
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => createPlayer(videoId);
    }
  };

  const createPlayer = (videoId) => {
    if (playerRef.current) return;
    playerRef.current = new window.YT.Player("video-player", {
      videoId,
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onStateChange: onPlayerStateChange
      }
    });
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      startTracking();
    } else {
      stopTracking();
      // Sync immediately when paused/ended
      syncProgress();
    }
  };

  const startTracking = () => {
    if (syncIntervalRef.current) return;
    
    // Poll every 1 second
    syncIntervalRef.current = setInterval(() => {
      if (!playerRef.current || !playerRef.current.getCurrentTime) return;
      
      const currentTime = playerRef.current.getCurrentTime();
      if (lastTimeRef.current !== -1) {
        const diff = currentTime - lastTimeRef.current;
        // Count if playing normally (diff is roughly 1 second, avoid jumps > 3s)
        if (diff > 0 && diff < 3) {
          playTimeRef.current += diff;
        }
      }
      lastTimeRef.current = currentTime;

      // Sync every 5 seconds of watch time
      if (playTimeRef.current >= 5) {
        syncProgress();
      }
    }, 1000);
  };

  const stopTracking = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    lastTimeRef.current = -1;
  };

  const syncProgress = async () => {
    const watchSeconds = Math.floor(playTimeRef.current);
    if (watchSeconds <= 0) return;
    
    playTimeRef.current -= watchSeconds; // Keep remainder
    
    let totalVideoSeconds = 120; // Default fallback
    if (playerRef.current && playerRef.current.getDuration) {
      const d = playerRef.current.getDuration();
      if (d > 0) totalVideoSeconds = d;
    }

    try {
      const res = await API.put(`/engagements/course/${engagementId}`, {
        watchSeconds,
        totalVideoSeconds
      });
      setEngagement(res.data);
    } catch {}
  };

  useEffect(() => {
    if (engagement?.activity?.youtubeUrl && !playerRef.current) {
      const url = engagement.activity.youtubeUrl;
      let videoId = "";
      if (url.includes("watch?v=")) videoId = url.split("watch?v=")[1].split("&")[0];
      else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
      
      if (videoId) initYouTubePlayer(videoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagement]);

  const saveNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    let totalVideoSeconds = 120;
    if (playerRef.current?.getDuration) {
      const d = playerRef.current.getDuration();
      if (d > 0) totalVideoSeconds = d;
    }
    try {
      const res = await API.put(`/engagements/course/${engagementId}`, {
        watchSeconds: 0, totalVideoSeconds, noteText: note
      });
      setEngagement(res.data);
      setNote("");
    } catch { alert("Failed to save note"); }
    finally { setSaving(false); }
  };

  if (!engagement) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 80, color: "#9CA3AF" }}>Loading…</div>
  );

  const progress = engagement.progress || 0;
  const barColor = progress >= 100 ? "#10B981" : progress >= 50 ? "#F59E0B" : "#4F46E5";
  const watchTimeStr = engagement.watchTime > 3600 
    ? (engagement.watchTime / 3600).toFixed(1) + "h"
    : Math.floor((engagement.watchTime || 0) / 60) + "m " + ((engagement.watchTime || 0) % 60) + "s";

  const isExpired = engagement.activity?.endDate && new Date(engagement.activity.endDate) < new Date();

  return (
    <div>
      <button onClick={() => navigate("/user/courses")} style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: "transparent",
        border: "none", color: "#6B7280", fontSize: 14, fontWeight: 600,
        cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: "inherit"
      }}>← Back to Courses</button>

      {isExpired && (
        <div style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA",
          padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
          This course has expired. Your progress can no longer be updated.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22 }}>
        <div>
          <div className="card" style={{ marginBottom: 18 }}>
            <h2 className="section-title" style={{ marginBottom: 8 }}>
              {engagement.activity?.name}
            </h2>
            <p className="body-text" style={{ marginBottom: 16 }}>
              {engagement.activity?.description || "Watch the video to track your progress."}
            </p>

            <div style={{ borderRadius: 12, overflow: "hidden", background: "#0F172A", position: "relative", paddingTop: "56.25%" }}>
              <div id="video-player" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 className="card-title">Course Progress</h3>
              <span style={{ fontWeight: 800, fontSize: 18, color: barColor }}>{progress}%</span>
            </div>
            <div className="progress-track" style={{ height: 12 }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: barColor }} />
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 14 }}>
              <div style={{ fontSize: 13, color: "#374151" }}>
                <span className="small-text">Watch time: </span>
                <strong>{watchTimeStr}</strong>
              </div>
              <div style={{ fontSize: 13, color: "#374151" }}>
                <span className="small-text">Status: </span>
                <strong style={{ color: barColor }}>
                  {progress >= 100 ? "Completed" : progress > 0 ? "In Progress" : "Not Started"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ height: "fit-content" }}>
          <h3 className="card-title" style={{ marginBottom: 14 }}>Notes</h3>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Write your notes while watching…"
            className="form-textarea"
            style={{ width: "100%", minHeight: 120, boxSizing: "border-box" }}
          />
          <button
            onClick={saveNote}
            disabled={saving || !note.trim()}
            className="btn-primary"
            style={{ width: "100%", marginTop: 10, justifyContent: "center" }}
          >
            {saving ? "Saving…" : "Save Note"}
          </button>

          {engagement.notes?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div className="small-text" style={{ fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", marginBottom: 12 }}>
                Saved Notes ({engagement.notes.length})
              </div>
              <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {[...engagement.notes].reverse().map((n, i) => (
                  <div key={i} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB",
                    borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontSize: 13.5, color: "#111827", margin: "0 0 6px" }}>{n.text}</p>
                    <small style={{ fontSize: 11, color: "#6B7280" }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}