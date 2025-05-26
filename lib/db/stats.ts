import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats(userId: string) {
  const supabase = await createClient()

  const [xpResult, lessonsResult, enrollmentsResult, savedResult] = await Promise.all([
    supabase.from("user_xp_events").select("xp_amount").eq("user_id", userId),
    supabase.from("user_lesson_completions").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("user_path_enrollments").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("user_saved_recipes").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ])

  const totalXp = (xpResult.data ?? []).reduce((sum: number, e: { xp_amount: number }) => sum + (e.xp_amount ?? 0), 0)
  const lessonsCompleted = lessonsResult.count ?? 0
  const pathsEnrolled = enrollmentsResult.count ?? 0
  const savedRecipes = savedResult.count ?? 0

  return { totalXp, lessonsCompleted, pathsEnrolled, savedRecipes }
}
