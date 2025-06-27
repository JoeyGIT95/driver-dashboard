// Dashboard.js
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [gps, setGps] = useState([]);
  const [now, setNow] = useState(new Date());
  const [viewMode, setViewMode] = useState("table");

  const vehicleTypes = {
    PD1781L: "Van",
    YQ766M: "Lorry",
    YN9270H: "Lorry",
    YR2327D: "Lorry",
    PD2340U: "Van",
    PD1164T: "Van",
    PD2814U: "Minibus",
    SMY1362M: "SUV",
  };

  const getTeam = (driverName) => {
    if (!driverName) return "Unknown";
    const lower = driverName.toLowerCase();
    if (lower.includes("velu") || lower.includes("raja")) return "Penjuru";
    return "Changi";
  };

  const getVehicleType = (driverName) => {
    const match = driverName?.match(/\(([^)]+)\)/);
    if (!match) return "—";
    const plate = match[1].toUpperCase().replace(/\s/g, "");
    return vehicleTypes[plate] || "—";
  };

  const isRestTime = () => {
    const hour = now.getHours();
    return hour >= 23 || hour < 6;
  };

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

    const fetchGps = () => {
      fetch("http://34.133.154.63:8000/gps.json")
        .then(res => res.json())
        .then(data => setGps(data))
        .catch(err => console.error("GPS fetch failed", err));
    };

    fetchData();
    fetchGps();
    const interval = setInterval(() => {
      fetchData();
      fetchGps();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
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
        <button onClick={() => setViewMode("map")} className={viewMode === "map" ? "active" : ""}>Map View</button>
      </div>

      {viewMode === "table" && (
        <div className="dashboard-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Team</th>
                <th>Current Task</th>
                <th>Task Period</th>
                <th>Next Task</th>
                <th>Next Task Period</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? rows.map((row, i) => {
                const rest = isRestTime();
                const isAvailable = !rest && row["Current Task"]?.toLowerCase() === "available";
                return (
                  <tr key={i} className={isAvailable ? "available" : rest ? "rest-hours" : ""}>
                    <td>{row["Driver"] || "—"}</td>
                    <td>{getVehicleType(row["Driver"])}</td>
                    <td>{getTeam(row["Driver"])}</td>
                    <td>{rest ? "Unavailable (Rest Hours)" : (row["Current Task"] || "—")}</td>
                    <td>{row["Task Period"] || "—"}</td>
                    <td>{row["Next Task"] || "—"}</td>
                    <td>{row["Next Task Period"] || "—"}</td>
                  </tr>
                );
              }) : <tr><td colSpan="7">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "card" && (
        <div className="card-container">
          {rows.length > 0 ? rows.map((row, i) => {
            const rest = isRestTime();
            const isAvailable = !rest && row["Current Task"]?.toLowerCase() === "available";
            return (
              <div key={i} className={`driver-card ${isAvailable ? "available" : rest ? "rest-hours" : ""}`}>
                <h2>{row["Driver"] || "—"}
                  <div className="vehicle-type">{getVehicleType(row["Driver"])}</div>
                </h2>
                <p><strong>Team:</strong> {getTeam(row["Driver"])}</p>
                <p><strong>Current Task:</strong> {rest ? "Unavailable (Rest Hours)" : (row["Current Task"] || "—")}</p>
                <p><strong>Task Period:</strong> {row["Task Period"] || "—"}</p>
                <p><strong>Next Task:</strong> {row["Next Task"] || "—"}</p>
                <p><strong>Next Task Period:</strong> {row["Next Task Period"] || "—"}</p>
              </div>
            );
          }) : <p className="loading-text">Loading...</p>}
        </div>
      )}

      {viewMode === "map" && (
        <div className="map-view">
          {gps.length > 0 ? (
            <MapContainer
  center={[1.3521, 103.8198]} // Center of Singapore
  zoom={11} // Wider zoom to show whole SG
  style={{ height: "100%", width: "100%" }}
  scrollWheelZoom={true}
>
              <>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {gps
				  .filter((v) => !["SLW357H", "SNS2521J"].includes((v.label || "").toUpperCase()))
				  .map((v, i) => {
				    const isMoving = parseFloat(v.speed) > 0;
				
				    return (
				      <Marker
				        key={i}
				        position={[v.latitude, v.longitude]}
				        icon={L.divIcon({
				          className: `custom-marker ${isMoving ? "moving" : ""}`,
				          html: `
				            <div class="marker-wrapper">
				              <div class="marker-label">${v.label || "?"}</div>
				              <div class="marker-circle"></div>
				            </div>
				          `
				        })}
				      >
				        <Popup>
				          <strong>{v.label || "Unnamed Vehicle"}</strong><br />
				          Time: {v.timestamp}<br />
				          Speed: {v.speed} km/h<br />
				          Road: {v.road || "—"}<br />
				          Status: {v.event}
				        </Popup>
				      </Marker>
				    );
				  })}


              </>
            </MapContainer>
          ) : <p>Loading GPS data...</p>}
        </div>
      )}
    </div>
  );
}
