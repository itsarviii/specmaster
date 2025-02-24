"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassWater } from "lucide-react"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <GlassWater className="size-12 text-primary mb-6 opacity-60" />
      <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        An unexpected error occurred. Try again or come back later.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
