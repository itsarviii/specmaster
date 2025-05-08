import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Clock, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getLessonBySlug, getLearningPathBySlug, getUserEnrollments, getUserLessonCompletions } from "@/lib/db/learning-paths"
import { LessonContent } from "@/components/learn/lesson-content"
import { CompleteLessonButton } from "@/components/learn/complete-lesson-button"
import type { Metadata } from "next"
import type { Lesson, PathModule } from "@/lib/types"

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lessonSlug: string }> }): Promise<Metadata> {
  const { lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  return { title: lesson?.title ?? "Lesson" }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonSlug: string }> }) {
  const { slug, lessonSlug } = await params
  const [lesson, path] = await Promise.all([
    getLessonBySlug(lessonSlug),
    getLearningPathBySlug(slug),
  ])
  if (!lesson || !path) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [enrollments, completedIds] = await Promise.all([
    user ? getUserEnrollments(user.id) : Promise.resolve([]),
    user ? getUserLessonCompletions(user.id) : Promise.resolve([]),
  ])

  const enrolled = enrollments.some((e: { path_id: string }) => e.path_id === path.id)
  const completedSet = new Set(completedIds)
  const isCompleted = completedSet.has(lesson.id)

  const allLessons = path.path_modules.flatMap((m: PathModule & { lessons: Lesson[] }) => m.lessons)
  const currentIndex = allLessons.findIndex((l: Lesson) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const currentModule = path.path_modules.find((m: PathModule & { lessons: Lesson[] }) =>
    m.lessons.some((l: Lesson) => l.id === lesson.id)
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/paths" className="hover:text-foreground transition-colors">Paths</Link>
        <ChevronLeft className="size-3.5 rotate-180" />
        <Link href={`/paths/${slug}`} className="hover:text-foreground transition-colors">{path.title}</Link>
        <ChevronLeft className="size-3.5 rotate-180" />
        <span className="text-foreground truncate">{lesson.title}</span>
      </div>

      <div className="space-y-3">
        {currentModule && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{currentModule.title}</p>
        )}
        <h1 className="font-display text-3xl font-bold leading-tight">{lesson.title}</h1>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-3" /> {lesson.estimated_mins} min</span>
          <span className="flex items-center gap-1"><Zap className="size-3" /> {lesson.xp_reward} XP</span>
        </div>
      </div>

      <div className="prose-none">
        <LessonContent blocks={lesson.content ?? []} />
      </div>

      {enrolled && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {prevLesson ? (
            <Link
              href={`/paths/${slug}/${prevLesson.slug}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-4" /> Previous
            </Link>
          ) : <div />}

          <CompleteLessonButton
            lessonId={lesson.id}
            pathId={path.id}
            xpReward={lesson.xp_reward}
            nextLessonSlug={nextLesson?.slug}
            pathSlug={slug}
            initialCompleted={isCompleted}
          />
        </div>
      )}

      {!enrolled && (
        <div className="flex justify-center pt-4 border-t border-border">
          <Link
            href={`/paths/${slug}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Enroll in this path to track your progress
          </Link>
        </div>
      )}
    </div>
  )
}
