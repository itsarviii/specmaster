import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/db/profiles"
import { PageHeader } from "@/components/layout/page-header"
import { ProfileForm } from "@/components/auth/profile-form"
import { PasswordForm } from "@/components/auth/password-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const profile = await getProfile(user.id)

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your account details." />

      <div className="max-w-lg space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-base font-semibold mb-5">Profile</h2>
          <ProfileForm
            displayName={profile?.display_name ?? ""}
            bio={profile?.bio ?? ""}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-base font-semibold mb-1">Password</h2>
          <p className="text-xs text-muted-foreground mb-5">
            Leave blank to keep your current password.
          </p>
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}
