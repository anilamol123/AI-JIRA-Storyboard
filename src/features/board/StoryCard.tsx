import { useDraggable } from "@dnd-kit/core"
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react"

import type { Story, StoryKind } from "@/lib/board"
import { cn } from "@/lib/utils"

const kindBadge: Record<StoryKind, string> = {
  story: "border-primary/30 bg-primary/10 text-primary",
  bug: "border-destructive/40 bg-destructive/10 text-destructive",
  task: "border-accent/40 bg-accent/15 text-accent-foreground",
}

export function StoryCard({
  story,
  onOpen,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
}: {
  story: Story
  onOpen: () => void
  canMoveLeft: boolean
  canMoveRight: boolean
  onMoveLeft?: () => void
  onMoveRight?: () => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } =
    useDraggable({ id: story.id })

  return (
    <article
      ref={setNodeRef}
      className={cn(
        "rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm transition-all hover:shadow-md",
        isDragging && "opacity-30"
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
        title="Open story"
      >
        <p className="line-clamp-1 text-sm font-medium leading-snug">{story.title}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
          {story.description}
        </p>
      </button>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
            kindBadge[story.kind]
          )}
        >
          {story.kind}
        </span>
        {story.labels.map((label) => (
          <span
            key={label}
            className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
          {story.estimate} pts
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveLeft}
            disabled={!canMoveLeft || !onMoveLeft}
            aria-label="Move left"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onMoveRight}
            disabled={!canMoveRight || !onMoveRight}
            aria-label="Move right"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            aria-label="Drag to move"
            className="cursor-grab rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}