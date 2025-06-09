type Badge = {
  id: string
  slug: string
  name: string
  description: string
  icon: string
}

interface BadgeShelfProps {
  allBadges: Badge[]
  earnedSlugs: string[]
}

export function BadgeShelf({ allBadges, earnedSlugs }: BadgeShelfProps) {
  const earned = new Set(earnedSlugs)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {allBadges.map((badge) => {
        const isEarned = earned.has(badge.slug)
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center ${
              isEarned
                ? "border-border bg-card"
                : "border-border/30 bg-card/30"
            }`}
          >
            <span className={`text-xl ${!isEarned && "grayscale opacity-30"}`}>
              {badge.icon}
            </span>
            <p className={`text-xs font-semibold leading-tight ${isEarned ? "text-foreground" : "text-muted-foreground/50"}`}>
              {badge.name}
            </p>
            <p className={`text-xs leading-snug ${isEarned ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
              {badge.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
