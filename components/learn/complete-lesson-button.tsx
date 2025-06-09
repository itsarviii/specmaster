"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { completeLesson } from "@/lib/actions/learning-paths"

interface CompleteLessonButtonProps {
  lessonId: string
  pathId: string
  xpReward: number
  nextLessonSlug?: string
  pathSlug: string
  initialCompleted: boolean
}

export function CompleteLessonButton({
  lessonId,
  pathId,
  xpReward,
  nextLessonSlug,
  pathSlug,
  initialCompleted,
}: CompleteLessonButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleComplete() {
    if (completed) {
      if (nextLessonSlug) router.push(`/paths/${pathSlug}/${nextLessonSlug}`)
      else router.push(`/paths/${pathSlug}`)
      return
    }

    startTransition(async () => {
      const result = await completeLesson(lessonId, pathId, xpReward)
      if (result.error) { toast.error(result.error); return }
      setCompleted(true)
      if (!result.alreadyDone) {
        toast.success(`+${xpReward} XP earned`)
        result.newBadges?.forEach((b) => toast.success(`${b.icon} Badge unlocked: ${b.name}`))
      }
      if (nextLessonSlug) {
        router.push(`/paths/${pathSlug}/${nextLessonSlug}`)
      } else {
        toast.success("Path complete! 🎓")
        router.push(`/paths/${pathSlug}`)
      }
    })
  }

  return (
    <button
      onClick={handleComplete}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 px-6 h-11 rounded-lg text-sm font-semibold transition-all disabled:opacity-60",
        completed
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {completed && <CheckCircle className="size-4" />}
      {pending ? "Saving…" : completed ? (nextLessonSlug ? "Next lesson" : "Back to path") : "Mark complete"}
    </button>
  )
}
