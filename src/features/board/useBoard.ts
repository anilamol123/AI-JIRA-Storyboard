import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { toast } from "sonner"

import { saveMove } from "@/api/board"
import type { Status, Story } from "@/lib/board"
import { boardReducer, initialBoardState } from "@/features/board/boardReducer"

const statuses: Status[] = ["todo", "doing", "done"]

export function useBoard() {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState)
  const [query, setQuery] = useState("")

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const moveStory = useCallback((id: string, toStatus: Status) => {
    const fromStatus = statuses.find((status) =>
      stateRef.current.board[status].some((story) => story.id === id)
    )
    if (!fromStatus || fromStatus === toStatus) return

    dispatch({ type: "move", id, toStatus })

    void saveMove(id, toStatus).catch(() => {
      dispatch({ type: "move", id, toStatus: fromStatus })
      toast.error("Move reverted", {
        description: `Couldn't save the move of ${id}, so it was moved back.`,
      })
    })
  }, [])

  const addStory = useCallback(
    (story: Story, prompt?: string) => dispatch({ type: "addStory", story, prompt }),
    []
  )

  const removeStory = useCallback(
    (id: string) => dispatch({ type: "removeStory", id }),
    []
  )

  const reset = useCallback(() => dispatch({ type: "reset" }), [])

  const filteredBoard = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return state.board
    const matches = (story: Story) =>
      story.title.toLowerCase().includes(q) || story.tag.toLowerCase().includes(q)
    return {
      todo: state.board.todo.filter(matches),
      doing: state.board.doing.filter(matches),
      done: state.board.done.filter(matches),
    }
  }, [state.board, query])

  return {
    board: state.board,
    filteredBoard,
    query,
    setQuery,
    moveStory,
    addStory,
    removeStory,
    reset,
    dispatch,
    prevPrompts: state.prevPrompts,
  }
}