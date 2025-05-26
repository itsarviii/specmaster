import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/db/profiles"
import { getDashboardStats } from "@/lib/db/stats"
import { ProfileHero } from "@/components/profile/profile-hero"
import { LEVEL_TITLES } from "@/lib/constants"
import { BookMarked, GraduationCap, Zap, BookOpen } from "lucide-react"

const XP_PER_LEVEL = 200

function getLevelInfo(totalXp: number) {
  const levelIndex = Math.min(Math.floor(totalXp / XP_PER_LEVEL), LEVEL_TITLES.length - 1)
  const isMaxLevel = levelIndex === LEVEL_TITLES.length - 1
  const xpIntoLevel = totalXp % XP_PER_LEVEL
  const progress = isMaxLevel ? 100 : Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)
  const xpToNext = isMaxLevel ? 0 : XP_PER_LEVEL - xpIntoLevel
  const nextTitle = isMaxLevel ? null : LEVEL_TITLES[levelIndex + 1]
  return { title: LEVEL_TITLES[levelIndex], progress, xpToNext, nextTitle, isMaxLevel }
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const [profile, stats] = await Promise.all([
    getProfile(user.id),
    getDashboardStats(user.id),
  ])

  const level = getLevelInfo(stats.totalXp)

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      <ProfileHero
        profile={profile}
        levelTitle={level.title}
        totalXp={stats.totalXp}
        levelProgress={level.progress}
        xpToNext={level.xpToNext}
        nextTitle={level.nextTitle}
        isMaxLevel={level.isMaxLevel}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="size-4 text-primary" />
          </div>
          <p className="font-display text-2xl font-bold text-primary leading-none">{stats.totalXp}</p>
          <p className="text-xs text-muted-foreground">XP earned</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
            <BookOpen className="size-4 text-muted-foreground" />
          </div>
          <p className="font-display text-2xl font-bold leading-none">{stats.lessonsCompleted}</p>
          <p className="text-xs text-muted-foreground">Lessons done</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
            <GraduationCap className="size-4 text-muted-foreground" />
          </div>
          <p className="font-display text-2xl font-bold leading-none">{stats.pathsEnrolled}</p>
          <p className="text-xs text-muted-foreground">Paths started</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
            <BookMarked className="size-4 text-muted-foreground" />
          </div>
          <p className="font-display text-2xl font-bold leading-none">{stats.savedRecipes}</p>
          <p className="text-xs text-muted-foreground">Recipes saved</p>
        </div>
      </div>

    </div>
  )
}
