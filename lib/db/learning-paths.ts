import { createClient } from "@/lib/supabase/server"
import type { LearningPath, PathModule, Lesson, UserPathEnrollment } from "@/lib/types"

export async function getLearningPaths(): Promise<LearningPath[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
  return (data ?? []) as LearningPath[]
}

export async function getLearningPathBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("learning_paths")
    .select("*, path_modules(id, title, sort_order, lessons(id, title, slug, type, xp_reward, estimated_mins, sort_order, is_published))")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  if (!data) return null

  return {
    ...data,
    path_modules: (data.path_modules ?? [])
      .sort((a: PathModule, b: PathModule) => a.sort_order - b.sort_order)
      .map((m: PathModule & { lessons: Lesson[] }) => ({
        ...m,
        lessons: (m.lessons ?? [])
          .filter((l: Lesson) => l.is_published)
          .sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order),
      })),
  }
}

export async function getLessonBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("lessons")
    .select("*, path_modules(id, title, sort_order, path_id, learning_paths(id, slug, title))")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  return data ?? null
}

export async function getUserEnrollments(userId: string): Promise<UserPathEnrollment[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("user_path_enrollments")
    .select("*")
    .eq("user_id", userId)
  return (data ?? []) as UserPathEnrollment[]
}

export async function getUserLessonCompletions(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("user_lesson_completions")
    .select("lesson_id")
    .eq("user_id", userId)
  return (data ?? []).map((r: { lesson_id: string }) => r.lesson_id)
}

export async function getInProgressPath(userId: string) {
  const supabase = await createClient()

  const { data: enrollments } = await supabase
    .from("user_path_enrollments")
    .select("*, learning_paths(id, slug, title, estimated_hours, difficulty, path_modules(id, sort_order, lessons(id, slug, title, sort_order, is_published)))")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("enrolled_at", { ascending: false })
    .limit(1)

  if (!enrollments || enrollments.length === 0) return null

  const enrollment = enrollments[0]
  const path = enrollment.learning_paths
  if (!path) return null

  const { data: completions } = await supabase
    .from("user_lesson_completions")
    .select("lesson_id")
    .eq("user_id", userId)

  const completedIds = new Set((completions ?? []).map((c: { lesson_id: string }) => c.lesson_id))

  const allLessons = (path.path_modules ?? [])
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    .flatMap((m: { lessons: Lesson[] }) =>
      (m.lessons ?? []).filter((l: Lesson) => l.is_published).sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order)
    )

  const totalLessons = allLessons.length
  const completedCount = allLessons.filter((l: Lesson) => completedIds.has(l.id)).length
  const nextLesson = allLessons.find((l: Lesson) => !completedIds.has(l.id)) ?? null

  return {
    path: path as LearningPath,
    nextLesson: nextLesson as Lesson | null,
    completedCount,
    totalLessons,
    progress: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
  }
}
