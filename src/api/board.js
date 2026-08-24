export async function saveMove(id, to) {
  const response = await fetch("/api/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, to }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Move failed with status ${response.status}`)
  }
}