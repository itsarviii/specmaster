import { createClient } from "@/lib/supabase/server"
import { getLearningPaths, getUserEnrollments, getUserLessonCompletions } from "@/lib/db/learning-paths"
import { PageHeader } from "@/components/layout/page-header"
import { PathCard } from "@/components/learn/path-card"

export default async function PathsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [paths, enrollments, completedLessonIds] = await Promise.all([
    getLearningPaths(),
    user ? getUserEnrollments(user.id) : Promise.resolve([]),
    user ? getUserLessonCompletions(user.id) : Promise.resolve([]),
  ])

  const enrolledPathIds = new Set(enrollments.map((e) => e.path_id))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Learning Paths"
        description="Structured courses to take you from beginner to professional."
      />

      {enrollments.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">In progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paths
              .filter((p) => enrolledPathIds.has(p.id))
              .map((path) => {
                const enrollment = enrollments.find((e) => e.path_id === path.id)
                return (
                  <PathCard
                    key={path.id}
                    path={path}
                    enrolled
                    progress={enrollment?.completed_at ? 100 : undefined}
                  />
                )
              })}
          </div>
        </section>
      )}

      <section className="space-y-4">
        {enrollments.length > 0 && (
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">All paths</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paths.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              enrolled={enrolledPathIds.has(path.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
