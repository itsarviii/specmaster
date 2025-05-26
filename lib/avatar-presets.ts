export const AVATAR_PRESETS = [
  { emoji: "🍸", bg: "bg-slate-800",   border: "border-slate-700",   label: "Martini"   },
  { emoji: "🍹", bg: "bg-cyan-950",    border: "border-cyan-800",    label: "Tropical"  },
  { emoji: "🥃", bg: "bg-amber-950",   border: "border-amber-800",   label: "Whiskey"   },
  { emoji: "🍷", bg: "bg-rose-950",    border: "border-rose-800",    label: "Wine"      },
  { emoji: "🥂", bg: "bg-yellow-950",  border: "border-yellow-800",  label: "Bubbles"   },
  { emoji: "🍺", bg: "bg-orange-950",  border: "border-orange-800",  label: "Beer"      },
  { emoji: "🍾", bg: "bg-emerald-950", border: "border-emerald-800", label: "Bottle"    },
  { emoji: "🧉", bg: "bg-lime-950",    border: "border-lime-800",    label: "Cocktail"  },
  { emoji: "🍋", bg: "bg-yellow-900",  border: "border-yellow-700",  label: "Citrus"    },
  { emoji: "🌿", bg: "bg-green-950",   border: "border-green-800",   label: "Herbs"     },
  { emoji: "🍒", bg: "bg-red-950",     border: "border-red-800",     label: "Cherry"    },
  { emoji: "🫧", bg: "bg-blue-950",    border: "border-blue-800",    label: "Soda"      },
] as const

export type AvatarPreset = typeof AVATAR_PRESETS[number]

export function getAvatarPreset(avatarUrl: string | null): AvatarPreset {
  if (avatarUrl?.startsWith("preset:")) {
    const index = parseInt(avatarUrl.split(":")[1], 10)
    return AVATAR_PRESETS[index] ?? AVATAR_PRESETS[0]
  }
  return AVATAR_PRESETS[0]
}

export function getPresetIndex(avatarUrl: string | null): number {
  if (avatarUrl?.startsWith("preset:")) {
    const index = parseInt(avatarUrl.split(":")[1], 10)
    return isNaN(index) ? 0 : index
  }
  return 0
}
