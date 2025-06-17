import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getGameQuestions } from "@/lib/db/games"
import { GameSession } from "@/components/games/game-session"
import type { GameMode, GameScope } from "@/lib/types"

const MODE_TITLES: Record<string, string> = {
  flashcard: "Flashcard",
  ingredient_challenge: "Ingredient Challenge",
  name_that_cocktail: "Name That Cocktail",
}

export async function generateMetadata({ params }: { params: Promise<{ mode: string }> }): Promise<Metadata> {
  const { mode } = await params
  return { title: MODE_TITLES[mode] ?? "Games" }
}

const VALID_MODES: GameMode[] = ["flashcard", "ingredient_challenge", "name_that_cocktail"]
const VALID_SCOPES: GameScope[] = ["random", "saved"]

const MODE_LABELS: Record<GameMode, string> = {
  flashcard: "Flashcard",
  ingredient_challenge: "Ingredient Challenge",
  name_that_cocktail: "Name That Cocktail",
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>
  searchParams: Promise<{ scope?: string }>
}) {
  const { mode } = await params
  const { scope = "random" } = await searchParams

  if (!VALID_MODES.includes(mode as GameMode)) notFound()
  const validScope = VALID_SCOPES.includes(scope as GameScope) ? (scope as GameScope) : "random"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const questions = await getGameQuestions(mode as GameMode, validScope, user.id)

  if (questions.length === 0) redirect("/games")

  return (
    <div className="max-w-xl mx-auto">
      <GameSession
        questions={questions}
        mode={mode as GameMode}
        modeLabel={MODE_LABELS[mode as GameMode]}
      />
    </div>
  )
}
