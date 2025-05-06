"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { enrollInPath, unenrollFromPath } from "@/lib/actions/learning-paths"

interface EnrollButtonProps {
  pathId: string
  initialEnrolled: boolean
  className?: string
}

export function EnrollButton({ pathId, initialEnrolled, className }: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(initialEnrolled)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      if (enrolled) {
        const result = await unenrollFromPath(pathId)
        if (result.error) { toast.error(result.error); return }
        setEnrolled(false)
        toast.success("Unenrolled from path")
      } else {
        const result = await enrollInPath(pathId)
        if (result.error) { toast.error(result.error); return }
        setEnrolled(true)
        toast.success("Enrolled! Let's start learning.")
        router.refresh()
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center px-5 h-10 rounded-lg text-sm font-semibold transition-all disabled:opacity-60",
        enrolled
          ? "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {pending ? "…" : enrolled ? "Unenroll" : "Start learning"}
    </button>
  )
}
