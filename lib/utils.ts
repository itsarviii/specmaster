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
