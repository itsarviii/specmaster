import type { Recipe } from "@/lib/types"

interface RecipeGridProps {
  recipes: Recipe[]
  savedIds: string[]
}

export function RecipeGrid({ recipes, savedIds }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">No recipes found.</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="rounded-xl border border-border bg-card overflow-hidden">
          <p className="p-4 text-sm font-medium">{recipe.name}</p>
        </div>
      ))}
    </div>
  )
}
