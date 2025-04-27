import { notFound } from "next/navigation"
import Image from "next/image"
import { Clock, GlassWater } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getRecipeBySlug, getSimilarRecipes, getSavedRecipeIds } from "@/lib/db/recipes"
import { PageHeader } from "@/components/layout/page-header"
import { RecipeCard } from "@/components/recipes/recipe-card"
import { SaveButton } from "@/components/recipes/save-button"
import { Badge } from "@/components/ui/badge"
import { SPIRIT_LABELS, DIFFICULTY_LABELS, METHOD_LABELS } from "@/lib/constants"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)
  return { title: recipe?.name ?? "Recipe" }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)
  if (!recipe) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [similar, savedIds] = await Promise.all([
    getSimilarRecipes(recipe.id, recipe.spirit_category),
    user ? getSavedRecipeIds(user.id) : Promise.resolve([]),
  ])

  return (
    <div className="space-y-10 max-w-2xl">
      <div className="space-y-6">
        {recipe.image_url && (
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-semibold">{recipe.name}</h1>
            <SaveButton recipeId={recipe.id} initialSaved={savedIds.includes(recipe.id)} className="size-10 shrink-0" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {SPIRIT_LABELS[recipe.spirit_category] ?? recipe.spirit_category}
            </Badge>
            <Badge variant="outline">{DIFFICULTY_LABELS[recipe.difficulty]}</Badge>
            <Badge variant="outline">{METHOD_LABELS[recipe.method] ?? recipe.method}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-1">
              <Clock className="size-3" />
              {recipe.prep_time_mins} min
            </span>
            {recipe.glassware && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GlassWater className="size-3" />
                {recipe.glassware}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-lg font-semibold">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing: { id: string; amount?: string; name: string; is_optional: boolean }) => (
            <li key={ing.id} className="flex items-baseline gap-3 py-2 border-b border-border last:border-0">
              {ing.amount && (
                <span className="text-primary font-medium text-sm w-20 shrink-0">{ing.amount}</span>
              )}
              <span className={`text-sm ${ing.is_optional ? "text-muted-foreground" : ""}`}>
                {ing.name}
                {ing.is_optional && <span className="text-xs text-muted-foreground ml-1">(optional)</span>}
              </span>
            </li>
          ))}
        </ul>
        {recipe.garnish && (
          <p className="text-sm text-muted-foreground pt-2">
            <span className="text-foreground font-medium">Garnish: </span>{recipe.garnish}
          </p>
        )}
      </div>

      {recipe.steps.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Method</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step: { id: string; step_number: number; instruction: string; tip?: string }) => (
              <li key={step.id} className="flex gap-4">
                <span className="size-6 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {step.step_number}
                </span>
                <div>
                  <p className="text-sm leading-relaxed">{step.instruction}</p>
                  {step.tip && (
                    <p className="text-xs text-primary mt-1">💡 {step.tip}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {similar.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Similar recipes</h2>
          <div className="grid grid-cols-2 gap-3">
            {similar.map((r) => (
              <RecipeCard key={r.id} recipe={r} isSaved={savedIds.includes(r.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
