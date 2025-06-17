import { BookOpen, GraduationCap, Gamepad2 } from "lucide-react"
import { AppLogo } from "@/components/app-logo"

const features = [
  { icon: BookOpen, label: "200+ cocktail recipes", desc: "Classics to modern craft cocktails." },
  { icon: GraduationCap, label: "Guided learning paths", desc: "Structured lessons for every level." },
  { icon: Gamepad2, label: "Games & challenges", desc: "Test your knowledge and earn badges." },
]

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">

      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(232,184,75,0.12),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,184,75,0.06),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="relative">
          <AppLogo />
        </div>

        {/* Hero text */}
        <div className="relative space-y-8">
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight text-foreground mb-4">
              Master the craft,<br />
              <span className="text-primary">one pour at a time.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Everything a bartender needs — recipes, technique, and the knowledge to back it up.
            </p>
          </div>

          <div className="space-y-4">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <p className="text-xs text-muted-foreground/60">
            &copy; 2026 SpecMaster · The bartender&apos;s learning companion
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col lg:border-l lg:border-border">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center px-6 h-16 border-b border-border shrink-0">
          <AppLogo size="sm" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {children}
        </div>
      </div>

    </div>
  )
}
