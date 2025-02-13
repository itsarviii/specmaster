import { GlassWater } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-2.5 px-6 h-16 border-b border-border shrink-0">
        <GlassWater className="size-5 text-primary" />
        <span className="font-display text-base font-semibold text-foreground">SpecMaster</span>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
