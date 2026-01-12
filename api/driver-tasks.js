import jwt from "jsonwebtoken";

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((a, p) => {
    const [k, v] = p.trim().split("=");
    if (k) a[k] = decodeURIComponent(v || "");
    return a;
  }, {});
}

export default async function handler(req, res) {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const raw = cookies["drv_session"];
    if (!raw) return res.status(401).json({ error: "No session" });

    // throws if invalid/expired
    jwt.verify(raw, process.env.LOGISTICS_JWT_SECRET);

    const r = await fetch(process.env.GAS_DASHBOARD_URL, { cache: "no-store" });
    const data = await r.json();

    const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return res.status(200).json({ rows });
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
