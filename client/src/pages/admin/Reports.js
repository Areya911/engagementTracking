import { useState } from "react";
import API from "../../api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export default function Reports() {
  const [dateRange, setDateRange] = useState("7");
  const [department, setDepartment] = useState("All");
  const [activityType, setActivityType] = useState("All");
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    try {
      const res = await API.get("/dashboard", {
        params: {
          range: dateRange,
          department,
          activityType
        }
      });

      setReportData(res.data);
    } catch (err) {
      alert("Failed to generate report");
    }
  };

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    if (!reportData) return alert("Generate report first");

    const rows = reportData.activityStats.map(a => ({
      Activity: a.name,
      Participants: a.participants
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "engagement_report.csv");
  };

  /* ================= EXCEL EXPORT ================= */
  const exportExcel = () => {
    if (!reportData) return alert("Generate report first");

    const rows = reportData.activityStats.map(a => ({
      Activity: a.name,
      Participants: a.participants
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "engagement_report.xlsx");
  };

  /* ================= PDF EXPORT ================= */
  const exportPDF = () => {
    if (!reportData) return alert("Generate report first");

    const doc = new jsPDF();
    doc.text("Engagement Report", 20, 20);

    let y = 40;
    reportData.activityStats.forEach(a => {
      doc.text(`${a.name} - Participants: ${a.participants}`, 20, y);
      y += 10;
    });

    doc.save("engagement_report.pdf");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Reports</h1>

      {/* GENERATE REPORT PANEL */}
      <div style={card}>
        <h3>Generate Report</h3>

        <div style={filters}>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={select}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <select value={department} onChange={e => setDepartment(e.target.value)} style={select}>
            <option>All Departments</option>
            <option>Computer Science</option>
            <option>IT</option>
            <option>ECE</option>
          </select>

          <select value={activityType} onChange={e => setActivityType(e.target.value)} style={select}>
            <option>All Activities</option>
            <option>Quiz</option>
            <option>Assignment</option>
            <option>Video</option>
            <option>Live</option>
          </select>
        </div>

        <button style={generateBtn} onClick={generateReport}>
          Generate Report
        </button>
      </div>

      {/* EXPORT OPTIONS */}
      <div style={{ marginTop: 30 }}>
        <h3>Export Options</h3>

        <div style={exportGrid}>
          <ExportCard title="Export as PDF" onClick={exportPDF} />
          <ExportCard title="Export as Excel" onClick={exportExcel} />
          <ExportCard title="Export as CSV" onClick={exportCSV} />
        </div>
      </div>

      {/* REPORT PREVIEW */}
      {reportData && (
        <div style={{ marginTop: 30 }}>
          <h3>Report Preview</h3>

          <div style={card}>
            <p><b>Total Users:</b> {reportData.totalUsers}</p>
            <p><b>Total Activities:</b> {reportData.totalActivities}</p>
            <p><b>Total Engagements:</b> {reportData.totalEngagements}</p>

            <h4 style={{ marginTop: 15 }}>Top Activities</h4>

            {reportData.activityStats.map((a, i) => (
              <div key={i} style={row}>
                {a.name} — {a.participants} participants
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExportCard({ title, onClick }) {
  return (
    <div style={exportCard} onClick={onClick}>
      <h4>{title}</h4>
      <p style={{ fontSize: 13, color: "#777" }}>
        Click to download report
      </p>
    </div>
  );
}

/* ===== STYLES ===== */

const card = {
  background: "white",
  padding: 25,
  borderRadius: 14,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const filters = {
  display: "flex",
  gap: 15,
  margin: "15px 0"
};

const select = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const generateBtn = {
  background: "#6366f1",
  color: "white",
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer"
};

const exportGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 20,
  marginTop: 15
};

const exportCard = {
  background: "#fafafa",
  padding: 25,
  borderRadius: 12,
  textAlign: "center",
  border: "2px dashed #ddd",
  cursor: "pointer"
};

const row = {
  padding: 10,
  borderBottom: "1px solid #eee"
};
