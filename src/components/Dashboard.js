import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbz9TOCv6-5J-sbmREwiSyjc9xg44HC3_h3EVZhEp_MncQspkS-aGeDEX6NwoYs4VT6wsg/exec")
      .then((res) => res.json())
      .then((response) => {
        console.log("Fetched data:", response);
        if (response.data && Array.isArray(response.data)) {
          setRows(response.data);
        } else if (Array.isArray(response)) {
          setRows(response); // fallback
        } else {
          console.error("Unexpected response format:", response);
        }
      });
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
      <img
        src="/new-logo.png"
        alt="Company Logo"
        className="dashboard-logo"
      />
      <h1 className="dashboard-title">Driver Dashboard</h1>
      <div className="dashboard-time">{formatClock(now)}</div>

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
                <tr key={i}>
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
    </div>
  );
}
