"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { BADGE_SLUGS } from "@/lib/constants"

async function tryAwardBadge(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  slug: string
): Promise<{ name: string; icon: string } | null> {
  const { data: badge } = await supabase.from("badges").select("id, name, icon").eq("slug", slug).single()
  if (!badge) return null
  const { error } = await supabase.from("user_badges").insert({ user_id: userId, badge_id: badge.id })
  if (error) return null
  return { name: badge.name, icon: badge.icon }
}

async function updateStreak(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const today = new Date().toISOString().split("T")[0]
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!streak) {
    await supabase.from("user_streaks").insert({
      user_id: userId, current_streak: 1, longest_streak: 1, last_active_date: today,
    })
    return 1
  }

  if (streak.last_active_date === today) return streak.current_streak

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]
  const newStreak = streak.last_active_date === yesterdayStr ? streak.current_streak + 1 : 1
  const longest = Math.max(newStreak, streak.longest_streak)

  await supabase
    .from("user_streaks")
    .update({ current_streak: newStreak, longest_streak: longest, last_active_date: today })
    .eq("user_id", userId)

  return newStreak
}

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

  // Streak + badges
  const newStreak = await updateStreak(supabase, user.id)

  const { count: lessonCount } = await supabase
    .from("user_lesson_completions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)

  const newBadges: { name: string; icon: string }[] = []

  if ((lessonCount ?? 0) === 1) {
    const b = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.FIRST_LESSON_COMPLETE)
    if (b) newBadges.push(b)
  }
  if ((lessonCount ?? 0) === 10) {
    const b = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.DEDICATED)
    if (b) newBadges.push(b)
  }
  if (newStreak >= 7) {
    const b = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.STREAK_7)
    if (b) newBadges.push(b)
  }
  if (newStreak >= 30) {
    const b = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.STREAK_30)
    if (b) newBadges.push(b)
  }

  // Check path completion
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

      const b = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.FIRST_PATH_COMPLETE)
      if (b) newBadges.push(b)
    }
  }

  revalidatePath("/paths")
  revalidatePath("/dashboard")
  revalidatePath("/profile")
  return { success: true, xpEarned: xpReward, newBadges }
}
