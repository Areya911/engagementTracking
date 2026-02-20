import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function WatchActivity() {
  const { id } = useParams();
  const [engagement, setEngagement] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get(`/engagements/${id}`);
    setEngagement(res.data);
    setNotes(res.data.notes || "");
  };

  const saveNotes = async (text) => {
    setNotes(text);

    await API.put(`/engagements/progress/${id}`, {
      progress: engagement.progress || 0,
      notes: text
    });
  };

  if (!engagement) return <p>Loading...</p>;

  return (
    <div style={layout}>
      
      {/* VIDEO SECTION */}
      <div style={videoSection}>
        <iframe
          width="100%"
          height="420"
          src={engagement.activity.youtubeLink}
          title="Course Video"
          frameBorder="0"
          allowFullScreen
        />

        <h2 style={{ marginTop: 10 }}>
          {engagement.activity.name}
        </h2>
      </div>

      {/* NOTES SECTION */}
      <div style={notesSection}>
        <h3>Your Notes 📝</h3>

        <textarea
          value={notes}
          onChange={(e) => saveNotes(e.target.value)}
          placeholder="Write notes while learning..."
          style={textarea}
        />

        <p style={{ fontSize: 12, color: "#777" }}>
          Notes auto-save. They stay even after refresh.
        </p>
      </div>
    </div>
  );
}

/* STYLES */

const layout = {
  display: "flex",
  gap: 30,
  padding: 30,
  background: "#f8fafc",
  minHeight: "100vh"
};

const videoSection = {
  flex: 2,
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const notesSection = {
  flex: 1,
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const textarea = {
  width: "100%",
  height: 320,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  resize: "none",
  fontSize: 14
};
