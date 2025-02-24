"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, GraduationCap, Gamepad2, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Recipes", href: "/recipes", icon: BookOpen },
  { label: "Learn", href: "/paths", icon: GraduationCap },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Profile", href: "/profile", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-0",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-[10px] font-medium leading-none truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
