"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthShell } from "@/components/auth/auth-shell"
import { resetPasswordAction } from "@/lib/actions/auth"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) return setError("Passwords don't match.")
    if (password.length < 8) return setError("Password must be at least 8 characters.")
    setError(null)
    startTransition(async () => {
      const result = await resetPasswordAction(password)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <AuthShell>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold mb-1.5">Set new password</h1>
          <p className="text-sm text-muted-foreground">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="h-11"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-xs text-destructive text-center">{error}</p>}

          <Button type="submit" className="w-full h-11" disabled={isPending || !password || !confirm}>
            {isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </AuthShell>
  )
}
