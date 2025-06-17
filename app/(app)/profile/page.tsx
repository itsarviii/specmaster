import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/db/profiles"
import { getDashboardStats } from "@/lib/db/stats"
import { getAllBadges, getUserBadges, getUserStreak } from "@/lib/db/games"
import { ProfileHero } from "@/components/profile/profile-hero"
import { BadgeShelf } from "@/components/profile/badge-shelf"
import { DeleteAccountButton } from "@/components/profile/delete-account-button"
import { SignOutButton } from "@/components/profile/sign-out-button"
import { LEVEL_TITLES } from "@/lib/constants"
import { BookMarked, GraduationCap, Zap, BookOpen, Flame } from "lucide-react"

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

  const [profile, stats, allBadges, userBadges, streak] = await Promise.all([
    getProfile(user.id),
    getDashboardStats(user.id),
    getAllBadges(),
    getUserBadges(user.id),
    getUserStreak(user.id),
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

      {/* Streak */}
      {streak && streak.current_streak > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Flame className="size-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{streak.current_streak}-day streak</p>
            <p className="text-xs text-muted-foreground">Longest: {streak.longest_streak} days</p>
          </div>
          <p className="font-display text-3xl font-bold text-orange-500 shrink-0">{streak.current_streak}</p>
        </div>
      )}

      {/* Badges */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Badges · {userBadges.length} / {allBadges.length} earned
        </p>
        <BadgeShelf allBadges={allBadges} earnedSlugs={userBadges} />
      </div>

      {/* Danger zone */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div className="lg:hidden">
          <SignOutButton />
        </div>
        <div className="lg:ml-auto">
          <DeleteAccountButton />
        </div>
      </div>

    </div>
  )
}
