import { createClient } from "@/lib/supabase/server"
import { getRecipes } from "@/lib/db/recipes"
import { PageHeader } from "@/components/layout/page-header"
import { RecipeGrid } from "@/components/recipes/recipe-grid"
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

  const [{ recipes, total }, supabase] = await Promise.all([
    getRecipes({ ...params, page }),
    createClient(),
  ])

  const { data: { user } } = await supabase.auth.getUser()
  const savedIds: string[] = []

  const totalPages = Math.ceil(total / RECIPES_PER_PAGE)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recipes"
        description={`${total} cocktails in the library.`}
      />
      <RecipeGrid recipes={recipes} savedIds={savedIds} />
    </div>
  )
}
