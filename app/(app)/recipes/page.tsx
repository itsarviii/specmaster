import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getRecipes, getSavedRecipeIds } from "@/lib/db/recipes"
import { PageHeader } from "@/components/layout/page-header"
import { RecipeGrid } from "@/components/recipes/recipe-grid"
import { RecipeSearch } from "@/components/recipes/recipe-search"
import { RecipeFilters } from "@/components/recipes/recipe-filters"
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
        <div className="mt-4">
          <RecipeFilters
            initialSpirit={params.spirit}
            initialDifficulty={params.difficulty}
            initialMethod={params.method}
          />
        </div>
      </Suspense>

      <RecipeGrid recipes={recipes} savedIds={savedIds} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 ? (
            <Link
              href={`/recipes?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:border-primary/40 transition-colors"
            >
              <ChevronLeft className="size-4" /> Prev
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-muted-foreground opacity-50 cursor-not-allowed">
              <ChevronLeft className="size-4" /> Prev
            </span>
          )}
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/recipes?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:border-primary/40 transition-colors"
            >
              Next <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-muted-foreground opacity-50 cursor-not-allowed">
              Next <ChevronRight className="size-4" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
