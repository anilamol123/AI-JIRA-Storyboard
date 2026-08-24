import { createServer } from "node:http"

const PORT = Number(process.env.PORT || 8787)

function buildEvents(idea) {
  const topic = idea.trim() || "your idea"
  const stories = [
    {
      id: "US-144",
      title: `Handle "${topic}" end to end`,
      kind: "story",
      tag: "US-144",
      labels: ["generated"],
      estimate: 3,
      status: "todo",
    },
    {
      id: "US-145",
      title: `Validate "${topic}" edge cases`,
      kind: "task",
      tag: "US-145",
      labels: ["qa"],
      estimate: 2,
      status: "todo",
    },
  ]

  const events = [
    { type: "token", chunk: `Reading your idea "${topic}"…` },
  ]
  for (const story of stories) {
    events.push({ type: "token", chunk: `\n\nStory: ${story.title}` })
    events.push({ type: "token", chunk: `\nAs a user, I want to ${topic.toLowerCase()}, with acceptance criteria enforced.` })
    events.push({ type: "story", story })
  }
  events.push({ type: "done", count: stories.length, text: `Generated ${stories.length} stories from "${topic}".` })

  return events.map((event) => `${JSON.stringify(event)}\n`)
}

const server = createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    })
    res.end()
    return
  }

  if (req.method === "GET" && req.url === "/api/health") {
    const generator = process.env.OPENROUTER_API_KEY ? "openrouter" : "built-in"
    res.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
    })
    res.end(JSON.stringify({ ok: true, generator }))
    return
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8" })
    res.end("Method not allowed")
    return
  }

  if (req.url === "/api/move") {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk
    })
    req.on("end", () => {
      let parsed = {}
      try {
        parsed = JSON.parse(body || "{}")
      } catch {
        parsed = {}
      }
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
      })
      res.end(JSON.stringify({ ok: true, id: parsed.id ?? null, to: parsed.to ?? null }))
    })
    return
  }

  if (req.url !== "/api/stream") {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" })
    res.end("Not found")
    return
  }

  let body = ""
  req.on("data", (chunk) => {
    body += chunk
  })
  req.on("end", () => {
    let idea = ""
    try {
      idea = JSON.parse(body || "{}").idea ?? ""
    } catch {
      idea = ""
    }

    const lines = buildEvents(idea)

    res.writeHead(200, {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache",
      connection: "keep-alive",
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
  })
})

server.listen(PORT, () => {
  console.log(`Stream server listening on http://localhost:${PORT}`)
})