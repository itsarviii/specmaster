import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Clock, GlassWater } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getRecipeBySlug, getSimilarRecipes, getSavedRecipeIds } from "@/lib/db/recipes"
import { RecipeCard } from "@/components/recipes/recipe-card"
import { SaveButton } from "@/components/recipes/save-button"
import { SPIRIT_LABELS, DIFFICULTY_LABELS, METHOD_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

const SPIRIT_COLORS: Record<string, string> = {
  whiskey: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  gin: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  rum: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  vodka: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  tequila: "bg-lime-500/15 text-lime-400 border-lime-500/20",
  brandy: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  wine: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  beer: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
}

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
    <div className="max-w-2xl mx-auto space-y-7 pb-8">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" /> All recipes
      </Link>

      {recipe.image_url && (
        <div className="relative aspect-4/3 sm:aspect-video rounded-2xl overflow-hidden bg-muted">
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

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5 flex-1 min-w-0">
          <h1 className="font-display text-3xl font-bold leading-tight">{recipe.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              SPIRIT_COLORS[recipe.spirit_category] ?? SPIRIT_COLORS.other
            )}>
              {SPIRIT_LABELS[recipe.spirit_category] ?? recipe.spirit_category}
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-card border-border text-muted-foreground">
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-card border-border text-muted-foreground">
              {METHOD_LABELS[recipe.method] ?? recipe.method}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" /> {recipe.prep_time_mins} min
            </span>
            {recipe.glassware && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GlassWater className="size-3" /> {recipe.glassware}
              </span>
            )}
          </div>
        </div>
        <SaveButton recipeId={recipe.id} initialSaved={savedIds.includes(recipe.id)} className="size-10 shrink-0" />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-card">
          <h2 className="font-display font-semibold text-base">Ingredients</h2>
        </div>
        {recipe.ingredients.map((ing: { id: string; amount?: string; name: string; is_optional: boolean }) => (
          <div
            key={ing.id}
            className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-0 bg-card/50"
          >
            <span className="text-primary font-medium text-sm w-20 shrink-0">{ing.amount ?? ""}</span>
            <span className={cn("text-sm", ing.is_optional && "text-muted-foreground")}>
              {ing.name}
              {ing.is_optional && <span className="text-xs ml-1">(optional)</span>}
            </span>
          </div>
        ))}
        {recipe.garnish && (
          <div className="px-5 py-3 bg-card/50 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Garnish: </span>{recipe.garnish}
          </div>
        )}
      </div>

      {recipe.steps.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Method</h2>
          <ol className="space-y-5">
            {recipe.steps.map((step: { id: string; step_number: number; instruction: string; tip?: string }) => (
              <li key={step.id} className="flex gap-4">
                <span className="size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step.step_number}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm leading-relaxed">{step.instruction}</p>
                  {step.tip && (
                    <p className="text-xs text-primary mt-1.5">Tip: {step.tip}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {similar.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold">You might also like</h2>
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {similar.map((r) => (
              <Link
                key={r.id}
                href={`/recipes/${r.slug}`}
                className="flex items-center gap-4 p-3 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="relative size-14 rounded-lg overflow-hidden shrink-0 bg-muted">
                  {r.image_url && (
                    <Image src={r.image_url} alt={r.name} fill className="object-cover" sizes="56px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-snug truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {SPIRIT_LABELS[r.spirit_category] ?? r.spirit_category} · {DIFFICULTY_LABELS[r.difficulty]} · {r.prep_time_mins} min
                  </p>
                </div>
                <ChevronLeft className="size-4 text-muted-foreground rotate-180 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
