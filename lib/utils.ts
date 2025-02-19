import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function xpToLevel(totalXp: number): { level: number; title: string; progress: number; nextLevelXp: number } {
  const thresholds = [0, 200, 500, 1000, 1800, 3000, 4500, 6500, 9000, 12000, 16000]
  const titles = [
    "Bar Back",
    "Barkeep",
    "Pour Master",
    "Mixologist",
    "Cocktail Craftsman",
    "Spirits Expert",
    "Bar Veteran",
    "Head Bartender",
    "Bar Manager",
    "Master Bartender",
    "Legendary Barkeep",
  ]

  let level = 0
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXp >= thresholds[i]) {
      level = i
      break
    }
  }

  const current = thresholds[level]
  const next = thresholds[level + 1] ?? thresholds[thresholds.length - 1]
  const progress = level >= thresholds.length - 1 ? 100 : Math.round(((totalXp - current) / (next - current)) * 100)

  return { level: level + 1, title: titles[level], progress, nextLevelXp: next }
}

export function calculateStreakStatus(lastActiveDate: string | null): boolean {
  if (!lastActiveDate) return false
  const last = new Date(lastActiveDate)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 1
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}
