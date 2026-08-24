export type Status = "todo" | "doing" | "done"

export type StoryKind = "story" | "bug" | "task"

export interface Story {
  id: string
  title: string
  description: string
  kind: StoryKind
  tag: string
  labels: string[]
  estimate: number
  status: Status
}

export const initialStories: Story[] = [
  {
    id: "US-142",
    title: "Sign in with SSO",
    description: "Allow users to sign in through their identity provider via SAML or OIDC.",
    kind: "story",
    tag: "US-142",
    labels: ["auth", "frontend"],
    estimate: 5,
    status: "todo",
  },
  {
    id: "US-143",
    title: "Dashboard export",
    description: "Export the dashboard report to CSV with the current filter applied.",
    kind: "story",
    tag: "US-143",
    labels: ["reporting"],
    estimate: 3,
    status: "todo",
  },
  {
    id: "US-137",
    title: "Password reset flow",
    description: "Send a reset link and let users choose a new password.",
    kind: "task",
    tag: "US-137",
    labels: ["auth"],
    estimate: 2,
    status: "doing",
  },
  {
    id: "US-128",
    title: "Invite teammates",
    description: "Invite teammates by email and assign a default role.",
    kind: "story",
    tag: "US-128",
    labels: ["teams"],
    estimate: 8,
    status: "done",
  },
]

export const storiesOnBoard = initialStories.length

export const COLUMN_ORDER: Status[] = ["todo", "doing", "done"]

export const COLUMNS: Record<Status, { title: string; dot: string }> = {
  todo: { title: "Todo", dot: "bg-muted-foreground" },
  doing: { title: "Doing", dot: "bg-accent" },
  done: { title: "Done", dot: "bg-primary" },
}
