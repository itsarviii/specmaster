"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthShell } from "@/components/auth/auth-shell"
import { createClient } from "@/lib/supabase/client"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSend() {
    if (!email || isPending) return
    setError(null)
    setIsPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
      })
      if (error) setError(error.message)
      else setSent(true)
    } finally {
      setIsPending(false)
    }
  }

  if (sent) {
    return (
      <AuthShell>
        <div className="w-full max-w-sm animate-fade-in text-center">
          <span className="text-5xl">📬</span>
          <h1 className="font-display text-2xl font-bold mt-5 mb-2">Check your inbox</h1>
          <p className="text-sm text-muted-foreground mb-6">
            We sent a reset link to{" "}
            <span className="text-foreground font-medium">{email}</span>.
            It expires in 1 hour.
          </p>
          <Link href="/sign-in" className="text-sm text-primary hover:underline font-medium">
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold mb-1.5">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              autoFocus
            />
          </div>

          {error && <p className="text-xs text-destructive text-center">{error}</p>}

          <Button type="button" className="w-full h-11" disabled={isPending || !email} onClick={handleSend}>
            {isPending ? "Sending…" : "Send reset link"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
