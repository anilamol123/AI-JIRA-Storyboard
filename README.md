# AI JIRA Storyboard

Type an idea, get a JIRA-style storyboard. The backend streams generated
stories to the browser line by line while the board updates live.

## What it does

- **Landing page** (`/`) — a textarea where you describe a feature or product
  idea. On submit, a generation starts streaming; you can watch the status
  banner fill in token by token, then jump to the board.
- **Board** (`/board`) — a kanban board (`todo` / `doing` / `done`) with
  drag-and-drop cards (dnd-kit, pointer sensor with a 4px activation
  distance, keyboard fallback via chevron buttons), a detail dialog, and a
  search box that filters in real time (300ms debounce) without ever
  mutating the underlying data.
- **List & History tabs** — a tabular view of every story and a log of past
  generations.
- **Totals & generator badge** — the app header shows live story/point
  totals and a badge reporting which generator the backend is running
  (OpenRouter vs. built-in), from `GET /api/health`.
- **Theme toggle** — light/dark/system, persisted in `localStorage` under
  `jira.theme` and applied by toggling the `dark` class on `<html>`.
- **Optimistic moves** — dragging a card updates the UI instantly, persists
  to the backend in the background, and reverts with a toast if the write
  fails.
- **Polished edges** — a shared `EmptyState` everywhere a list can be empty
  (columns, list, history, search, 404), a brand-gradient favicon, and an
  `ErrorBoundary` wrapping each board column.

## How to run it

```bash
npm install
npm run dev
```

`npm run dev` starts Vite (frontend, http://localhost:5173) and the Node
stream server (backend, http://localhost:8787) together with `concurrently`.
Vite proxies every `/api/*` request to the backend, so the client only ever
talks to the same origin.

Production build:

```bash
npm run build   # tsc && vite build → dist/
npm run server  # stream server on :8787 (default; PORT to override)
npm run preview # serves dist/ with SPA fallback and the same /api proxy
```

Open http://localhost:4173. Refresh on `/board` — the preview server (and
Vercel, see below) rewrites unknown paths to `index.html`, so deep links
survive a refresh.

## Streaming protocol

`POST /api/stream` with a JSON body `{ "idea": string }` returns an
[NDJSON](https://ndjson.org) stream (`application/x-ndjson`,
`Cache-Control: no-cache`, `Connection: keep-alive`,
`X-Accel-Buffering: no`). Each line is one JSON event:

| `type`   | payload                                  | meaning                              |
| -------- | ---------------------------------------- | ------------------------------------ |
| `token`  | `{ type, chunk: string }`                | append `chunk` to the running text   |
| `story`  | `{ type, story: Story }`                 | a finished story, add to the board   |
| `done`   | `{ type, count: number, text?: string }` | stream complete                      |
| `error`  | `{ type, message: string }`              | generation failed                    |

Events are sent roughly 40ms apart. The client (`src/api/streamStories.ts`)
reads the response body in chunks, buffers until a newline, and parses each
line independently, so partial multi-byte characters split across TCP chunks
are handled safely (`TextDecoder` stream mode in `src/api/client.ts`).

A consumer keeps the same shape as:

```bash
curl -N -X POST http://localhost:5173/api/stream \
  -H "Content-Type: application/json" \
  -d '{"idea":"a to-do list"}'
```

Other endpoints: `POST /api/move` `{ id, to }` (persists a drag move,
returns `{ ok: true, id, to }`) and `GET /api/health` (returns
`{ ok: true, generator: "openrouter" | "built-in" }`).

## Folder structure

```
server/index.js          Node stream server (stream, move, health)
src/
  api/                   HTTP client + NDJSON streaming (client.ts, streamStories.ts)
  assets/                static assets
  components/            app-level UI (AppHeader, ThemeToggle, EmptyState, ErrorBoundary)
  components/ui/         shadcn-style primitives (button, card, dialog, tabs, drawer, …)
  features/
    board/               kanban: Board, Column, StoryCard, StoryPreview, reducer, dnd
    generate/            stream consumption: useStoryStream, StreamBanner, GenerationProgress
  hooks/                 useDebounce, useLocalStorage
  lib/                   story model + helpers (board.ts, utils.ts)
  pages/                 Landing, BoardPage, NotFound
  state/                 StoryboardProvider (board state + stream state contexts)
  App.jsx                routes: / → Landing, /board, * → NotFound
  main.tsx               entry
index.html               shell (links /favicon.svg)
public/favicon.svg       brand-gradient favicon
vite.config.ts           @-alias, /api dev + preview proxy
vercel.json              Vercel function limits + SPA rewrite
```

## Environment variables

| Variable             | Where          | Used for                                                              |
| -------------------- | -------------- | --------------------------------------------------------------------- |
| `PORT`               | server         | Stream server port (default `8787`)                                   |
| `OPENROUTER_API_KEY` | server         | Presence flips `GET /api/health` to report `generator: "openrouter"`  |

Local: put them in a `.env` in the repo root and they will be picked up by
the dev process (dotenvx is already installed; the `.env` file is gitignored).
Vercel: add them in the project's Environment Variables settings — the server
logic must run in a function (see "What I'd do next") for the API key to
reach it.

## What I'd do next

- **Wire up real generation.** `server/index.js` still emits canned stories;
  `OPENROUTER_API_KEY` only switches the badge. Replace `buildEvents` with a
  call to the OpenRouter API and stream its token deltas through the same
  NDJSON protocol so the UI needs zero changes.
- **Ship the API to Vercel Functions.** `vercel.json` already caps
  `api/**/*.js` at a 60s duration, but no functions exist yet. Port
  `server/index.js` into `api/stream.js`, `api/move.js` and `api/health.js`
  so generation runs fully serverless (this is also where the key lands).
- **Persist the board.** Board state lives in memory only; a localStorage or
  server-backed store would let refreshes survive.
- **Move the drag-and-drop a11y story forward** (keyboard reorder is still
  chevron-only) and add a real test suite for the reducer, streaming client,
  and optimistic-move revert.