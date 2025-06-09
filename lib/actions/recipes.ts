"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { BADGE_SLUGS } from "@/lib/constants"

type BadgeResult = { name: string; icon: string } | null

async function tryAwardBadge(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  slug: string
): Promise<BadgeResult> {
  const { data: badge } = await supabase.from("badges").select("id, name, icon").eq("slug", slug).single()
  if (!badge) return null
  const { error } = await supabase.from("user_badges").insert({ user_id: userId, badge_id: badge.id })
  if (error) return null
  return { name: badge.name, icon: badge.icon }
}

export async function saveRecipeAction(recipeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("user_saved_recipes")
    .insert({ user_id: user.id, recipe_id: recipeId })

  if (error) return { error: error.message }

  const { count } = await supabase
    .from("user_saved_recipes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const newBadges: { name: string; icon: string }[] = []
  const total = count ?? 0

  if (total === 1) {
    const b = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.FIRST_RECIPE_SAVED)
    if (b) newBadges.push(b)
  }
  if (total === 5) {
    const b = await tryAwardBadge(supabase, user.id, BADGE_SLUGS.COLLECTOR)
    if (b) newBadges.push(b)
  }

  revalidatePath("/recipes")
  return { success: true, newBadges }
}

export async function unsaveRecipeAction(recipeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("user_saved_recipes")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)

  if (error) return { error: error.message }
  revalidatePath("/recipes")
  return { success: true }
}
