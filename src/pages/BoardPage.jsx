import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/EmptyState"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Board } from "@/features/board/Board"
import { StoryDialog } from "@/features/board/StoryDialog"
import { StreamBanner } from "@/features/generate/StreamBanner"
import { useDebounce } from "@/hooks/useDebounce"
import { COLUMNS } from "@/lib/board"
import { cn } from "@/lib/utils"
import { useBoardState } from "@/state/StoryboardProvider"
import { History, LayoutGrid, List, Plus, RotateCcw, Search, SearchX, Trash2, X } from "lucide-react"

const kindBadge = {
  story: "border-primary/30 bg-primary/10 text-primary",
  bug: "border-destructive/40 bg-destructive/10 text-destructive",
  task: "border-accent/40 bg-accent/15 text-accent-foreground",
}

const statusBadge = {
  todo: "border-border bg-secondary text-secondary-foreground",
  doing: "border-accent/60 bg-accent/15 text-accent-foreground",
  done: "border-primary/40 bg-primary/10 text-primary",
}

function StoryTable({ stories, onOpenStory }) {
  if (stories.length === 0) {
    return (
      <EmptyState
        title="No stories yet"
        description="Generate a few from the landing page."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border/60 text-xs tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3 font-medium">Story</th>
            <th className="px-4 py-3 font-medium">Tag</th>
            <th className="px-4 py-3 font-medium">Kind</th>
            <th className="px-4 py-3 font-medium">Labels</th>
            <th className="px-4 py-3 font-medium">Estimate</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr
              key={story.id}
              onClick={() => onOpenStory(story.id)}
              className="cursor-pointer border-b border-border/40 transition-colors last:border-b-0 hover:bg-muted/60"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{story.title}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {story.description}
                </p>
              </td>
              <td className="px-4 py-3 font-semibold text-primary">{story.tag}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                    kindBadge[story.kind]
                  )}
                >
                  {story.kind}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {story.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground tabular-nums">
                {story.estimate} pts
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    statusBadge[story.status]
                  )}
                >
                  {COLUMNS[story.status].title}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HistoryList({ history, onRunAgain }) {
  if (history.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No past ideas yet"
        description="Run a generation to see it here."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {history.map((entry) => (
        <div
          key={entry.at}
          className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card px-4 py-3"
        >
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-medium text-foreground">
              {entry.idea}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
              {new Date(entry.at).toLocaleString()} · {entry.count}{" "}
              {entry.count === 1 ? "story" : "stories"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => onRunAgain(entry.idea)}
          >
            <RotateCcw aria-hidden="true" />
            Run again
          </Button>
        </div>
      ))}
    </div>
  )
}

export function BoardPage() {
  const { board, stories, moveStory, removeStory, reset, history, generate } =
    useBoardState()
  const [openStoryId, setOpenStoryId] = useState(null)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)

  const visibleBoard = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return board
    const matches = (story) =>
      story.title.toLowerCase().includes(q) ||
      story.description.toLowerCase().includes(q) ||
      story.labels.some((label) => label.toLowerCase().includes(q))
    return {
      todo: board.todo.filter(matches),
      doing: board.doing.filter(matches),
      done: board.done.filter(matches),
    }
  }, [board, debouncedQuery])

  const openStory = stories.find((story) => story.id === openStoryId) ?? null

  const isSearching = debouncedQuery.trim().length > 0
  const matchedCount =
    visibleBoard.todo.length + visibleBoard.doing.length + visibleBoard.done.length

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <StreamBanner />

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            StoryBoard
          </h1>
          <p className="text-sm text-muted-foreground">
            Move stories across the board to update their status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              reset()
              setOpenStoryId(null)
            }}
          >
            <Trash2 className="size-4 text-muted-foreground" aria-hidden="true" />
            Clear board
          </Button>
          <Link to="/" className={buttonVariants({ variant: "default", size: "lg" })}>
            <Plus className="size-4" aria-hidden="true" />
            New idea
          </Link>
        </div>
      </header>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">
            <LayoutGrid className="size-4" aria-hidden="true" />
            Board
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="size-4" aria-hidden="true" />
            List
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="size-4" aria-hidden="true" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4">
          <div className="flex flex-col gap-4">
            <div className="relative w-full max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles, descriptions, labels…"
                className="h-9 w-full rounded-lg border border-input bg-background pr-9 pl-8 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {isSearching && matchedCount > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground tabular-nums">
                  {matchedCount}
                </span>{" "}
                of {stories.length} stories match{" "}
                <span className="font-medium text-foreground">
                  &ldquo;{debouncedQuery.trim()}&rdquo;
                </span>
              </p>
            )}

            {isSearching && matchedCount === 0 ? (
              <EmptyState
                icon={SearchX}
                title={`No stories match \u201c${debouncedQuery.trim()}\u201d`}
                description="Try a different search, or clear it to see the full board."
                action={
                  <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                    <X aria-hidden="true" />
                    Clear search
                  </Button>
                }
              />
            ) : (
              <Board
                board={visibleBoard}
                onOpenStory={setOpenStoryId}
                onMove={moveStory}
              >
                <ErrorBoundary key="todo">
                  <Board.Column id="todo" />
                </ErrorBoundary>
                <ErrorBoundary key="doing">
                  <Board.Column id="doing" />
                </ErrorBoundary>
                <ErrorBoundary key="done">
                  <Board.Column id="done" />
                </ErrorBoundary>
              </Board>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <StoryTable stories={stories} onOpenStory={setOpenStoryId} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <HistoryList history={history} onRunAgain={(idea) => generate(idea)} />
        </TabsContent>
      </Tabs>

      <StoryDialog
        story={openStory}
        onOpenChange={(open) => {
          if (!open) setOpenStoryId(null)
        }}
        onMove={(toStatus) => {
          if (openStory) moveStory(openStory.id, toStatus)
        }}
        onDelete={() => {
          if (openStory) {
            removeStory(openStory.id)
            setOpenStoryId(null)
          }
        }}
      />
    </div>
  )
}