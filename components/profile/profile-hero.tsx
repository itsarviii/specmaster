"use client"

import { useState, useTransition } from "react"
import { Pencil, X, Check, Zap } from "lucide-react"
import { toast } from "sonner"
import { AvatarPicker } from "@/components/profile/avatar-picker"
import { updateProfileAction } from "@/lib/actions/profiles"
import { EXPERIENCE_LABELS, ROLE_LABELS } from "@/lib/constants"
import type { Profile } from "@/lib/types"

interface ProfileHeroProps {
  profile: Profile | null
  levelTitle: string
  totalXp: number
  levelProgress: number
  xpToNext: number
  nextTitle: string | null
  isMaxLevel: boolean
}

export function ProfileHero({
  profile,
  levelTitle,
  totalXp,
  levelProgress,
  xpToNext,
  nextTitle,
  isMaxLevel,
}: ProfileHeroProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.display_name ?? "")
  const [bio, setBio] = useState(profile?.bio ?? "")
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (!name.trim()) return
    startTransition(async () => {
      const result = await updateProfileAction({ display_name: name.trim(), bio })
      if (result?.error) {
        toast.error("Failed to save")
      } else {
        toast.success("Profile updated")
        setEditing(false)
      }
    })
  }

  function handleCancel() {
    setName(profile?.display_name ?? "")
    setBio(profile?.bio ?? "")
    setEditing(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Banner */}
      <div className="h-24 bg-linear-to-br from-primary/25 via-primary/8 to-muted/20 relative rounded-t-xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/10 to-transparent" />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-12 mb-5">
          <AvatarPicker
            avatarUrl={profile?.avatar_url ?? null}
            sizeClassName="size-24"
          />
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              <Zap className="size-3" />
              {levelTitle}
            </span>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="size-8 rounded-full border border-border bg-card hover:border-primary/40 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Edit profile"
              >
                <Pencil className="size-3.5 text-muted-foreground" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSave}
                  disabled={isPending || !name.trim()}
                  className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Save"
                >
                  <Check className="size-3.5" />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="size-8 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="Cancel"
                >
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Name + meta */}
        <div className="space-y-3">
          {editing ? (
            <div className="space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent border-b border-primary/40 pb-1 font-display text-2xl font-bold outline-none focus:border-primary transition-colors"
                autoFocus
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio…"
                rows={2}
                className="w-full bg-transparent border-b border-border pb-1 text-sm text-muted-foreground outline-none focus:border-primary/40 transition-colors resize-none"
              />
            </div>
          ) : (
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">
                {profile?.display_name ?? "Your Name"}
              </h1>
              {profile?.username && (
                <p className="text-sm text-muted-foreground mt-0.5">@{profile.username}</p>
              )}
              {profile?.bio && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
            {profile?.role && <span>{ROLE_LABELS[profile.role]}</span>}
            {profile?.role && profile?.experience_level && <span>·</span>}
            {profile?.experience_level && <span>{EXPERIENCE_LABELS[profile.experience_level]}</span>}
            {(profile?.role || profile?.experience_level) && <span>·</span>}
            <span>{totalXp} XP total</span>
          </div>

          {!isMaxLevel && (
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {xpToNext} XP until <span className="text-foreground font-medium">{nextTitle}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
