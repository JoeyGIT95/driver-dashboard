// src/components/DriverView.js (or .jsx)
import React, { useEffect, useMemo, useRef, useState } from "react";

// optional: dynamic import to keep bundle small
async function getFingerprintId() {
  try {
    const { load } = await import("@fingerprintjs/fingerprintjs");
    const fp = await load();
    const r = await fp.get();
    return r?.visitorId || "fp_unavailable";
  } catch {
    return "fp_unavailable";
  }
}

export default function DriverView({ currentEmail = "" }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Full-day blocks grouped by driver
  const [byDriver, setByDriver] = useState({});
  const [selectedDriver, setSelectedDriver] = useState("");

  // ✅ All hooks BEFORE any return
  const drivers = useMemo(() => Object.keys(byDriver).sort(), [byDriver]);
  const active = selectedDriver || (drivers[0] || "");

  const initialPickDone = useRef(false);
  useEffect(() => {
    if (!initialPickDone.current && drivers.length > 0) {
      setSelectedDriver(drivers[0]);
      initialPickDone.current = true;
    }
  }, [drivers]);

  async function logDriverViewLogin(email, user) {
    try {
      const fingerprintId = await getFingerprintId();
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
      const platform = typeof navigator !== "undefined" ? navigator.platform : "unknown";
      const screenSize =
        typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "unknown";

      const payload = {
        email,
        displayName: `${user || "Unknown"} [Driver View]`,
        fingerprintId,
        userAgent,
        platform,
        screenSize,
        type: "driver_view_login",
        section: "Driver View",
        when: new Date().toISOString(),
      };

      const url = "https://driver-proxy.vercel.app/api/google-sheet";
      const body = JSON.stringify(payload);

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      } else {
        fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
          () => {}
        );
      }
    } catch {
      // best-effort
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/driver-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Invalid username or password");

      // fire-and-forget
      logDriverViewLogin(currentEmail, username);

      const blocksRes = await fetch("/api/driver-blocks", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!blocksRes.ok) throw new Error("Failed to load driver blocks");
      const blocksJson = await blocksRes.json();
      setByDriver(blocksJson.byDriver || {});
      setAuthed(true);
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ——— render ———
  if (!authed) {
    return (
      <div style={{ maxWidth: 420, margin: "24px auto" }}>
        <h3>Driver Login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 8 }}
          />
          <button type="submit" style={{ width: "100%", padding: 10 }} disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
          {err && <p style={{ color: "tomato" }}>{err}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Driver View — Full Day</h3>
        <select value={active} onChange={(e) => setSelectedDriver(e.target.value)} style={{ padding: 8 }}>
          {drivers.map((d) => (
            <option key={d} value={d}>
              {d.replace(/\n/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {!active || !byDriver[active] || byDriver[active].length === 0 ? (
        <p>No tasks found for today.</p>
      ) : (
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {byDriver[active].map((b, i) => (
            <div key={i} style={{ minWidth: 240, border: "1px solid #333", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>
                {b.start}
                {b.end && b.end !== b.start ? `–${b.end}` : ""}
              </div>
              <div>{b.task}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
