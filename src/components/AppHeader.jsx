import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"

import { ThemeToggle } from "@/components/ThemeToggle"
import { useBoardState } from "@/state/StoryboardProvider"
import { cn } from "@/lib/utils"
import { LayoutGrid, Plus } from "lucide-react"

function BoardMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
      <title>AI JIRA Board logo</title>
      <defs>
        <linearGradient id="app-header-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CC3A63" />
          <stop offset="1" stopColor="#A2AB73" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#app-header-gradient)" />
      <rect x="7" y="8" width="3" height="14" rx="1.5" fill="#FFF7EB" />
      <rect x="14.5" y="8" width="3" height="9" rx="1.5" fill="#FFF7EB" />
      <rect x="22" y="8" width="3" height="16" rx="1.5" fill="#FFF7EB" />
      <rect x="7" y="23.5" width="3" height="1.5" rx="0.75" fill="#F9F0E0" opacity="0.6" />
      <rect x="22" y="25.5" width="3" height="1.5" rx="0.75" fill="#F9F0E0" opacity="0.4" />
    </svg>
  )
}

function GeneratorBadge({ generator }) {
  const label =
    generator === "openrouter"
      ? "OpenRouter"
      : generator === "built-in"
        ? "Built-in"
        : "…"

  const dot =
    generator === "openrouter"
      ? "bg-accent"
      : generator === "built-in"
        ? "bg-muted-foreground"
        : "bg-muted-foreground/50"

  return (
    <span
      title="Live story generator"
      className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground md:flex"
    >
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden="true" />
      {label}
    </span>
  )
}

const navLinkClass = ({ isActive }) =>
  cn(
    "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  )

export function AppHeader() {
  const { total, points } = useBoardState()
  const [generator, setGenerator] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/health")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && (data?.generator === "openrouter" || data?.generator === "built-in")) {
          setGenerator(data.generator)
        }
      })
      .catch(() => {
        if (!cancelled) setGenerator("built-in")
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <BoardMark />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            AI JIRA Board
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main">
          <NavLink to="/" end className={navLinkClass}>
            <Plus className="size-4" aria-hidden="true" />
            New idea
          </NavLink>
          <NavLink to="/board" className={navLinkClass}>
            <LayoutGrid className="size-4" aria-hidden="true" />
            Board
          </NavLink>
        </nav>

        <div className="flex items-center gap-2.5">
          <span className="hidden text-sm text-muted-foreground tabular-nums sm:inline">
            {total} stories · {points} pts
          </span>
          <GeneratorBadge generator={generator} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}