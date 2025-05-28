import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const badges = [
  { slug: "first-recipe-saved",    name: "First Save",       description: "Saved your first cocktail recipe.",       icon: "🔖" },
  { slug: "first-lesson-complete", name: "First Step",       description: "Completed your first lesson.",             icon: "📖" },
  { slug: "first-path-complete",   name: "Path Finder",      description: "Finished a complete learning path.",       icon: "🎓" },
  { slug: "streak-7",              name: "Week Warrior",     description: "Kept a 7-day learning streak.",            icon: "🔥" },
  { slug: "streak-30",             name: "Monthly Master",   description: "Kept a 30-day learning streak.",           icon: "⚡" },
  { slug: "first-game",            name: "Game On",          description: "Played your first bartending game.",       icon: "🎮" },
  { slug: "perfect-challenge",     name: "Perfectionist",    description: "Scored 100% on any game.",                icon: "⭐" },
  { slug: "speed-pourer",          name: "Speed Pourer",     description: "Answered 5 questions under 3 seconds each.", icon: "💨" },
  { slug: "memory-lane",           name: "Memory Lane",      description: "Completed all three game modes.",         icon: "🧠" },
]

async function main() {
  const { error } = await supabase.from("badges").upsert(badges, { onConflict: "slug" })
  if (error) {
    console.error("Error seeding badges:", error.message)
    process.exit(1)
  }
  console.log(`✓ Seeded ${badges.length} badges`)
}

main()
