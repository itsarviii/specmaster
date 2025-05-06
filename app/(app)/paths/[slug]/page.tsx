import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Clock, BookOpen, CheckCircle2, Circle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getLearningPathBySlug, getUserEnrollments, getUserLessonCompletions } from "@/lib/db/learning-paths"
import { EnrollButton } from "@/components/learn/enroll-button"
import { DIFFICULTY_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import type { Lesson, PathModule } from "@/lib/types"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const path = await getLearningPathBySlug(slug)
  return { title: path?.title ?? "Learning Path" }
}

export default async function PathDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const path = await getLearningPathBySlug(slug)
  if (!path) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [enrollments, completedIds] = await Promise.all([
    user ? getUserEnrollments(user.id) : Promise.resolve([]),
    user ? getUserLessonCompletions(user.id) : Promise.resolve([]),
  ])

  const enrolled = enrollments.some((e) => e.path_id === path.id)
  const completedSet = new Set(completedIds)

  const allLessons = path.path_modules.flatMap((m: PathModule & { lessons: Lesson[] }) => m.lessons)
  const totalLessons = allLessons.length
  const completedCount = allLessons.filter((l: Lesson) => completedSet.has(l.id)).length
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const nextLesson = enrolled ? allLessons.find((l: Lesson) => !completedSet.has(l.id)) : null

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8">
      <Link href="/paths" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="size-4" /> All paths
      </Link>

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <h1 className="font-display text-3xl font-bold leading-tight">{path.title}</h1>
            {path.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">{path.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="capitalize">{DIFFICULTY_LABELS[path.difficulty]}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="size-3" /> {path.estimated_hours}h</span>
              <span>·</span>
              <span className="flex items-center gap-1"><BookOpen className="size-3" /> {totalLessons} lessons</span>
            </div>
          </div>
          <EnrollButton pathId={path.id} initialEnrolled={enrolled} />
        </div>

        {enrolled && totalLessons > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{completedCount} of {totalLessons} lessons complete</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {enrolled && nextLesson && (
          <Link
            href={`/paths/${path.slug}/${nextLesson.slug}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20 hover:bg-primary/12 transition-colors"
          >
            <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <BookOpen className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary font-medium mb-0.5">Continue learning</p>
              <p className="text-sm font-medium truncate">{nextLesson.title}</p>
            </div>
            <ChevronLeft className="size-4 text-muted-foreground rotate-180 shrink-0" />
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {path.path_modules.map((module: PathModule & { lessons: Lesson[] }, moduleIdx: number) => (
          <div key={module.id} className="rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 bg-muted/30 border-b border-border">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Module {moduleIdx + 1}</p>
              <h3 className="font-display font-semibold text-sm mt-0.5">{module.title}</h3>
            </div>
            {module.lessons.map((lesson: Lesson, lessonIdx: number) => {
              const done = completedSet.has(lesson.id)
              const rowClass = "flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 bg-card transition-colors"
              const content = (
                <>
                  <span className="shrink-0">
                    {done
                      ? <CheckCircle2 className="size-4 text-emerald-400" />
                      : <Circle className="size-4 text-muted-foreground/40" />
                    }
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{lesson.estimated_mins} min · {lesson.xp_reward} XP</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{lessonIdx + 1}</span>
                </>
              )
              return enrolled ? (
                <Link key={lesson.id} href={`/paths/${path.slug}/${lesson.slug}`} className={cn(rowClass, "hover:bg-muted/30")}>
                  {content}
                </Link>
              ) : (
                <div key={lesson.id} className={cn(rowClass, "opacity-60")}>
                  {content}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
