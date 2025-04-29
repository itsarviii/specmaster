"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronDown, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SPIRIT_LABELS, DIFFICULTY_LABELS, METHOD_LABELS } from "@/lib/constants"

const SPIRITS = Object.keys(SPIRIT_LABELS)
const DIFFICULTIES = Object.keys(DIFFICULTY_LABELS)
const METHODS = ["shake", "stir", "build", "blend"]

function FilterDropdown({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string
  value: string | undefined
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const activeLabel = value ? options.find((o) => o.value === value)?.label : null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border text-sm font-medium transition-all",
          value
            ? "border-primary/50 bg-primary/10 text-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80"
        )}
      >
        {activeLabel ?? placeholder}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 min-w-40 rounded-lg border border-border bg-card shadow-xl shadow-black/30 overflow-hidden">
          <button
            onClick={() => { onChange(""); setOpen(false) }}
            className={cn(
              "w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors",
              !value ? "text-foreground bg-muted/40" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
            )}
          >
            All {placeholder}s
            {!value && <Check className="size-3.5 text-primary" />}
          </button>
          <div className="h-px bg-border" />
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors",
                value === o.value
                  ? "text-foreground bg-primary/10"
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              )}
            >
              {o.label}
              {value === o.value && <Check className="size-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
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
    if (!value) params.delete(key)
    else params.set(key, value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    const q = searchParams.get("q")
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const spirit = searchParams.get("spirit") ?? initialSpirit
  const difficulty = searchParams.get("difficulty") ?? initialDifficulty
  const method = searchParams.get("method") ?? initialMethod
  const hasFilters = !!(spirit || difficulty || method)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FilterDropdown
        placeholder="Spirit"
        value={spirit}
        options={SPIRITS.map((s) => ({ value: s, label: SPIRIT_LABELS[s] }))}
        onChange={(v) => setFilter("spirit", v)}
      />
      <FilterDropdown
        placeholder="Difficulty"
        value={difficulty}
        options={DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] }))}
        onChange={(v) => setFilter("difficulty", v)}
      />
      <FilterDropdown
        placeholder="Method"
        value={method}
        options={METHODS.map((m) => ({ value: m, label: METHOD_LABELS[m] ?? m }))}
        onChange={(v) => setFilter("method", v)}
      />
      {hasFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3.5" /> Clear
        </button>
      )}
    </div>
  )
}
