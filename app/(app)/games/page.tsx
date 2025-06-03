import { GameHub } from "@/components/games/game-hub"
import { PageHeader } from "@/components/layout/page-header"

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Games"
        description="Pick a game, play a round, see how much you know."
      />
      <GameHub />
    </div>
  )
}
