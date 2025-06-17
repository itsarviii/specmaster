import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { SidebarProfile, SidebarProfileSkeleton } from "@/components/layout/sidebar-profile"
import { MobileNav } from "@/components/layout/mobile-nav"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        profileSlot={
          <Suspense fallback={<SidebarProfileSkeleton />}>
            <SidebarProfile />
          </Suspense>
        }
      />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
