import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { COLUMNS, COLUMN_ORDER } from "@/lib/board"
import { cn } from "@/lib/utils"
import { Trash2, X } from "lucide-react"

const kindBadge = {
  story: "border-primary/30 bg-primary/10 text-primary",
  bug: "border-destructive/40 bg-destructive/10 text-destructive",
  task: "border-accent/40 bg-accent/15 text-accent-foreground",
}

export function StoryDialog({ story, onOpenChange, onMove, onDelete }) {
  if (!story) return null

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogBackdrop />
      <DialogPopup>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DialogTitle className="line-clamp-2">{story.title}</DialogTitle>
            <DialogDescription className="mt-1 flex items-center gap-2">
              <span className="font-semibold text-primary">{story.tag}</span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                  kindBadge[story.kind]
                )}
              >
                {story.kind}
              </span>
            </DialogDescription>
          </div>
          <DialogClose
            aria-label="Close story"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogClose>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {story.description}
        </p>

        {story.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {story.labels.map((label) => (
              <span
                key={label}
                className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-sm text-muted-foreground tabular-nums">
            <span className="font-semibold text-foreground">{story.estimate}</span>{" "}
            points
          </span>

          <Button variant="destructive" onClick={onDelete}>
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="text-xs font-medium text-muted-foreground">
            Move to
          </span>
          {COLUMN_ORDER.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={status === story.status ? "secondary" : "outline"}
              disabled={status === story.status}
              onClick={() => onMove(status)}
            >
              {COLUMNS[status].title}
            </Button>
          ))}
        </div>
      </DialogPopup>
    </Dialog>
  )
}