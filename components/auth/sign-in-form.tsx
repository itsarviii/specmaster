"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/actions/auth"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof schema>

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit(values: FormValues) {
    setServerError(null)
    startTransition(async () => {
      const result = await signIn(values.email, values.password)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Continue your bartending journey.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-destructive text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        No account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  )
}
