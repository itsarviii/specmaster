import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <Image src="/favicon.svg" alt="" width={64} height={64} className="mb-6 opacity-60" />
      <h1 className="font-display text-4xl font-semibold text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-1">This page doesn&apos;t exist.</p>
      <p className="text-sm text-muted-foreground mb-8">
        It may have been moved or never existed.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}
