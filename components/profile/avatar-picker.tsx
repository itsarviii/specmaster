"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AVATAR_PRESETS, getPresetIndex } from "@/lib/avatar-presets"
import { selectAvatarPresetAction } from "@/lib/actions/profiles"
import { toast } from "sonner"

interface AvatarPickerProps {
  avatarUrl: string | null
  sizeClassName?: string
}

export function AvatarPicker({ avatarUrl, sizeClassName = "size-20" }: AvatarPickerProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(getPresetIndex(avatarUrl))
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [])

  function handleSelect(index: number) {
    setSelected(index)
    setOpen(false)
    startTransition(async () => {
      const result = await selectAvatarPresetAction(index)
      if (result?.error) toast.error("Failed to update avatar")
    })
  }

  const preset = AVATAR_PRESETS[selected]
  const isLarge = sizeClassName === "size-24"

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className={cn(
          "rounded-full border-2 flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-50",
          sizeClassName,
          preset.bg,
          preset.border,
        )}
        aria-label="Change avatar"
      >
        <span className={isLarge ? "text-4xl" : "text-base"}>{preset.emoji}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-card border border-border rounded-xl shadow-xl shadow-black/40 p-3 w-52">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-0.5">
            Choose your avatar
          </p>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                title={p.label}
                className={cn(
                  "size-10 rounded-full border-2 flex items-center justify-center text-xl transition-all hover:scale-110",
                  p.bg,
                  selected === i ? p.border : "border-transparent",
                  selected === i && "ring-2 ring-offset-1 ring-offset-card ring-white/20 scale-110",
                )}
              >
                {p.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
