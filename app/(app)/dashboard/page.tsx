import Link from "next/link"
import { ChevronRight, BookOpen, GraduationCap, Clock, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getInProgressPath } from "@/lib/db/learning-paths"
import { getDashboardStats } from "@/lib/db/stats"
import { getSpotlightRecipe } from "@/lib/db/recipes"
import { getProfile } from "@/lib/db/profiles"
import { getUserStreak } from "@/lib/db/games"
import { SPIRIT_LABELS, DIFFICULTY_LABELS } from "@/lib/constants"

function getGreeting() {
  const hour = new Date().getUTCHours()
  if (hour < 5) return "Late night session"
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profile, inProgress, stats, spotlight, streak] = await Promise.all([
    user ? getProfile(user.id) : null,
    user ? getInProgressPath(user.id) : null,
    user ? getDashboardStats(user.id) : null,
    getSpotlightRecipe(),
    user ? getUserStreak(user.id) : null,
  ])

  const firstName = profile?.display_name?.split(" ")[0] ?? "there"

  return (
    <div className="space-y-8">

      {/* Hero greeting */}
      <div className="pt-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
          {streak && streak.current_streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/8 px-2.5 py-1 shrink-0">
              <Flame className="size-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-orange-500">{streak.current_streak} day streak</span>
            </div>
          )}
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight mt-1">
          {firstName} <span className="text-primary">·</span>
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {inProgress
            ? `You're ${inProgress.progress}% through ${inProgress.path.title}.`
            : "Pick a path and start building your craft."}
        </p>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-display text-3xl font-bold text-primary leading-none">{stats.totalXp}</p>
            <p className="text-xs text-muted-foreground mt-1.5">XP earned</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-display text-3xl font-bold leading-none">{stats.lessonsCompleted}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Lessons done</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-display text-3xl font-bold leading-none">{stats.pathsEnrolled}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Paths started</p>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Continue learning — spans 2 cols */}
        {inProgress ? (
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent" />
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Continue learning</p>
                  <h2 className="font-display text-2xl font-bold leading-tight">{inProgress.path.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {inProgress.completedCount} of {inProgress.totalLessons} lessons complete
                  </p>
                </div>
                <Link href="/paths" className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5">
                  All paths
                </Link>
              </div>

              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${inProgress.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right font-medium">{inProgress.progress}%</p>
              </div>

              {inProgress.nextLesson && (
                <Link
                  href={`/paths/${inProgress.path.slug}/${inProgress.nextLesson.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                >
                  <div className="size-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs opacity-75 mb-0.5">Next lesson</p>
                    <p className="text-sm font-semibold truncate">{inProgress.nextLesson.title}</p>
                  </div>
                  <ChevronRight className="size-5 opacity-60 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <Link
            href="/paths"
            className="lg:col-span-2 rounded-xl border border-dashed border-border bg-card hover:border-primary/50 hover:bg-primary/3 transition-all p-10 flex flex-col items-center justify-center gap-5 text-center group"
          >
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <GraduationCap className="size-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-xl font-bold">Start your journey</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Pick a structured learning path and go from beginner to professional bartender.
              </p>
            </div>
            <span className="text-sm font-semibold text-primary group-hover:underline underline-offset-2">
              Browse paths →
            </span>
          </Link>
        )}

        {/* Recipe spotlight */}
        {spotlight ? (
          <Link
            href={`/recipes/${spotlight.slug}`}
            className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors group flex flex-row lg:flex-col"
          >
            {/* Image — small square on mobile, wide on desktop */}
            <div className="w-28 shrink-0 lg:w-full lg:aspect-video overflow-hidden bg-muted/50 self-stretch lg:self-auto">
              {spotlight.image_url ? (
                <img
                  src={spotlight.image_url}
                  alt={spotlight.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl">🍹</span>
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col gap-2 min-w-0 flex-1">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">Recipe of the day</p>
              <h3 className="font-display font-bold text-base lg:text-lg leading-tight">{spotlight.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto flex-wrap">
                <span className="capitalize">{SPIRIT_LABELS[spotlight.spirit_category] ?? spotlight.spirit_category}</span>
                <span>·</span>
                <span>{DIFFICULTY_LABELS[spotlight.difficulty] ?? spotlight.difficulty}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />{spotlight.prep_time_mins} min
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <Link
            href="/recipes"
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-3 text-center"
          >
            <span className="text-4xl">🍹</span>
            <div>
              <p className="font-semibold text-sm">Recipe Library</p>
              <p className="text-xs text-muted-foreground mt-0.5">Browse 400+ cocktails</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
