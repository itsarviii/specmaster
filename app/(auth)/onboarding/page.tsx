import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingFlow } from "@/components/auth/onboarding-flow"
import { AppLogo } from "@/components/app-logo"

export const metadata: Metadata = { title: "Get Started" }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/sign-in")

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_done")
    .eq("id", user.id)
    .single()

  if (profile?.onboarding_done) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center px-6 h-16 border-b border-border shrink-0">
        <AppLogo size="sm" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <OnboardingFlow />
      </main>
    </div>
  )
}
