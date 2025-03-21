"use client"

import { useState, useRef, useTransition } from "react"
import { Camera } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { uploadAvatarAction } from "@/lib/actions/profiles"

interface AvatarUploadProps {
  currentUrl: string | null
  initials: string
}

export function AvatarUpload({ currentUrl, initials }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    const formData = new FormData()
    formData.append("avatar", file)

    startTransition(async () => {
      const result = await uploadAvatarAction(formData)
      if (result?.error) {
        toast.error("Upload failed. Try again.")
        setPreview(currentUrl)
      } else {
        toast.success("Avatar updated")
      }
    })
  }

  return (
    <div className="relative shrink-0">
      <Avatar className="size-20 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
        <AvatarImage src={preview ?? undefined} alt="Avatar" />
        <AvatarFallback className="bg-primary/10 text-primary font-display text-xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
        aria-label="Change avatar"
      >
        <Camera className="size-3.5" />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
