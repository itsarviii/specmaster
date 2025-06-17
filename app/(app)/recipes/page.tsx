import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = { title: "Recipes" }
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getRecipes, getSavedRecipes, getSavedRecipeIds } from "@/lib/db/recipes"
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
  saved?: string
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const showSaved = params.saved === "1"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let recipes, total, savedIds: string[]

  if (showSaved && user) {
    const saved = await getSavedRecipes(user.id)
    recipes = saved
    total = saved.length
    savedIds = saved.map((r) => r.id)
  } else {
    const [result, ids] = await Promise.all([
      getRecipes({ ...params, page }),
      user ? getSavedRecipeIds(user.id) : Promise.resolve([]),
    ])
    recipes = result.recipes
    total = result.total
    savedIds = ids
  }

  const totalPages = Math.ceil(total / RECIPES_PER_PAGE)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recipes"
        description={showSaved ? `${total} saved recipe${total === 1 ? "" : "s"}` : `${total} cocktails in the library.`}
      >
        {user && (
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Link
              href="/recipes"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!showSaved ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </Link>
            <Link
              href="/recipes?saved=1"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${showSaved ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Saved
            </Link>
          </div>
        )}
      </PageHeader>

      {!showSaved && (
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
      )}

      {showSaved && recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">No saved recipes yet</p>
          <p className="text-xs text-muted-foreground">Tap the bookmark icon on any recipe to save it here.</p>
          <Link href="/recipes" className="inline-block mt-2 text-xs text-primary hover:underline underline-offset-2">
            Browse all recipes →
          </Link>
        </div>
      ) : (
        <RecipeGrid recipes={recipes} savedIds={savedIds} />
      )}

      {!showSaved && totalPages > 1 && (
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
