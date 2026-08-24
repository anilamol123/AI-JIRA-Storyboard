import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react"

import { useBoard } from "@/features/board/useBoard"
import { useStoryStream } from "@/features/generate/useStoryStream"
import { useLocalStorage } from "@/hooks/useLocalStorage"

// Two contexts and not one: board state (reducer plus derived data like counts,
// points, history) and stream state (in-progress generation text/status) change at
// different rates — every streamed token or board move would re-render consumers of
// the other slice if they shared a combined context. Splitting them keeps a consumer
// re-rendering only when the slice it actually reads changes.

export const BoardStateContext = createContext(null)
export const StreamContext = createContext(null)

export function StoryboardProvider({ children }) {
  const { board, dispatch, moveStory, addStory, removeStory, reset } = useBoard()
  const [history, setHistory] = useLocalStorage("jira.history.v1", [])

  const handleStory = useCallback(
    (story) => addStory(story),
    [addStory]
  )

  const stream = useStoryStream({ onStory: handleStory })

  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  const generate = useCallback(
    async (nextIdea) => {
      const delivered = await stream.start(nextIdea)
      if (delivered > 0) {
        setHistory((prev) =>
          [{ idea: nextIdea, at: Date.now(), count: delivered }, ...prev].slice(0, 20)
        )
      }
      return delivered
    },
    [stream.start, setHistory]
  )

  const boardValue = useMemo(() => {
    const stories = Object.values(board).flat()
    const counts = {
      todo: board.todo.length,
      doing: board.doing.length,
      done: board.done.length,
    }
    return {
      board,
      dispatch,
      moveStory,
      removeStory,
      reset,
      counts,
      total: stories.length,
      points: stories.reduce((sum, story) => sum + story.estimate, 0),
      stories,
      history,
      clearHistory,
      generate,
    }
  }, [board, dispatch, moveStory, removeStory, reset, history, clearHistory, generate])

  const streamValue = useMemo(
    () => ({
      text: stream.text,
      status: stream.status,
      statusMessage: stream.statusMessage,
      error: stream.error,
      count: stream.count,
      titles: stream.titles,
      idea: stream.idea,
      generate,
      stop: stream.stop,
      clear: stream.clear,
    }),
    [
      stream.text,
      stream.status,
      stream.statusMessage,
      stream.error,
      stream.count,
      stream.titles,
      stream.idea,
      stream.stop,
      stream.clear,
      generate,
    ]
  )

  return (
    <BoardStateContext.Provider value={boardValue}>
      <StreamContext.Provider value={streamValue}>
        {children}
      </StreamContext.Provider>
    </BoardStateContext.Provider>
  )
}

export function useBoardState() {
  const context = useContext(BoardStateContext)
  if (!context) {
    throw new Error("useBoardState must be used within a <StoryboardProvider>")
  }
  return context
}

export function useStream() {
  const context = useContext(StreamContext)
  if (!context) {
    throw new Error("useStream must be used within a <StoryboardProvider>")
  }
  return context
}