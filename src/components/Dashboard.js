import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import buildingMarkers from "../data/building-markers.json";
import { useMap } from "react-leaflet";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import DriverView from "./DriverView";

function ZoomWatcher({ setZoomLevel }) {
  const map = useMap();
  useEffect(() => {
    const updateZoom = () => setZoomLevel(map.getZoom());
    map.on("zoom", updateZoom);
    return () => map.off("zoom", updateZoom);
  }, [map, setZoomLevel]);
  return null;
}

const getSecondsToNext5Min = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const next5 = Math.ceil((minutes + 1) / 5) * 5;
  const deltaMinutes = next5 - minutes;
  return deltaMinutes * 60 - seconds;
};

export default function Dashboard({ user }) {
  console.log("🟢 Logged in as:", user.email);
  const [rows, setRows] = useState([]);
  const [gps, setGps] = useState([]);
  const [now, setNow] = useState(new Date());
  const [viewMode, setViewMode] = useState("table");
  const [gpsCountdown, setGpsCountdown] = useState(getSecondsToNext5Min());
  const [zoomLevel, setZoomLevel] = useState(11);


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
	const collectAndSendVisitorInfo = async () => {
	  try {
	    // Load FingerprintJS
	    const fp = await FingerprintJS.load();
	    const result = await fp.get();
	
	    const fingerprintId = result.visitorId;
	    const userAgent = navigator.userAgent;
	    const platform = navigator.platform;
	    const screenSize = `${window.screen.width}x${window.screen.height}`;
	
		const payload = {
		  email: user.email,
		  displayName: user.name || user.displayName || "Unknown",
		  fingerprintId,
		  userAgent,
		  platform,
		  screenSize,
		};
	
	    console.log("📱 Visitor Info Collected:", payload); // Debugging
	
	    // Send to Google Apps Script backend
	    fetch("https://driver-proxy.vercel.app/api/google-sheet", {
		  method: "POST",
		  headers: {
		    "Content-Type": "application/json",
		  },
		  body: JSON.stringify(payload),
		})

		.then(response => {
	      console.log("✅ Visitor info sent successfully");
	    }).catch(error => {
	      console.error("❌ Error sending visitor info:", error);
	    });
	
	  } catch (error) {
	    console.error("❌ FingerprintJS failed:", error);
	  }
	};

  const getVehicleType = (driverName) => {
    const match = driverName?.match(/\(([^)]+)\)/);
    if (!match) return "—";
    const plate = match[1].toUpperCase().replace(/\s/g, "");
    return vehicleTypes[plate] || "—";
  };

	const isRestTime = () => {
	  if (!now || isNaN(now.getTime())) return false; // fallback if invalid
	  const hour = now.getHours();
	  return hour >= 23 || hour < 6;
	};

  useEffect(() => {
	collectAndSendVisitorInfo();
	  
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
      fetch("https://cat1-proxy.vercel.app/api/gps")
        .then(res => res.json())
        .then(data => setGps(data))
        .catch(err => console.error("GPS fetch failed", err));
    };

    fetchData();
    fetchGps();
    setGpsCountdown(0);

    const nowForSync = new Date();
    const msToNextMinute = (60 - nowForSync.getSeconds()) * 1000;

    const firstTimeout = setTimeout(() => {
      fetchData();
      fetchGps();
      setGpsCountdown(0);

      const interval = setInterval(() => {
        fetchData();
        fetchGps();
        setGpsCountdown(0);
      }, 60 * 1000);

      window.gpsFetchInterval = interval;
    }, msToNextMinute);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(window.gpsFetchInterval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGpsCountdown(getSecondsToNext5Min());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <button onClick={() => setViewMode("map")} className={viewMode === "map" ? "active" : ""}>Map View</button>
		<button onClick={() => setViewMode("driver")} className={viewMode === "driver" ? "active" : ""}>Driver View</button>
      </div>
		
			{viewMode === "driver" && (
			  <div className="driver-view">
			    <DriverView currentEmail={user?.email || ""} />
			  </div>
			)}
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
		  <div className="map-under-construction">
		    <h2>🛠 Map View — Under Construction</h2>
		    <p>
		      Live GPS is temporarily unavailable. We’ll bring this back once the GPS service is restored.
		    </p>
		    <ul>
		      <li>Table, Card, and Driver views remain fully functional.</li>
		      <li>No impact on task data from Google Sheets.</li>
		    </ul>
		  </div>
		)}
      </div>
    );
}