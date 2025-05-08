import Link from "next/link"
import { Lightbulb } from "lucide-react"
import type { LessonContentBlock } from "@/lib/types"

export function LessonContent({ blocks }: { blocks: LessonContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="font-display text-xl font-semibold pt-2 first:pt-0">
                {block.text}
              </h2>
            )
          case "paragraph":
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/90">
                {block.text}
              </p>
            )
          case "list":
            return (
              <ul key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            )
          case "tip":
            return (
              <div key={i} className="flex gap-3 rounded-xl bg-primary/8 border border-primary/20 p-4">
                <Lightbulb className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-foreground/90">{block.text}</p>
              </div>
            )
          case "recipe_callout":
            return (
              <Link
                key={i}
                href={`/recipes/${block.recipe_id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors p-4"
              >
                <span className="text-2xl">🍹</span>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Recipe</p>
                  <p className="text-sm font-medium">{block.recipe_name}</p>
                </div>
              </Link>
            )
          case "image":
            return (
              <figure key={i} className="space-y-2">
                <img src={block.url} alt={block.caption ?? ""} className="rounded-xl w-full object-cover" />
                {block.caption && <figcaption className="text-xs text-muted-foreground text-center">{block.caption}</figcaption>}
              </figure>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
