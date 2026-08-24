import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GenerationProgress } from "@/features/generate/GenerationProgress"
import { storiesOnBoard } from "@/lib/board"
import { useStream } from "@/state/StoryboardProvider"
import { ArrowRight, LayoutGrid, LoaderCircle, Sparkles } from "lucide-react"

const MAX_CHARS = 1200

const examples = [
  "Let users sign in with their company SSO",
  "Send a Slack notification when a story moves to Done",
  "Export the board to CSV with the current filter applied",
  "Invite teammates by email and assign a default role",
]

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
      <title>AI JIRA Board logo</title>
      <rect width="32" height="32" rx="9" fill="#CC3A63" />
      <rect x="7" y="8" width="3" height="14" rx="1.5" fill="#FFF7EB" />
      <rect x="14.5" y="8" width="3" height="9" rx="1.5" fill="#FFF7EB" />
      <rect x="22" y="8" width="3" height="16" rx="1.5" fill="#FFF7EB" />
      <rect x="7" y="23.5" width="3" height="1.5" rx="0.75" fill="#F9F0E0" opacity="0.6" />
      <rect x="22" y="25.5" width="3" height="1.5" rx="0.75" fill="#F9F0E0" opacity="0.4" />
    </svg>
  )
}

export function Landing() {
  const [idea, setIdea] = useState("")
  const textareaRef = useRef(null)
  const navigate = useNavigate()
  const { generate, status, titles } = useStream()

  const submitting = status === "streaming"

  const submit = async () => {
    const trimmed = idea.trim()
    if (!trimmed || submitting) return
    const delivered = await generate(trimmed)
    if (delivered > 0) {
      setTimeout(() => navigate("/board"), 1800)
    }
  }

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            AI JIRA Board
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {storiesOnBoard > 0 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/board")}
            >
              <LayoutGrid className="size-4 text-primary" aria-hidden="true" />
              {storiesOnBoard}{" "}
              <span className="hidden sm:inline">
                story{storiesOnBoard === 1 ? "" : "s"} on the board
              </span>
              <span className="sm:hidden">on the board</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 sm:px-6">
        <div className="flex w-full max-w-2xl flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            QA-first story writing
          </span>

          <h1 className="text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Describe a feature.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Watch it become a backlog.
            </span>
          </h1>

          <p className="max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell us what to build and get a QA-ready Jira backlog in seconds.
          </p>

          <Card className="w-full shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
              <Textarea
                ref={textareaRef}
                autoFocus
                rows={4}
                maxLength={MAX_CHARS}
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Let users sign in with their company SSO…"
                className="min-h-0 resize-none border-0 bg-transparent px-0 py-0 text-base shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-lg"
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {idea.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>

                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    <kbd className="font-sans">⌘</kbd> + <kbd className="font-sans">↵</kbd>{" "}
                    to submit
                  </span>
                  <Button
                    size="lg"
                    className="px-6"
                    disabled={!idea.trim() || submitting}
                    onClick={submit}
                  >
                    {submitting ? (
                      <>
                        Generating
                        <LoaderCircle
                          data-icon="inline-end"
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <>
                        Generate
                        <ArrowRight data-icon="inline-end" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {status === "idle" ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setIdea(example)
                    textareaRef.current?.focus()
                  }}
                  className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {example}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-3">
              <GenerationProgress />
              {titles.length > 0 && (
                <ul className="w-full space-y-1.5" aria-label="Generated stories">
                  {titles.map((title) => (
                    <li
                      key={title}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-sm"
                    >
                      <Sparkles
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="truncate text-sm text-foreground">{title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
