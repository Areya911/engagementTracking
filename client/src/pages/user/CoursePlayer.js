import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function CoursePlayer() {
  const { engagementId } = useParams();
  const videoRef = useRef(null);

  const [engagement, setEngagement] = useState(null);
  const [note, setNote] = useState("");
  const [lastTime, setLastTime] = useState(0);

  // Load engagement
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/engagements/${engagementId}`);
        setEngagement(res.data);
      } catch {
        console.error("Failed to load course");
      }
    };
    load();
  }, [engagementId]);

  // Track real watch time
  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    if (!video) return;

    const current = Math.floor(video.currentTime);

    // every 5 minutes
    if (current - lastTime >= 300) {
      try {
        const res = await API.put(`/engagements/course/${engagementId}`, {
          watchSeconds: 300
        });
        setEngagement(res.data);
        setLastTime(current);
      } catch {
        console.error("Progress update failed");
      }
    }
  };

  // Save note
  const saveNote = async () => {
    if (!note.trim()) return;

    try {
      const res = await API.put(`/engagements/course/${engagementId}`, {
        watchSeconds: 0,
        noteText: note
      });
      setEngagement(res.data);
      setNote("");
    } catch {
      console.error("Note save failed");
    }
  };

  if (!engagement) return <p style={{ padding: 30 }}>Loading...</p>;

  const videoSrc = engagement.activity.youtubeUrl
    ?.replace("watch?v=", "embed/");

  return (
    <div style={container}>
      {/* VIDEO */}
      <div style={videoSection}>
        <h2>{engagement.activity.name}</h2>

        <iframe
          ref={videoRef}
          src={videoSrc}
          width="100%"
          height="400"
          onTimeUpdate={handleTimeUpdate}
          allowFullScreen
          style={{ borderRadius: 12 }}
        />

        <div style={{ marginTop: 15 }}>
          <div style={progressBg}>
            <div
              style={{
                ...progressFill,
                width: `${engagement.progress}%`
              }}
            />
          </div>
          <p style={{ textAlign: "right" }}>
            {engagement.progress}%
          </p>
        </div>
      </div>

      {/* NOTES */}
      <div style={notesSection}>
        <h3>Notes</h3>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write notes while watching..."
          style={textarea}
        />

        <button onClick={saveNote} style={saveBtn}>
          Save Note
        </button>

        {engagement.notes.map((n, i) => (
          <div key={i} style={noteCard}>
            <small>{new Date(n.createdAt).toLocaleString()}</small>
            <p>{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */

const container = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 30,
  padding: 30
};

const videoSection = {
  background: "white",
  padding: 25,
  borderRadius: 20
};

const notesSection = {
  background: "white",
  padding: 25,
  borderRadius: 20
};

const progressBg = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 10
};

const progressFill = {
  height: "100%",
  background: "#5a4de1",
  borderRadius: 10
};

const textarea = {
  width: "100%",
  height: 110,
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd"
};

const saveBtn = {
  marginTop: 10,
  background: "#5a4de1",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 10,
  cursor: "pointer"
};

const noteCard = {
  background: "#f9fafb",
  padding: 10,
  borderRadius: 10,
  marginTop: 10
};