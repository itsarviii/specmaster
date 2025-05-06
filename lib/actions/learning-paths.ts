"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function enrollInPath(pathId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("user_path_enrollments")
    .insert({ user_id: user.id, path_id: pathId })

  if (error) return { error: error.message }
  revalidatePath("/paths")
  return { success: true }
}

export async function unenrollFromPath(pathId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("user_path_enrollments")
    .delete()
    .eq("user_id", user.id)
    .eq("path_id", pathId)

  if (error) return { error: error.message }
  revalidatePath("/paths")
  return { success: true }
}

export async function completeLesson(lessonId: string, pathId: string, xpReward: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error: completionError } = await supabase
    .from("user_lesson_completions")
    .insert({ user_id: user.id, lesson_id: lessonId })

  if (completionError) {
    if (completionError.code === "23505") return { success: true, alreadyDone: true }
    return { error: completionError.message }
  }

  await supabase.from("user_xp_events").insert({
    user_id: user.id,
    xp_amount: xpReward,
    reason: "Lesson completed",
    source_type: "lesson",
    source_id: lessonId,
  })

  const { data: path } = await supabase
    .from("learning_paths")
    .select("path_modules(lessons(id, is_published))")
    .eq("id", pathId)
    .single()

  if (path) {
    const allLessonIds = (path.path_modules ?? [])
      .flatMap((m: { lessons: { id: string; is_published: boolean }[] }) =>
        (m.lessons ?? []).filter((l) => l.is_published).map((l) => l.id)
      )

    const { data: completions } = await supabase
      .from("user_lesson_completions")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", allLessonIds)

    if (completions && completions.length === allLessonIds.length) {
      await supabase
        .from("user_path_enrollments")
        .update({ completed_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("path_id", pathId)
    }
  }

  revalidatePath("/paths")
  revalidatePath("/dashboard")
  return { success: true, xpEarned: xpReward }
}
