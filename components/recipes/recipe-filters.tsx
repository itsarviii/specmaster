"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { SPIRIT_LABELS, DIFFICULTY_LABELS, METHOD_LABELS } from "@/lib/constants"

const SPIRITS = Object.keys(SPIRIT_LABELS)
const DIFFICULTIES = Object.keys(DIFFICULTY_LABELS)
const METHODS = ["shake", "stir", "build", "blend"]

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0",
        active
          ? "bg-primary/15 text-primary border-primary/30"
          : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}

export function RecipeFilters({
  initialSpirit,
  initialDifficulty,
  initialMethod,
}: {
  initialSpirit?: string
  initialDifficulty?: string
  initialMethod?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) params.delete(key)
    else params.set(key, value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    const params = new URLSearchParams()
    const q = searchParams.get("q")
    if (q) params.set("q", q)
    router.push(`${pathname}?${params.toString()}`)
  }

  const spirit = searchParams.get("spirit") ?? initialSpirit
  const difficulty = searchParams.get("difficulty") ?? initialDifficulty
  const method = searchParams.get("method") ?? initialMethod
  const hasFilters = !!(spirit || difficulty || method)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">Spirit</span>
        <div className="flex gap-2 flex-wrap">
          {SPIRITS.map((s) => (
            <FilterChip
              key={s}
              label={SPIRIT_LABELS[s]}
              active={spirit === s}
              onClick={() => setFilter("spirit", s)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">Level</span>
        <div className="flex gap-2 flex-wrap">
          {DIFFICULTIES.map((d) => (
            <FilterChip
              key={d}
              label={DIFFICULTY_LABELS[d]}
              active={difficulty === d}
              onClick={() => setFilter("difficulty", d)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">Method</span>
        <div className="flex gap-2 flex-wrap">
          {METHODS.map((m) => (
            <FilterChip
              key={m}
              label={METHOD_LABELS[m] ?? m}
              active={method === m}
              onClick={() => setFilter("method", m)}
            />
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
