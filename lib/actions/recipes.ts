"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveRecipeAction(recipeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("user_saved_recipes")
    .insert({ user_id: user.id, recipe_id: recipeId })

  if (error) return { error: error.message }
  revalidatePath("/recipes")
  return { success: true }
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
