import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/db/profiles"
import { getAvatarPreset } from "@/lib/avatar-presets"

export async function SidebarProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const profile = await getProfile(user.id)
  const p = getAvatarPreset(profile?.avatar_url ?? null)

  return (
    <Link
      href="/profile"
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
    >
      <div className={`size-7 shrink-0 rounded-full border flex items-center justify-center text-base ${p.bg} ${p.border}`}>
        {p.emoji}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate leading-none">
          {profile?.display_name ?? "Your profile"}
        </p>
      </div>
    </Link>
  )
}

export function SidebarProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div className="size-7 shrink-0 rounded-full bg-muted animate-pulse" />
      <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
    </div>
  )
}
