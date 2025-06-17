import Image from "next/image"
import { cn } from "@/lib/utils"

interface AppLogoProps {
  size?: "sm" | "md"
  className?: string
}

export function AppLogo({ size = "md", className }: AppLogoProps) {
  const iconSize = size === "sm" ? 22 : 28
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image src="/favicon.svg" alt="" width={iconSize} height={iconSize} />
      <span
        className={cn(
          "font-display font-semibold tracking-wide text-foreground",
          size === "sm" ? "text-base" : "text-lg"
        )}
      >
        SpecMaster
      </span>
    </div>
  )
}
