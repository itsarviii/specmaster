import { createClient } from "@/lib/supabase/server"
import { SPIRIT_LABELS, METHOD_LABELS } from "@/lib/constants"
import type { GameMode } from "@/lib/types"

export type GamePrompt =
  | { type: "flashcard"; name: string; imageUrl: string | null }
  | { type: "ingredient_challenge"; ingredients: string[] }
  | { type: "name_that_cocktail"; spirit: string; method: string; glassware: string | null }

export type GameQuestion = {
  recipeId: string
  correctAnswer: string
  options: string[]
  prompt: GamePrompt
}

type RecipeRow = {
  id: string
  name: string
  image_url: string | null
  spirit_category: string
  method: string
  glassware: string | null
  ingredients?: { name: string; amount: string | null; is_optional: boolean; sort_order: number }[]
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function pickWrong<T>(pool: T[], correct: T, count: number): T[] {
  return shuffle(pool.filter((v) => v !== correct)).slice(0, count)
}

function buildQuestion(mode: GameMode, recipe: RecipeRow, pool: RecipeRow[]): GameQuestion {
  if (mode === "flashcard") {
    const correct = SPIRIT_LABELS[recipe.spirit_category] ?? recipe.spirit_category
    const allSpirits = [...new Set(pool.map((r) => SPIRIT_LABELS[r.spirit_category] ?? r.spirit_category))]
    const wrong = pickWrong(allSpirits, correct, 3)
    return {
      recipeId: recipe.id,
      correctAnswer: correct,
      options: shuffle([correct, ...wrong]),
      prompt: { type: "flashcard", name: recipe.name, imageUrl: recipe.image_url },
    }
  }

  if (mode === "ingredient_challenge") {
    const allNames = pool.map((r) => r.name)
    const wrong = pickWrong(allNames, recipe.name, 3)
    const ingredients = (recipe.ingredients ?? [])
      .filter((i) => !i.is_optional)
      .sort((a, b) => a.sort_order - b.sort_order)
      .slice(0, 4)
      .map((i) => (i.amount ? `${i.amount} ${i.name}` : i.name))
    return {
      recipeId: recipe.id,
      correctAnswer: recipe.name,
      options: shuffle([recipe.name, ...wrong]),
      prompt: { type: "ingredient_challenge", ingredients },
    }
  }

  // name_that_cocktail
  const allNames = pool.map((r) => r.name)
  const wrong = pickWrong(allNames, recipe.name, 3)
  return {
    recipeId: recipe.id,
    correctAnswer: recipe.name,
    options: shuffle([recipe.name, ...wrong]),
    prompt: {
      type: "name_that_cocktail",
      spirit: SPIRIT_LABELS[recipe.spirit_category] ?? recipe.spirit_category,
      method: METHOD_LABELS[recipe.method] ?? recipe.method,
      glassware: recipe.glassware,
    },
  }
}

export async function getGameQuestions(
  mode: GameMode,
  scope: "random" | "saved",
  userId: string
): Promise<GameQuestion[]> {
  const supabase = await createClient()
  const needsIngredients = mode === "ingredient_challenge"
  const select = needsIngredients
    ? "id,name,image_url,spirit_category,method,glassware,ingredients(name,amount,is_optional,sort_order)"
    : "id,name,image_url,spirit_category,method,glassware"

  let pool: RecipeRow[] = []

  if (scope === "saved") {
    const { data: saved } = await supabase
      .from("user_saved_recipes")
      .select("recipe_id")
      .eq("user_id", userId)
    const ids = (saved ?? []).map((r: { recipe_id: string }) => r.recipe_id)

    if (ids.length >= 4) {
      const { data } = await supabase.from("recipes").select(select).in("id", ids).eq("is_published", true)
      pool = (data ?? []) as RecipeRow[]
    }
  }

  if (pool.length < 4) {
    const { data } = await supabase.from("recipes").select(select).eq("is_published", true).limit(80)
    pool = (data ?? []) as RecipeRow[]
  }

  if (pool.length < 4) return []

  return shuffle(pool).slice(0, 10).map((r) => buildQuestion(mode, r, pool))
}

export async function getUserBadges(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("user_badges")
    .select("earned_at, badges(id, slug, name, description, icon)")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false })
  return data ?? []
}

export async function getUserStreak(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak, last_active_date")
    .eq("user_id", userId)
    .single()
  return data as { current_streak: number; longest_streak: number; last_active_date: string | null } | null
}
