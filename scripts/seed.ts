import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)

const COCKTAILDB = "https://www.thecocktaildb.com/api/json/v1/1"
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("")

interface CDBDrink {
  idDrink: string
  strDrink: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
  strInstructions: string
  strDrinkThumb: string
  [key: `strIngredient${number}`]: string | null
  [key: `strMeasure${number}`]: string | null
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

function detectSpirit(ingredients: string[]): string {
  const text = ingredients.join(" ").toLowerCase()
  if (/whiskey|scotch|bourbon|rye|whisky/.test(text)) return "whiskey"
  if (/\bgin\b/.test(text)) return "gin"
  if (/\brum\b|cachaca|cachaça/.test(text)) return "rum"
  if (/vodka/.test(text)) return "vodka"
  if (/tequila|mezcal/.test(text)) return "tequila"
  if (/brandy|cognac|armagnac|calvados/.test(text)) return "brandy"
  if (/\bwine\b|champagne|prosecco|cava/.test(text)) return "wine"
  if (/\bbeer\b|lager|ale|stout/.test(text)) return "beer"
  return "other"
}

function detectMethod(glass: string, instructions: string): string {
  const text = (glass + " " + instructions).toLowerCase()
  if (/blend|blender/.test(text)) return "blend"
  if (/shake|shaken/.test(text)) return "shake"
  if (/stir|stirred/.test(text)) return "stir"
  if (/layer|float/.test(text)) return "layer"
  return "build"
}

function detectDifficulty(ingredientCount: number): string {
  if (ingredientCount <= 3) return "easy"
  if (ingredientCount <= 6) return "medium"
  return "hard"
}

function prepTime(method: string): number {
  return method === "blend" ? 5 : method === "shake" ? 4 : method === "stir" ? 5 : 3
}

function parseSteps(instructions: string): string[] {
  return instructions
    .split(/\.\s+/)
    .map((s) => s.replace(/\.$/, "").trim())
    .filter((s) => s.length > 8)
}

function extractIngredients(drink: CDBDrink): { name: string; amount: string }[] {
  const result: { name: string; amount: string }[] = []
  for (let i = 1; i <= 15; i++) {
    const name = drink[`strIngredient${i}`]
    if (!name || name.trim() === "") break
    const measure = drink[`strMeasure${i}`] ?? ""
    result.push({ name: name.trim(), amount: measure.trim() })
  }
  return result
}

async function fetchLetter(letter: string): Promise<CDBDrink[]> {
  const res = await fetch(`${COCKTAILDB}/search.php?f=${letter}`)
  const json = await res.json()
  return json.drinks ?? []
}

async function main() {
  console.log("Fetching cocktails from TheCocktailDB…")

  const allDrinks: CDBDrink[] = []
  for (const letter of LETTERS) {
    process.stdout.write(`  ${letter}`)
    const drinks = await fetchLetter(letter)
    allDrinks.push(...drinks)
    await new Promise((r) => setTimeout(r, 150))
  }
  console.log(`\nFetched ${allDrinks.length} cocktails`)

  const slugsSeen = new Set<string>()
  const recipes: { id: string; slug: string; name: string; image_url: string; spirit_category: string; difficulty: string; method: string; prep_time_mins: number; glassware: string | null; flavor_tags: string[] }[] = []
  const ingredientRows: { recipe_id: string; name: string; amount: string | null; sort_order: number }[] = []
  const stepRows: { recipe_id: string; step_number: number; instruction: string }[] = []

  for (const drink of allDrinks) {
    let slug = toSlug(drink.strDrink)
    if (slugsSeen.has(slug)) slug = `${slug}-${drink.idDrink}`
    slugsSeen.add(slug)

    const rawIngredients = extractIngredients(drink)
    const ingredientNames = rawIngredients.map((i) => i.name)
    const spirit = detectSpirit(ingredientNames)
    const method = detectMethod(drink.strGlass ?? "", drink.strInstructions ?? "")
    const difficulty = detectDifficulty(rawIngredients.length)
    const steps = parseSteps(drink.strInstructions ?? "")

    const id = crypto.randomUUID()

    recipes.push({
      id,
      slug,
      name: drink.strDrink,
      image_url: drink.strDrinkThumb,
      spirit_category: spirit,
      difficulty,
      method,
      prep_time_mins: prepTime(method),
      glassware: drink.strGlass ?? null,
      flavor_tags: [spirit, method],
    })

    rawIngredients.forEach(({ name, amount }, idx) => {
      ingredientRows.push({ recipe_id: id, name, amount: amount || null, sort_order: idx })
    })

    steps.forEach((instruction, idx) => {
      stepRows.push({ recipe_id: id, step_number: idx + 1, instruction })
    })
  }

  console.log("Inserting recipes…")
  const CHUNK = 100
  for (let i = 0; i < recipes.length; i += CHUNK) {
    const { error } = await supabase.from("recipes").upsert(recipes.slice(i, i + CHUNK))
    if (error) { console.error("recipes:", error.message); process.exit(1) }
  }

  console.log("Inserting ingredients…")
  for (let i = 0; i < ingredientRows.length; i += CHUNK) {
    const { error } = await supabase.from("ingredients").upsert(ingredientRows.slice(i, i + CHUNK))
    if (error) { console.error("ingredients:", error.message); process.exit(1) }
  }

  console.log("Inserting steps…")
  for (let i = 0; i < stepRows.length; i += CHUNK) {
    const { error } = await supabase.from("recipe_steps").upsert(stepRows.slice(i, i + CHUNK))
    if (error) { console.error("steps:", error.message); process.exit(1) }
  }

  console.log(`Done — ${recipes.length} recipes seeded`)
}

main().catch(console.error)
