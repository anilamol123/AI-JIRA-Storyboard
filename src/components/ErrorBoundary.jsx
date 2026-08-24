import { Component } from "react"

import { Button } from "@/components/ui/button"
import { RotateCcw, TriangleAlert } from "lucide-react"

// Error boundaries do NOT catch:
// - errors thrown in event handlers (use try/catch there)
// - errors in async code such as setTimeout/await (use try/catch or .catch)
// - promise rejections (handle them with .catch on the promise)
// They only catch errors raised while rendering children, in lifecycle methods,
// and in constructors of components below them in the tree.

export class ErrorBoundary extends Component {
  state = { hasError: false }

  // Pure: no side effects, only flips state so the boundary renders its fallback.
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Side effects belong here: log the error and the component stack.
    console.error("ErrorBoundary caught an error", error, info?.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-destructive/40 bg-destructive/5 px-4 text-center">
          <TriangleAlert className="size-5 text-destructive" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            Something went wrong here.
          </p>
          <Button variant="outline" size="sm" onClick={this.handleReset}>
            <RotateCcw aria-hidden="true" />
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}