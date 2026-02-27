import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function CoursePlayer() {
  const { engagementId } = useParams();

  const [engagement, setEngagement] = useState(null);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [progress, setProgress] = useState(0);

  // Load engagement + activity
  useEffect(() => {
    loadEngagement();
  }, []);

  const loadEngagement = async () => {
    try {
      const res = await API.get(`/engagements/${engagementId}`);
      setEngagement(res.data);
      setSavedNotes(res.data.notes || []);
      setProgress(res.data.progress || 0);
    } catch (err) {
      console.error("Failed to load course", err);
    }
  };

  // Track session time (simple & reliable)
  useEffect(() => {
    const startTime = Date.now();

    return async () => {
      try {
        const secondsWatched = Math.floor(
          (Date.now() - startTime) / 1000
        );

        const newProgress = Math.min(
          progress + Math.floor(secondsWatched / 5),
          100
        );

        await API.put(`/engagements/progress/${engagementId}`, {
          progress: newProgress,
          notes: savedNotes
        });
      } catch (err) {
        console.error("Progress save failed", err);
      }
    };
  }, [progress, savedNotes, engagementId]);

  // Save note
  const saveNote = async () => {
    if (!notes.trim()) return;

    const updatedNotes = [
      ...savedNotes,
      { text: notes, createdAt: new Date() }
    ];

    try {
      await API.put(`/engagements/progress/${engagementId}`, {
        progress,
        notes: updatedNotes
      });

      setSavedNotes(updatedNotes);
      setNotes("");
    } catch (err) {
      console.error("Note save failed", err);
    }
  };

  if (!engagement) {
    return <div style={{ padding: 30 }}>Loading course...</div>;
  }

  const videoSrc = engagement.activity.youtubeUrl
    ?.replace("watch?v=", "embed/");

  return (
    <div style={container}>
      {/* VIDEO SECTION */}
      <div style={videoSection}>
        <h2>{engagement.activity.name}</h2>

        <iframe
          width="100%"
          height="400"
          src={videoSrc}
          title="Course Video"
          frameBorder="0"
          allowFullScreen
          style={{ borderRadius: 12 }}
        />

        {/* PROGRESS */}
        <div style={{ marginTop: 15 }}>
          <div style={progressBg}>
            <div
              style={{
                ...progressFill,
                width: `${progress}%`
              }}
            />
          </div>
          <div style={{ textAlign: "right", marginTop: 5 }}>
            {progress}%
          </div>
        </div>
      </div>

      {/* NOTES SECTION */}
      <div style={notesSection}>
        <h3>Notes</h3>

        <textarea
          placeholder="Write notes while watching..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={textarea}
        />

        <button style={saveBtn} onClick={saveNote}>
          Save Note
        </button>

        <div style={{ marginTop: 20 }}>
          {savedNotes.map((note, index) => (
            <div key={index} style={noteCard}>
              <small>
                {new Date(note.createdAt).toLocaleString()}
              </small>
              <p>{note.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

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
  borderRadius: 10,
  padding: 10,
  border: "1px solid #ddd",
  resize: "none"
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
  marginBottom: 10
};