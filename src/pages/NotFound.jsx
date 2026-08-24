import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/EmptyState"
import { ArrowLeft, FileQuestion } from "lucide-react"

export function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <EmptyState
        icon={FileQuestion}
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        className="w-full max-w-md py-16"
        action={
          <Link
            to="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Back to home
          </Link>
        }
      />
    </main>
  )
}