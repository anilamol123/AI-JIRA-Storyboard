import { CircleCheckBig, LoaderCircle, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { useStream } from "@/state/StoryboardProvider"

const statusMeta = {
  streaming: { icon: LoaderCircle, iconClass: "text-primary animate-spin" },
  done: { icon: CircleCheckBig, iconClass: "text-accent" },
  error: { icon: TriangleAlert, iconClass: "text-destructive" },
}

export function StreamBanner() {
  const { status, statusMessage, count } = useStream()
  if (status === "idle") return null

  const meta = statusMeta[status] ?? statusMeta.streaming
  const Icon = meta.icon

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
      <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <Icon className={cn("size-4 shrink-0", meta.iconClass)} aria-hidden="true" />
        <span role="status" aria-live="polite" className="truncate">
          {statusMessage}
        </span>
      </span>
      <span className="shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
        {count} {count === 1 ? "story" : "stories"}
      </span>
    </div>
  )
}