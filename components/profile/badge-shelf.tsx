"use client"

type Badge = {
  id: string
  slug: string
  name: string
  description: string
  icon: string
}

type UserBadge = {
  earned_at: string
  badges: Badge | null
}

export function BadgeShelf({ userBadges }: { userBadges: UserBadge[] }) {
  const earned = userBadges.filter((ub) => ub.badges !== null)

  if (earned.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center space-y-1">
        <p className="text-sm font-semibold text-muted-foreground">No badges yet</p>
        <p className="text-xs text-muted-foreground">Complete lessons, play games, and build streaks to earn badges.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {earned.map((ub) => {
        const badge = ub.badges!
        return (
          <div
            key={badge.id}
            title={badge.description}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center hover:border-primary/40 transition-colors"
          >
            <span className="text-2xl">{badge.icon}</span>
            <p className="text-xs font-semibold leading-tight line-clamp-2">{badge.name}</p>
          </div>
        )
      })}
    </div>
  )
}
