import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [now, setNow] = useState(new Date());
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  useEffect(() => {
  const fetchData = () => {
    fetch("https://script.google.com/macros/s/AKfycbz9TOCv6-5J-sbmREwiSyjc9xg44HC3_h3EVZhEp_MncQspkS-aGeDEX6NwoYs4VT6wsg/exec")
      .then((res) => res.json())
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setRows(response.data);
        } else if (Array.isArray(response)) {
          setRows(response);
        } else {
          console.error("Unexpected response format:", response);
        }
      });
  };

  fetchData(); // fetch once at mount
  const interval = setInterval(fetchData, 1000); // fetch every 1 second
  return () => clearInterval(interval); // cleanup on unmount
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatClock = (date) =>
    date.toLocaleString("en-SG", {
      hour12: false,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="dashboard-wrapper">
      <img src="/new-logo.png" alt="Company Logo" className="dashboard-logo" />
      <h1 className="dashboard-title">Driver Dashboard</h1>
      <div className="dashboard-time">{formatClock(now)}</div>

      <div className="view-toggle">
        <button onClick={() => setViewMode("table")} className={viewMode === "table" ? "active" : ""}>Table View</button>
        <button onClick={() => setViewMode("card")} className={viewMode === "card" ? "active" : ""}>Card View</button>
      </div>

      {viewMode === "table" ? (
        <div className="dashboard-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Current Task</th>
                <th>Task Period</th>
                <th>Next Task</th>
                <th>Next Task Period</th>
              </tr>
            </thead>
            <tbody>
  {rows.length > 0 ? (
    rows.map((row, i) => (
      <tr
        key={i}
        className={
          row["Current Task"] && row["Current Task"].toLowerCase() === "available"
            ? "available"
            : ""
        }
      >
        <td>{row["Driver"] || "—"}</td>
        <td>{row["Current Task"] || "—"}</td>
        <td>{row["Task Period"] || "—"}</td>
        <td>{row["Next Task"] || "—"}</td>
        <td>{row["Next Task Period"] || "—"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">Loading...</td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      ) : (
        <div className="card-container">
  {rows.length > 0 ? (
    rows.map((row, i) => {
      const isAvailable = row["Current Task"]?.toLowerCase() === "available";
      return (
        <div
          key={i}
          className={`driver-card ${isAvailable ? "available" : ""}`}
        >
          <h2>{row["Driver"] || "—"}</h2>
          <p><strong>Current Task:</strong> {row["Current Task"] || "—"}</p>
          <p><strong>Task Period:</strong> {row["Task Period"] || "—"}</p>
          <p><strong>Next Task:</strong> {row["Next Task"] || "—"}</p>
          <p><strong>Next Task Period:</strong> {row["Next Task Period"] || "—"}</p>
        </div>
      );
    })
  ) : (
    <p className="loading-text">Loading...</p>
  )}
</div>
      )}
    </div>
  );
}
