import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Handle both parsed and raw JSON bodies
    const raw = req.body;
    const body = typeof raw === "string" ? JSON.parse(raw || "{}") : (raw || {});
    const { username, password } = body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing creds" });
    }

    if (username === "logs" && password === "logs9191") {
      const token = jwt.sign({ role: "driver" }, process.env.LOGISTICS_JWT_SECRET, {
        expiresIn: "12h",
      });

      res.setHeader(
        "Set-Cookie",
        `drv_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=43200`
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ error: "Invalid username or password" });
  } catch (e) {
    return res.status(500).json({ error: "Login failed" });
  }
}
