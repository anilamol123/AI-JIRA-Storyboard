import { readJsonBody } from "./_events.js"

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    })
    res.end()
    return
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8" })
    res.end("Method not allowed")
    return
  }

  const parsed = await readJsonBody(req)
  res.writeHead(200, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
  })
  res.end(JSON.stringify({ ok: true, id: parsed.id ?? null, to: parsed.to ?? null }))
}
