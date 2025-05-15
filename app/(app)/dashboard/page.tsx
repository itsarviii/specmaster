import Link from "next/link"
import { ChevronRight, BookOpen, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getInProgressPath } from "@/lib/db/learning-paths"
import { PageHeader } from "@/components/layout/page-header"
import { getProfile } from "@/lib/db/profiles"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profile, inProgress] = await Promise.all([
    user ? getProfile(user.id) : null,
    user ? getInProgressPath(user.id) : null,
  ])

  const greeting = profile?.display_name
    ? `Welcome back, ${profile.display_name.split(" ")[0]}.`
    : "Welcome back."

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description={greeting} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {inProgress ? (
          <div className="sm:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Continue learning</p>
              <Link href="/paths" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                All paths
              </Link>
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-semibold text-lg">{inProgress.path.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{inProgress.completedCount} of {inProgress.totalLessons} lessons</span>
                <span>{inProgress.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${inProgress.progress}%` }}
                />
              </div>
            </div>

            {inProgress.nextLesson && (
              <Link
                href={`/paths/${inProgress.path.slug}/${inProgress.nextLesson.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div className="size-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <BookOpen className="size-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Next up</p>
                  <p className="text-sm font-medium truncate">{inProgress.nextLesson.title}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              </Link>
            )}
          </div>
        ) : (
          <Link
            href="/paths"
            className="sm:col-span-2 rounded-xl border border-dashed border-border bg-card hover:border-primary/40 transition-colors p-5 flex flex-col items-center justify-center gap-3 text-center min-h-32"
          >
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Start a learning path</p>
              <p className="text-xs text-muted-foreground mt-0.5">Browse structured courses and track your progress</p>
            </div>
          </Link>
        )}

        <Link
          href="/recipes"
          className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors flex flex-col gap-3"
        >
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Recipe Library</p>
            <p className="text-xs text-muted-foreground mt-0.5">Browse 400+ cocktail recipes</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground mt-auto" />
        </Link>
      </div>
    </div>
  )
}
