import type { Status, Story } from "@/lib/board"
import { initialStories } from "@/lib/board"

export type Board = Record<Status, Story[]>

export const prevPrompts: string[] = []

export interface BoardState {
  board: Board
  prevPrompts: string[]
}

export type BoardAction =
  | { type: "addStory"; story: Story; prompt?: string; status?: Status }
  | { type: "move"; id: string; toStatus: Status }
  | { type: "removeStory"; id: string }
  | { type: "reset" }

const statuses: Status[] = ["todo", "doing", "done"]

function buildInitialBoard(): Board {
  const board: Board = { todo: [], doing: [], done: [] }
  for (const story of initialStories) {
    board[story.status].push({ ...story })
  }
  return board
}

export const initialBoardState: BoardState = {
  board: buildInitialBoard(),
  prevPrompts,
}

export function boardReducer(
  state: BoardState,
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "addStory": {
      const status = action.status ?? "todo"
      const board: Board = {
        todo: state.board.todo.filter((s) => s.id !== action.story.id),
        doing: state.board.doing.filter((s) => s.id !== action.story.id),
        done: state.board.done.filter((s) => s.id !== action.story.id),
      }
      board[status] = [...board[status], { ...action.story, status }]
      return {
        board,
        prevPrompts: action.prompt
          ? [...state.prevPrompts, action.prompt]
          : state.prevPrompts,
      }
    }

    case "move": {
      const sourceStatus = statuses.find((status) =>
        state.board[status].some((story) => story.id === action.id)
      )
      if (!sourceStatus || sourceStatus === action.toStatus) return state

      const story = state.board[sourceStatus].find((s) => s.id === action.id)
      if (!story) return state

      return {
        ...state,
        board: {
          ...state.board,
          [sourceStatus]: state.board[sourceStatus].filter((s) => s.id !== action.id),
          [action.toStatus]: [
            ...state.board[action.toStatus],
            { ...story, status: action.toStatus },
          ],
        },
      }
    }

    case "removeStory": {
      const board: Board = {
        todo: [],
        doing: [],
        done: [],
      }
      for (const status of statuses) {
        board[status] = state.board[status].filter((s) => s.id !== action.id)
      }
      return { ...state, board }
    }

    case "reset": {
      return { board: buildInitialBoard(), prevPrompts: [] }
    }

    default: {
      const unknown = action as { type?: unknown }
      throw new Error(
        `Unknown action type: ${unknown.type === undefined ? "undefined" : String(unknown.type)}`
      )
    }
  }
}