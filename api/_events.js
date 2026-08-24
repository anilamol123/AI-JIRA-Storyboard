export function buildEvents(idea) {
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

export function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk
    })
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"))
      } catch {
        resolve({})
      }
    })
    req.on("error", () => resolve({}))
  })
}
