import { useCallback, useEffect, useRef, useState } from "react"

import { streamStories } from "@/api/streamStories"

export function useStoryStream({ onStory }) {
  const [text, setText] = useState("")
  const [status, setStatus] = useState("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [error, setError] = useState(null)
  const [count, setCount] = useState(0)
  const [titles, setTitles] = useState([])
  const [idea, setIdea] = useState("")
  const controllerRef = useRef(null)

  useEffect(() => {
    return () => controllerRef.current?.abort()
  }, [])

  const start = useCallback(
    async (nextIdea) => {
      const controller = new AbortController()
      controllerRef.current = controller

      setIdea(nextIdea)
      setText("")
      setError(null)
      setCount(0)
      setTitles([])
      setStatusMessage("Generating stories…")
      setStatus("streaming")

      let delivered = 0

      try {
        await streamStories({
          idea: nextIdea,
          onMessage(message) {
            switch (message.type) {
              case "token":
                setText((prev) => prev + message.chunk)
                break
              case "story":
                delivered += 1
                setCount((prev) => prev + 1)
                setTitles((prev) => [...prev, message.story.title])
                onStory(message.story)
                break
              case "done":
                setCount(message.count)
                setStatusMessage(message.text ?? "Done")
                break
              case "error":
                setError(message.message)
                setStatusMessage(message.message)
                setStatus("error")
                break
            }
          },
          signal: controller.signal,
        })
      } catch (err) {
        if (err?.name === "AbortError") return
        setError(err?.message ?? "Something went wrong")
        setStatusMessage(err?.message ?? "Something went wrong")
        setStatus("error")
        return
      }

      setStatus("done")
      return delivered
    },
    [onStory]
  )

  const stop = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  const clear = useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setIdea("")
    setText("")
    setStatus("idle")
    setStatusMessage("")
    setError(null)
    setCount(0)
    setTitles([])
  }, [])

  return { text, status, statusMessage, error, count, titles, idea, start, stop, clear }
}