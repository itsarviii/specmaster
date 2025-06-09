"use client"

import { useState, useTransition } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { deleteAccountAction } from "@/lib/actions/auth"

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccountAction()
      if (result?.error) {
        toast.error("Could not delete account. Try again.")
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-400">Are you sure?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This permanently deletes your account, XP, badges, saved recipes, and progress. There is no undo.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60"
          >
            {isPending ? "Deleting…" : "Yes, delete my account"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-400 transition-colors"
    >
      <Trash2 className="size-4" />
      Delete account
    </button>
  )
}
