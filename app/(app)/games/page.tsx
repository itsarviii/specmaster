import { createClient } from "@/lib/supabase/server"
import { GameHub } from "@/components/games/game-hub"
import { PageHeader } from "@/components/layout/page-header"

export default async function GamesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let savedCount = 0
  if (user) {
    const { count } = await supabase
      .from("user_saved_recipes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
    savedCount = count ?? 0
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <PageHeader
        title="Games"
        description="Pick a game, play a round, see how much you know."
      />
      <GameHub savedCount={savedCount} />
    </div>
  )
}
