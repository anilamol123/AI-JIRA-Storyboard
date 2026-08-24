export default function handler(_req, res) {
  const generator = process.env.OPENROUTER_API_KEY ? "openrouter" : "built-in"
  res.writeHead(200, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
  })
  res.end(JSON.stringify({ ok: true, generator }))
}
