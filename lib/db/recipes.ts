import { createClient } from "@/lib/supabase/server"
import { RECIPES_PER_PAGE } from "@/lib/constants"
import type { Recipe } from "@/lib/types"

export interface RecipeFilters {
  q?: string
  spirit?: string
  difficulty?: string
  method?: string
  page?: number
}

export async function getRecipes(filters: RecipeFilters = {}) {
  const supabase = await createClient()
  const { q, spirit, difficulty, method, page = 1 } = filters
  const offset = (page - 1) * RECIPES_PER_PAGE

  let query = supabase
    .from("recipes")
    .select("id,slug,name,image_url,spirit_category,difficulty,prep_time_mins,glassware,method,flavor_tags,created_at,is_published", { count: "exact" })
    .eq("is_published", true)
    .order("name")
    .range(offset, offset + RECIPES_PER_PAGE - 1)

  if (q) query = query.ilike("name", `%${q}%`)
  if (spirit) query = query.eq("spirit_category", spirit)
  if (difficulty) query = query.eq("difficulty", difficulty)
  if (method) query = query.eq("method", method)

  const { data, count, error } = await query
  if (error) throw error
  return { recipes: (data ?? []) as Recipe[], total: count ?? 0 }
}

export async function getRecipeBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("recipes")
    .select("*, ingredients(id,name,amount,unit,is_optional,sort_order), recipe_steps(id,step_number,instruction,tip)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  if (!data) return null
  return {
    ...data,
    ingredients: (data.ingredients ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    steps: (data.recipe_steps ?? []).sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number),
  }
}

export async function getSimilarRecipes(currentId: string, spirit: string, limit = 4): Promise<Recipe[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("recipes")
    .select("id,slug,name,image_url,spirit_category,difficulty,prep_time_mins,glassware,method,flavor_tags,created_at,is_published")
    .eq("spirit_category", spirit)
    .eq("is_published", true)
    .neq("id", currentId)
    .limit(limit)
  return (data ?? []) as Recipe[]
}

export async function getSavedRecipeIds(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("user_saved_recipes")
    .select("recipe_id")
    .eq("user_id", userId)
  return (data ?? []).map((r: { recipe_id: string }) => r.recipe_id)
}
