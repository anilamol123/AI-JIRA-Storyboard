import { useDroppable } from "@dnd-kit/core"

import type { Status } from "@/lib/board"
import { COLUMNS, COLUMN_ORDER } from "@/lib/board"
import { EmptyState } from "@/components/EmptyState"
import { useBoardContext } from "@/features/board/boardContext"
import { StoryCard } from "@/features/board/StoryCard"
import { cn } from "@/lib/utils"

export function Column({ id }: { id: Status }) {
  const { board, onMove, onOpenStory } = useBoardContext()
  const { setNodeRef, isOver } = useDroppable({ id })
  const stories = board[id]
  const { title, dot } = COLUMNS[id]

  const index = COLUMN_ORDER.indexOf(id)
  const hasPrev = index > 0
  const hasNext = index < COLUMN_ORDER.length - 1
  const moveLeft = hasPrev ? (storyId: string) => onMove(storyId, COLUMN_ORDER[index - 1]) : null
  const moveRight = hasNext ? (storyId: string) => onMove(storyId, COLUMN_ORDER[index + 1]) : null

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex min-h-64 flex-col gap-2.5 rounded-xl border border-border/60 bg-secondary/50 p-3 transition-colors",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <header className="flex items-center gap-2 px-0.5">
        <span className={cn("size-2 rounded-full", dot)} aria-hidden="true" />
        <span className="text-xs font-semibold tracking-wide text-foreground uppercase">
          {title}
        </span>
        <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
          {stories.length}
        </span>
      </header>

      {stories.length === 0 ? (
        <EmptyState
          title="No stories"
          className="flex-1 gap-2 px-3 py-6"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onOpen={() => onOpenStory(story.id)}
              canMoveLeft={hasPrev}
              canMoveRight={hasNext}
              onMoveLeft={moveLeft ? () => moveLeft(story.id) : undefined}
              onMoveRight={moveRight ? () => moveRight(story.id) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  )
}