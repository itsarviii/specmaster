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
      const action = next ? saveRecipeAction : unsaveRecipeAction
      const result = await action(recipeId)
      if (result?.error) {
        setIsSaved(!next)
        toast.error("Something went wrong")
      } else {
        toast.success(next ? "Saved to collection" : "Removed from collection")
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
