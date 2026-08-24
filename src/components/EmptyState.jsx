import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"

/**
 * @typedef {{
 *   icon?: import("react").ElementType | null,
 *   title?: string,
 *   description?: string,
 *   action?: import("react").ReactNode,
 *   className?: string,
 * }} EmptyStateProps
 */

/**
 * @param {EmptyStateProps} props
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-4 py-10 text-center",
        className
      )}
    >
      {Icon && (
        <span className="rounded-full border border-border bg-secondary p-2.5">
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        </span>
      )}
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && <p className="text-sm font-medium text-foreground">{title}</p>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {action}
    </div>
  )
}