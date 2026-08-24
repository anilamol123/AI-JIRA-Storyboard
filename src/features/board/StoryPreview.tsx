import type { Story, StoryKind } from "@/lib/board"
import { cn } from "@/lib/utils"

const kindBadge: Record<StoryKind, string> = {
  story: "border-primary/30 bg-primary/10 text-primary",
  bug: "border-destructive/40 bg-destructive/10 text-destructive",
  task: "border-accent/40 bg-accent/15 text-accent-foreground",
}

export function StoryPreview({ story }: { story: Story }) {
  return (
    <div className="w-72 rounded-lg border border-primary/40 bg-card px-3 py-2.5 shadow-xl">
      <p className="line-clamp-1 text-sm font-medium">{story.title}</p>
      <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
        {story.description}
      </p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
            kindBadge[story.kind]
          )}
        >
          {story.kind}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
          {story.estimate} pts
        </span>
      </div>
    </div>
  )
}