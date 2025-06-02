"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { BADGE_SLUGS, XP_REWARDS } from "@/lib/constants"

type BadgeResult = { name: string; icon: string } | null

async function tryAwardBadge(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  slug: string
): Promise<BadgeResult> {
  const { data: badge } = await supabase
    .from("badges")
    .select("id, name, icon")
    .eq("slug", slug)
    .single()
  if (!badge) return null

  const { error } = await supabase
    .from("user_badges")
    .insert({ user_id: userId, badge_id: badge.id })

  if (error) return null // unique constraint — already earned
  return { name: badge.name, icon: badge.icon }
}

export async function updateStreakAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const today = new Date().toISOString().split("T")[0]
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!streak) {
    await supabase.from("user_streaks").insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
    })
    return
  }

  if (streak.last_active_date === today) return

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  const newStreak = streak.last_active_date === yesterdayStr ? streak.current_streak + 1 : 1
  const longest = Math.max(newStreak, streak.longest_streak)

  await supabase
    .from("user_streaks")
    .update({ current_streak: newStreak, longest_streak: longest, last_active_date: today })
    .eq("user_id", user.id)

  if (newStreak >= 7) await tryAwardBadge(supabase, user.id, BADGE_SLUGS.STREAK_7)
  if (newStreak >= 30) await tryAwardBadge(supabase, user.id, BADGE_SLUGS.STREAK_30)

  revalidatePath("/dashboard")
  revalidatePath("/profile")
}

export async function completeGameAction(
  mode: string,
  correctAnswers: number,
  totalQuestions: number
): Promise<{ xp: number; newBadges: { name: string; icon: string }[] }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { xp: 0, newBadges: [] }

  const isPerfect = correctAnswers === totalQuestions && totalQuestions > 0
  const xp = Math.round((correctAnswers / totalQuestions) * XP_REWARDS.FLASHCARD_SESSION)

  await supabase.from("user_xp_events").insert({
    user_id: user.id,
    xp_amount: xp,
    reason: `${mode.replace(/_/g, " ")} — ${correctAnswers}/${totalQuestions}`,
    source_type: "game",
    source_id: null,
  })

  const newBadges: { name: string; icon: string }[] = []

  const b1 = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.FIRST_GAME)
  if (b1) newBadges.push(b1)

  if (isPerfect) {
    const b2 = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.PERFECT_CHALLENGE)
    if (b2) newBadges.push(b2)
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")
  return { xp, newBadges }
}

export async function awardFirstRecipeSavedBadge() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await tryAwardBadge(supabase, user.id, BADGE_SLUGS.FIRST_RECIPE_SAVED)
  revalidatePath("/profile")
}
