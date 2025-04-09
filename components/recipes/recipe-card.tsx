import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SPIRIT_LABELS, DIFFICULTY_LABELS } from "@/lib/constants"
import type { Recipe } from "@/lib/types"

const SPIRIT_COLORS: Record<string, string> = {
  whiskey: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  gin: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  rum: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  vodka: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  tequila: "bg-lime-500/15 text-lime-400 border-lime-500/20",
  brandy: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  wine: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  beer: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  non_alcoholic: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  hard: "bg-rose-500/15 text-rose-400 border-rose-500/20",
}

interface RecipeCardProps {
  recipe: Recipe
  isSaved?: boolean
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-4xl">
            🍹
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2">
            {recipe.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mt-auto">
          <span className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
            SPIRIT_COLORS[recipe.spirit_category] ?? SPIRIT_COLORS.other
          )}>
            {SPIRIT_LABELS[recipe.spirit_category] ?? recipe.spirit_category}
          </span>

          <span className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
            DIFFICULTY_COLORS[recipe.difficulty] ?? ""
          )}>
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <Clock className="size-3" />
            {recipe.prep_time_mins} min
          </span>
        </div>
      </div>
    </Link>
  )
}
