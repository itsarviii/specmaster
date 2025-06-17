"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { GlassWater, Wine, Trophy, Home, Users, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeOnboardingAction } from "@/lib/actions/profiles"
import type { ExperienceLevel, UserRole } from "@/lib/types"

const experienceOptions: { value: ExperienceLevel; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    value: "beginner",
    label: "Just starting out",
    description: "I'm new to bartending and want to learn from scratch.",
    icon: GlassWater,
  },
  {
    value: "intermediate",
    label: "Getting comfortable",
    description: "I know the classics but want to sharpen my skills.",
    icon: Wine,
  },
  {
    value: "advanced",
    label: "Seasoned shaker",
    description: "I've been behind the bar and want to master the craft.",
    icon: Trophy,
  },
]

const roleOptions: { value: UserRole; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    value: "home_bartender",
    label: "Home bartender",
    description: "Mixing drinks for friends, family, and myself.",
    icon: Home,
  },
  {
    value: "bar_staff",
    label: "Bar staff",
    description: "Working or training to work in a bar or restaurant.",
    icon: Users,
  },
  {
    value: "professional",
    label: "Professional",
    description: "A working bartender looking to level up.",
    icon: Star,
  },
]

export function OnboardingFlow() {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState("")
  const [experience, setExperience] = useState<ExperienceLevel | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleNext() {
    if (step === 1 && name.trim() && experience) setStep(2)
  }

  function handleSubmit() {
    if (!experience || !role || !name.trim()) return
    startTransition(async () => {
      const result = await completeOnboardingAction(experience, role, name.trim())
      if (!result?.error) router.push("/dashboard")
    })
  }

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={cn("h-1.5 w-16 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-border")} />
        <div className={cn("h-1.5 w-16 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-border")} />
      </div>

      {step === 1 && (
        <div className="animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-semibold mb-2">Welcome to SpecMaster</h1>
            <p className="text-sm text-muted-foreground">Let&apos;s set up your profile before you start.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">What should we call you?</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>What&apos;s your experience level?</Label>
              <div className="space-y-3">
            {experienceOptions.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setExperience(value)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                  experience === value
                    ? "border-primary bg-primary/10 glow-amber"
                    : "border-border bg-card hover:border-primary/40 hover:bg-card"
                )}
              >
                <div className={cn(
                  "size-10 rounded-lg flex items-center justify-center shrink-0",
                  experience === value ? "bg-primary/20" : "bg-muted"
                )}>
                  <Icon className={cn("size-5", experience === value ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </button>
            ))}
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            onClick={handleNext}
            disabled={!experience || !name.trim()}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-semibold mb-2">What describes you best?</h1>
            <p className="text-sm text-muted-foreground">This helps us surface the most relevant content for you.</p>
          </div>

          <div className="space-y-3">
            {roleOptions.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                  role === value
                    ? "border-primary bg-primary/10 glow-amber"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className={cn(
                  "size-10 rounded-lg flex items-center justify-center shrink-0",
                  role === value ? "bg-primary/20" : "bg-muted"
                )}>
                  <Icon className={cn("size-5", role === value ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={isPending}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!role || isPending}>
              {isPending ? "Saving…" : "Get started"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
