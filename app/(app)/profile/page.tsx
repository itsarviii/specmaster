import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/db/profiles"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarUpload } from "@/components/auth/avatar-upload"
import { EXPERIENCE_LABELS, ROLE_LABELS } from "@/lib/constants"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const profile = await getProfile(user.id)

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "?"

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Your account and progress at a glance." />

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <AvatarUpload
            currentUrl={profile?.avatar_url ?? null}
            initials={initials}
          />

          <div className="text-center sm:text-left min-w-0">
            <h2 className="font-display text-xl font-semibold truncate">
              {profile?.display_name ?? "Your Name"}
            </h2>
            {profile?.username && (
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
              {profile?.experience_level && (
                <Badge variant="secondary" className="text-xs">
                  {EXPERIENCE_LABELS[profile.experience_level]}
                </Badge>
              )}
              {profile?.role && (
                <Badge variant="outline" className="text-xs">
                  {ROLE_LABELS[profile.role]}
                </Badge>
              )}
            </div>
            {profile?.bio && (
              <p className="text-sm text-muted-foreground mt-3 max-w-sm">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Recipes saved", value: "0" },
          { label: "Lessons done", value: "0" },
          { label: "XP earned", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-primary">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
