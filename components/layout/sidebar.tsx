"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Gamepad2,
  User,
  GlassWater,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getAvatarPreset } from "@/lib/avatar-presets"
import type { Profile } from "@/lib/types"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Recipes", href: "/recipes", icon: BookOpen },
  { label: "Learn", href: "/paths", icon: GraduationCap },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Profile", href: "/profile", icon: User },
]

interface SidebarProps {
  profile: Profile | null
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Signed out")
    router.push("/sign-in")
  }



  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 border-r border-border bg-card z-40">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-border shrink-0">
        <GlassWater className="size-6 text-primary" />
        <span className="font-display text-lg font-semibold tracking-wide text-foreground">
          SpecMaster
        </span>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border shrink-0 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
        >
          {(() => {
            const p = getAvatarPreset(profile?.avatar_url ?? null)
            return (
              <div className={`size-7 shrink-0 rounded-full border flex items-center justify-center text-base ${p.bg} ${p.border}`}>
                {p.emoji}
              </div>
            )
          })()}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate leading-none">
              {profile?.display_name ?? "Your profile"}
            </p>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
