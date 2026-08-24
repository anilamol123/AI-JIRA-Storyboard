import { useState } from "react"
import type { ReactNode } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"

import type { Status, Story } from "@/lib/board"
import { COLUMN_ORDER } from "@/lib/board"
import { BoardContext } from "@/features/board/boardContext"
import { Column } from "@/features/board/Column"
import { StoryPreview } from "@/features/board/StoryPreview"

export function Board({
  board,
  onOpenStory,
  onMove,
  children,
}: {
  board: Record<Status, Story[]>
  onOpenStory: (id: string) => void
  onMove: (id: string, toStatus: Status) => void
  children: ReactNode
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const activeStory =
    (activeId
      ? board.todo.concat(board.doing, board.done).find((story) => story.id === activeId)
      : null) ?? null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const toStatus = String(over.id) as Status
    if (!COLUMN_ORDER.includes(toStatus)) return
    onMove(String(active.id), toStatus)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <BoardContext.Provider value={{ board, onOpenStory, onMove }}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{children}</div>
        <DragOverlay>
          {activeStory ? <StoryPreview story={activeStory} /> : null}
        </DragOverlay>
      </DndContext>
    </BoardContext.Provider>
  )
}

Board.Column = Column