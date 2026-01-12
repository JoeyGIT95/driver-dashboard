export default async function handler(req, res) {
  const appsScriptURL = "https://script.google.com/macros/s/AKfycby9zp5du0JBY-zOUo6GtCdTzIJNktPs-jr0ufYIRgULke3Dypq1oQITO4E1mf2g7xGciA/exec";

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }

  try {
    const response = await fetch(appsScriptURL, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Local Proxy Error:", error);
    res.status(500).json({ error: "Proxy failed" });
  }
}
