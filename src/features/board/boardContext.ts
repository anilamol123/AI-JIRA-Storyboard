import { createContext, useContext } from "react"

import type { Status, Story } from "@/lib/board"

export interface BoardContextValue {
  board: Record<Status, Story[]>
  onOpenStory: (id: string) => void
  onMove: (id: string, toStatus: Status) => void
}

export const BoardContext = createContext<BoardContextValue | null>(null)

export function useBoardContext(): BoardContextValue {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error("useBoardContext must be used within a <Board>")
  }
  return context
}
