"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ExperienceLevel, UserRole } from "@/lib/types"

export async function completeOnboardingAction(experience_level: ExperienceLevel, role: UserRole) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("profiles")
    .update({ experience_level, role, onboarding_done: true, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function updateProfileAction(updates: { display_name?: string; bio?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/profile")
  revalidatePath("/settings")
  return { success: true }
}

export async function uploadAvatarAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const file = formData.get("avatar") as File
  if (!file || file.size === 0) return { error: "No file provided" }

  const ext = file.name.split(".").pop()
  const path = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path)

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath("/profile")
  return { success: true, url: publicUrl }
}

export async function changePasswordAction(newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }
  return { success: true }
}
