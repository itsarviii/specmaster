import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getRecipes, getSavedRecipeIds } from "@/lib/db/recipes"
import { PageHeader } from "@/components/layout/page-header"
import { RecipeGrid } from "@/components/recipes/recipe-grid"
import { RecipeSearch } from "@/components/recipes/recipe-search"
import { RECIPES_PER_PAGE } from "@/lib/constants"

interface SearchParams {
  q?: string
  spirit?: string
  difficulty?: string
  method?: string
  page?: string
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ recipes, total }, savedIds] = await Promise.all([
    getRecipes({ ...params, page }),
    user ? getSavedRecipeIds(user.id) : Promise.resolve([]),
  ])

  const totalPages = Math.ceil(total / RECIPES_PER_PAGE)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recipes"
        description={`${total} cocktails in the library.`}
      />

      <Suspense>
        <RecipeSearch initialValue={params.q ?? ""} />
      </Suspense>

      <RecipeGrid recipes={recipes} savedIds={savedIds} />

      {totalPages > 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
      )}
    </div>
  )
}
