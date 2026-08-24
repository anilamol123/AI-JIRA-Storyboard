import { buildEvents, readJsonBody } from "./_events.js"

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
  const lines = buildEvents(parsed.idea ?? "")

  res.writeHead(200, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-cache",
    "x-accel-buffering": "no",
    "access-control-allow-origin": "*",
  })

  let closed = false
  res.on("close", () => {
    closed = true
  })

  const send = (index) => {
    if (closed) return
    res.write(lines[index])
    if (index < lines.length - 1) {
      setTimeout(() => send(index + 1), 40)
    } else {
      res.end()
    }
  }

  send(0)
}
