import { CircleCheckBig, LoaderCircle, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { useStream } from "@/state/StoryboardProvider"

const statusMeta = {
  streaming: {
    icon: LoaderCircle,
    iconClass: "text-primary animate-spin",
    badgeClass: "bg-primary/10 text-primary",
  },
  done: {
    icon: CircleCheckBig,
    iconClass: "text-accent",
    badgeClass: "bg-accent/15 text-accent-foreground",
  },
  error: {
    icon: TriangleAlert,
    iconClass: "text-destructive",
    badgeClass: "bg-destructive/10 text-destructive",
  },
}

export function GenerationProgress() {
  const { status, statusMessage, count } = useStream()
  if (status === "idle") return null

  const meta = statusMeta[status] ?? statusMeta.streaming
  const Icon = meta.icon

  return (
    <div className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm">
      <Icon className={cn("size-4 shrink-0", meta.iconClass)} aria-hidden="true" />
      <span
        role="status"
        aria-live="polite"
        className="text-sm text-muted-foreground"
      >
        {statusMessage}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
          meta.badgeClass
        )}
      >
        {count} {count === 1 ? "story" : "stories"}
      </span>
    </div>
  )
}
