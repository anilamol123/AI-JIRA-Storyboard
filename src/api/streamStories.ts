import { client } from "@/api/client"
import type { Story } from "@/lib/board"

export type StreamMessage =
  | { type: "token"; chunk: string }
  | { type: "story"; story: Story }
  | { type: "done"; count: number; text?: string }
  | { type: "error"; message: string }

export interface StreamStoriesOptions {
  idea: string
  onMessage: (message: StreamMessage) => void
  signal?: AbortSignal
}

export async function streamStories({
  idea,
  onMessage,
  signal,
}: StreamStoriesOptions): Promise<string> {
  const stream = await client.postStream("/api/stream", { idea }, signal)

  let buffer = ""
  let fullText = ""

  const flush = (lines: string) => {
    for (const line of lines.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const message = JSON.parse(trimmed) as StreamMessage
      if (message.type === "token") {
        fullText += message.chunk
      } else if (message.type === "done" && message.text) {
        fullText = message.text
      }
      onMessage(message)
    }
  }

  await stream.read((chunk) => {
    buffer += chunk
    const lastNewline = buffer.lastIndexOf("\n")
    if (lastNewline !== -1) {
      flush(buffer.slice(0, lastNewline))
      buffer = buffer.slice(lastNewline + 1)
    }
  })

  if (buffer) {
    flush(buffer)
  }

  return fullText
}