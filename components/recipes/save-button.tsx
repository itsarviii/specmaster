"use client"

import { useState, useTransition } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { saveRecipeAction, unsaveRecipeAction } from "@/lib/actions/recipes"

interface SaveButtonProps {
  recipeId: string
  initialSaved: boolean
  className?: string
}

export function SaveButton({ recipeId, initialSaved, className }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const next = !isSaved
    setIsSaved(next)
    startTransition(async () => {
      if (!next) {
        const result = await unsaveRecipeAction(recipeId)
        if (result?.error) { setIsSaved(!next); toast.error("Something went wrong") }
        else toast.success("Removed from collection")
      } else {
        const result = await saveRecipeAction(recipeId)
        if (result?.error) { setIsSaved(!next); toast.error("Something went wrong") }
        else {
          toast.success("Saved to collection")
          result.newBadges?.forEach((b) => toast.success(`${b.icon} Badge unlocked: ${b.name}`))
        }
      }
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={isSaved ? "Remove from saved" : "Save recipe"}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors disabled:opacity-50",
        isSaved
          ? "text-primary"
          : "text-muted-foreground hover:text-primary",
        className
      )}
    >
      {isSaved ? (
        <BookmarkCheck className="size-4" />
      ) : (
        <Bookmark className="size-4" />
      )}
    </button>
  )
}
