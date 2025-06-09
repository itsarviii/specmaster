"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const MODES = [
  {
    id: "flashcard",
    label: "Flashcard",
    description: "See a cocktail — guess the base spirit.",
    emoji: "🃏",
    color: "from-violet-500/10 to-violet-500/5",
    activeBorder: "border-violet-500/50",
    activeText: "text-violet-400",
  },
  {
    id: "ingredient_challenge",
    label: "Ingredient Challenge",
    description: "See the ingredients — name the cocktail.",
    emoji: "🧪",
    color: "from-emerald-500/10 to-emerald-500/5",
    activeBorder: "border-emerald-500/50",
    activeText: "text-emerald-400",
  },
  {
    id: "name_that_cocktail",
    label: "Name That Cocktail",
    description: "See the spirit and method — name the drink.",
    emoji: "🍸",
    color: "from-primary/10 to-primary/5",
    activeBorder: "border-primary/50",
    activeText: "text-primary",
  },
]

const MIN_SAVES = 4

export function GameHub({ savedCount }: { savedCount: number }) {
  const [mode, setMode] = useState<string | null>(null)
  const [scope, setScope] = useState("random")
  const router = useRouter()

  const notEnoughSaves = scope === "saved" && savedCount < MIN_SAVES
  const canStart = !!mode && !notEnoughSaves

  function handleStart() {
    if (!canStart) return
    router.push(`/games/${mode}?scope=${scope}`)
  }

  return (
    <div className="space-y-8">

      {/* Mode picker */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pick a game</p>
        <div className="space-y-2.5">
          {MODES.map((m) => {
            const active = mode === m.id
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                  active
                    ? `bg-linear-to-r ${m.color} ${m.activeBorder}`
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <span className="text-3xl shrink-0">{m.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className={cn("font-semibold text-sm", active && m.activeText)}>{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                </div>
                <div className={cn(
                  "size-4 rounded-full border-2 shrink-0 transition-all",
                  active ? `border-current bg-current ${m.activeText}` : "border-muted-foreground/30"
                )} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Scope picker */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recipe pool</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { id: "random", label: "Full Library", description: "Any recipe from the collection" },
            { id: "saved",  label: "My Saves",    description: `${savedCount} saved recipe${savedCount === 1 ? "" : "s"}` },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setScope(s.id)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all",
                scope === s.id
                  ? "border-primary bg-primary/8"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <p className={cn("font-semibold text-sm", scope === s.id && "text-primary")}>{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
            </button>
          ))}
        </div>

        {notEnoughSaves && (
          <p className="text-xs text-amber-400">
            Need at least {MIN_SAVES} saves to use this pool.{" "}
            <Link href="/recipes" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
              Browse recipes →
            </Link>
          </p>
        )}
      </div>

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Let&apos;s go →
      </button>
    </div>
  )
}
