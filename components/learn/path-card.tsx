import Link from "next/link"
import { Clock, GraduationCap, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { DIFFICULTY_LABELS } from "@/lib/constants"
import type { LearningPath } from "@/lib/types"

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  hard: "bg-rose-500/15 text-rose-400 border-rose-500/20",
}

interface PathCardProps {
  path: LearningPath & { lesson_count?: number; module_count?: number }
  enrolled?: boolean
  progress?: number
}

export function PathCard({ path, enrolled, progress }: PathCardProps) {
  return (
    <Link
      href={`/paths/${path.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors"
    >
      <div className="h-2 w-full bg-muted">
        {enrolled && progress !== undefined && progress > 0 && (
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display font-semibold text-base leading-snug group-hover:text-primary transition-colors">
              {path.title}
            </h3>
            {enrolled && (
              <span className="shrink-0 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                Enrolled
              </span>
            )}
          </div>
          {path.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
            DIFFICULTY_COLORS[path.difficulty] ?? ""
          )}>
            {DIFFICULTY_LABELS[path.difficulty]}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="size-3" /> {path.estimated_hours}h
          </span>
          {path.module_count !== undefined && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <GraduationCap className="size-3" /> {path.module_count} modules
            </span>
          )}
          {path.lesson_count !== undefined && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <BookOpen className="size-3" /> {path.lesson_count} lessons
            </span>
          )}
        </div>

        {enrolled && progress !== undefined && (
          <p className="text-xs text-muted-foreground">
            {progress === 100 ? "Completed" : `${progress}% complete`}
          </p>
        )}
      </div>
    </Link>
  )
}
