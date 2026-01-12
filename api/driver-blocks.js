// /api/driver-blocks.js
export default async function handler(req, res) {
  try {
    const url = process.env.GAS_DRIVER_BLOCKS_URL;
    if (!url) return res.status(500).json({ error: "GAS_DRIVER_BLOCKS_URL not set" });

    const r = await fetch(url, { cache: "no-store" });
    const j = await r.json(); // expect { date, blocks: [...] } from driverBlocksSheet

    const blocks = Array.isArray(j?.blocks) ? j.blocks : [];
    const byDriver = {};
    for (const b of blocks) {
      const key = (b.driver || "").trim();
      if (!key) continue;
      (byDriver[key] = byDriver[key] || []).push({
        driver: key,
        start:  b.start || "",
        end:    b.end   || "",
        task:   b.task  || ""
      });
    }
    Object.values(byDriver).forEach(list => list.sort((a,b)=> (a.start||"").localeCompare(b.start||"")));

    return res.status(200).json({ date: j.date || null, byDriver });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
