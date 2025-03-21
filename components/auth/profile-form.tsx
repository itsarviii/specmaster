"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProfileAction } from "@/lib/actions/profiles"

const schema = z.object({
  display_name: z.string().min(1, "Name is required").max(50),
  bio: z.string().max(200).optional(),
})

type FormValues = z.infer<typeof schema>

interface ProfileFormProps {
  displayName: string
  bio: string
}

export function ProfileForm({ displayName, bio }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { display_name: displayName, bio },
  })

  function onSubmit(values: FormValues) {
    setServerError(null)
    startTransition(async () => {
      const result = await updateProfileAction({
        display_name: values.display_name,
        bio: values.bio ?? "",
      })
      if (result?.error) {
        setServerError(result.error)
      } else {
        toast.success("Profile updated")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="display_name">Display name</Label>
        <Input
          id="display_name"
          placeholder="Your name"
          {...register("display_name")}
        />
        {errors.display_name && (
          <p className="text-xs text-destructive">{errors.display_name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself…"
          rows={3}
          className="resize-none"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-xs text-destructive">{serverError}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
