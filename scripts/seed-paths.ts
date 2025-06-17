import { createClient } from "@supabase/supabase-js"
import type { LessonContentBlock } from "../lib/types"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

type SeedLesson = {
  id: string
  module_id: string
  title: string
  slug: string
  type: "theory" | "technique" | "recipe_walkthrough"
  content: LessonContentBlock[]
  xp_reward: number
  estimated_mins: number
  sort_order: number
}

// Path 1: Zero to Bar Ready
const PATH1 = "a0ebc001-0000-0000-0000-000000000001"
const M1_1 = "b0ebc001-0000-0000-0001-000000000001"
const M1_2 = "b0ebc001-0000-0000-0001-000000000002"
const M1_3 = "b0ebc001-0000-0000-0001-000000000003"

// Path 2: Classic Cocktails Mastery
const PATH2 = "a0ebc001-0000-0000-0000-000000000002"
const M2_1 = "b0ebc001-0000-0000-0002-000000000001"
const M2_2 = "b0ebc001-0000-0000-0002-000000000002"
const M2_3 = "b0ebc001-0000-0000-0002-000000000003"

const paths = [
  {
    id: PATH1,
    slug: "zero-to-bar-ready",
    title: "Zero to Bar Ready",
    description: "Start from scratch and build a solid foundation. Learn the tools, spirits, and techniques you need to make great cocktails at home.",
    image_url: null,
    difficulty: "easy",
    estimated_hours: 3,
    sort_order: 1,
  },
  {
    id: PATH2,
    slug: "classic-cocktails-mastery",
    title: "Classic Cocktails Mastery",
    description: "Master the canonical cocktails every serious bartender knows. Sours, stirred drinks, and the techniques that underpin all of them.",
    image_url: null,
    difficulty: "medium",
    estimated_hours: 5,
    sort_order: 2,
  },
]

const modules = [
  { id: M1_1, path_id: PATH1, title: "The Bar Essentials", sort_order: 1 },
  { id: M1_2, path_id: PATH1, title: "Understanding Spirits", sort_order: 2 },
  { id: M1_3, path_id: PATH1, title: "Your First Cocktails", sort_order: 3 },
  { id: M2_1, path_id: PATH2, title: "The Sour Family", sort_order: 1 },
  { id: M2_2, path_id: PATH2, title: "Stirred & Spirit-Forward", sort_order: 2 },
  { id: M2_3, path_id: PATH2, title: "Advanced Techniques", sort_order: 3 },
]

const lessons: SeedLesson[] = [
  // ── Module 1.1: The Bar Essentials ───────────────────────────────────────
  {
    id: "c0ebc001-0001-0000-0000-000000000001",
    module_id: M1_1,
    title: "Setting Up Your Home Bar",
    slug: "setting-up-your-home-bar",
    type: "theory",
    xp_reward: 50,
    estimated_mins: 10,
    sort_order: 1,
    content: [
      { type: "heading", text: "Your First Home Bar" },
      { type: "paragraph", text: "You do not need a professional setup to start making great cocktails. A few well-chosen bottles and basic tools will take you further than a wall of obscure spirits you never reach for." },
      { type: "tip", text: "Start with spirits you already enjoy drinking. Your bar should reflect your taste, not a textbook." },
      { type: "heading", text: "The Five Essential Bottles" },
      { type: "list", items: ["Bourbon or blended Scotch whisky", "London Dry gin", "White rum", "Silver tequila (100% agave)", "Vodka for guests who request it"] },
      { type: "paragraph", text: "Five bottles covers the foundation of nearly every classic cocktail. Add to this slowly as you develop your palate and your needs become clearer." },
    ],
  },
  {
    id: "c0ebc001-0001-0000-0000-000000000002",
    module_id: M1_1,
    title: "Essential Bar Tools",
    slug: "essential-bar-tools",
    type: "theory",
    xp_reward: 50,
    estimated_mins: 12,
    sort_order: 2,
    content: [
      { type: "heading", text: "Tools That Actually Matter" },
      { type: "paragraph", text: "Bar tools are not about collecting gadgets. Each piece solves a specific problem: measuring, diluting, straining, or chilling." },
      { type: "list", items: ["Cocktail shaker — Boston two-piece or cobbler three-piece", "Jigger with 1oz and 2oz measures", "Bar spoon for stirring and layering", "Hawthorne strainer", "Fine mesh strainer for double straining citrus drinks"] },
      { type: "tip", text: "The Boston shaker is preferred by professionals. It gives better control over shaking technique and is easier to clean than a cobbler." },
      { type: "heading", text: "What You Can Skip for Now" },
      { type: "paragraph", text: "A muddler is useful but a wooden spoon works fine. Electric juicers save time but a hand press is more than enough for home use." },
    ],
  },
  {
    id: "c0ebc001-0001-0000-0000-000000000003",
    module_id: M1_1,
    title: "Glassware Guide",
    slug: "glassware-guide",
    type: "theory",
    xp_reward: 50,
    estimated_mins: 10,
    sort_order: 3,
    content: [
      { type: "heading", text: "Why Glassware Matters" },
      { type: "paragraph", text: "Glass shape affects temperature retention, aroma concentration, and the drinking experience. It is not purely aesthetic." },
      { type: "list", items: ["Rocks glass: short drinks, spirit-forward cocktails, over ice", "Highball glass: tall drinks with more mixer and ice", "Coupe: chilled cocktails served without ice", "Nick and Nora: smaller than a coupe, elegant for spirit-forward drinks", "Wine glass: spritzes and wine-based cocktails"] },
      { type: "tip", text: "Chill your glasses before serving. Place them in the freezer for 5 minutes, or fill with ice water while you prepare the drink. Pour out before serving." },
      { type: "paragraph", text: "If you are just starting out, a set of rocks glasses and highball glasses covers 80% of cocktails you will make." },
    ],
  },

  // ── Module 1.2: Understanding Spirits ────────────────────────────────────
  {
    id: "c0ebc001-0002-0000-0000-000000000001",
    module_id: M1_2,
    title: "The Six Base Spirits",
    slug: "six-base-spirits",
    type: "theory",
    xp_reward: 75,
    estimated_mins: 15,
    sort_order: 1,
    content: [
      { type: "heading", text: "The Foundation of Every Cocktail" },
      { type: "paragraph", text: "Nearly every cocktail is built on one of six base spirits. Understanding each one gives you a framework for reading any recipe you will ever encounter." },
      { type: "list", items: ["Whiskey: grain-based, aged in oak, complex and warming", "Gin: grain-based, flavored with botanicals, always juniper-forward", "Rum: sugarcane-based, ranges from light and neutral to intensely aged", "Vodka: neutral grain or potato spirit, defined by its absence of flavor", "Tequila: blue agave-based, earthy and vegetal", "Brandy: distilled wine or fruit, rich and fruity"] },
      { type: "tip", text: "Taste each spirit neat before using it in cocktails. You cannot balance flavors you do not understand." },
    ],
  },
  {
    id: "c0ebc001-0002-0000-0000-000000000002",
    module_id: M1_2,
    title: "Whiskey & Bourbon",
    slug: "whiskey-and-bourbon",
    type: "theory",
    xp_reward: 75,
    estimated_mins: 15,
    sort_order: 2,
    content: [
      { type: "heading", text: "The World of Whiskey" },
      { type: "paragraph", text: "Whiskey is aged grain spirit. The grain, the barrel, the climate, and the time all shape its final character. The main styles you need to know are Scotch, bourbon, rye, and Irish." },
      { type: "heading", text: "Bourbon vs Scotch" },
      { type: "paragraph", text: "Bourbon is American, made from at least 51% corn, aged in new charred oak. It is sweet, vanilla-forward, and approachable. Scotch is Scottish, often made from malted barley, aged in used casks. It is drier, smokier, and more complex." },
      { type: "tip", text: "For cocktails, bourbon is generally more versatile. Its sweetness plays well with citrus, bitters, and vermouth." },
      { type: "heading", text: "Rye Whiskey" },
      { type: "paragraph", text: "Rye has a spicier, drier profile than bourbon. It is the traditional base for a Manhattan and a classic Old Fashioned. If a recipe calls for rye, bourbon can substitute but the character will shift." },
    ],
  },
  {
    id: "c0ebc001-0002-0000-0000-000000000003",
    module_id: M1_2,
    title: "Gin, Rum & Tequila",
    slug: "gin-rum-tequila",
    type: "theory",
    xp_reward: 75,
    estimated_mins: 15,
    sort_order: 3,
    content: [
      { type: "heading", text: "Three Spirits, Three Worlds" },
      { type: "paragraph", text: "Gin, rum, and tequila each come from completely different base ingredients and regions, giving each a distinct character that defines how they behave in cocktails." },
      { type: "heading", text: "Gin" },
      { type: "paragraph", text: "Gin is neutral spirit redistilled with botanicals. Juniper is always the dominant flavor by law in London Dry gin. Modern gins can lean floral, citrus-forward, or even spiced — read the bottle." },
      { type: "heading", text: "Rum" },
      { type: "paragraph", text: "White rum is light and clean, ideal for Daiquiris and Mojitos. Aged rum develops caramel and vanilla notes from oak and is better sipped or used in spirit-forward drinks." },
      { type: "heading", text: "Tequila" },
      { type: "paragraph", text: "Blanco tequila is unaged, bright and vegetal. Reposado is rested in oak for 2-12 months, adding depth. Always use 100% agave tequila in cocktails — mixto will give you headaches, literally." },
      { type: "tip", text: "For most cocktails calling for tequila, blanco is the correct choice. Save reposado for sipping." },
    ],
  },
  {
    id: "c0ebc001-0002-0000-0000-000000000004",
    module_id: M1_2,
    title: "Reading a Bottle Label",
    slug: "reading-bottle-labels",
    type: "theory",
    xp_reward: 50,
    estimated_mins: 10,
    sort_order: 4,
    content: [
      { type: "heading", text: "What the Label Tells You" },
      { type: "paragraph", text: "A spirit label carries more information than most people realise. Once you know what to look for, you can make better purchasing decisions without relying on price alone." },
      { type: "list", items: ["ABV: higher ABV means more impact in cocktails, use slightly less", "Age statement: years in barrel, older is not always better for cocktails", "Distillery vs bottler: some bottles are sourced and blended, not distillery-made", "Region: Scotch region tells you expected flavor profile (Islay = smoky, Speyside = fruity)", "Cask type: ex-bourbon cask = vanilla notes, ex-sherry cask = dried fruit"] },
      { type: "tip", text: "For cocktail use, ABV matters more than age. A 46% bourbon will give a stronger backbone than a 40% one, even if the younger bottle." },
    ],
  },

  // ── Module 1.3: Your First Cocktails ─────────────────────────────────────
  {
    id: "c0ebc001-0003-0000-0000-000000000001",
    module_id: M1_3,
    title: "The Highball",
    slug: "the-highball",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 12,
    sort_order: 1,
    content: [
      { type: "heading", text: "The Simplest Cocktail" },
      { type: "paragraph", text: "The highball is spirit plus carbonated mixer over ice in a tall glass. It is the gateway cocktail — easy to make, endlessly variable, and genuinely delicious when done right." },
      { type: "heading", text: "The Technique" },
      { type: "list", items: ["Fill a highball glass with ice, ideally one large piece or several cubes", "Add 2oz of your spirit (whisky, gin, vodka, or rum all work)", "Gently pour the mixer down the side of the glass to preserve carbonation", "Give a single gentle stir from the bottom — do not churn it"] },
      { type: "tip", text: "Cold ingredients and a cold glass matter more than anything else. Warm mixer will immediately go flat and dilute fast." },
      { type: "heading", text: "The Ratio" },
      { type: "paragraph", text: "A strong highball is 1:2 (spirit to mixer). A standard serve is 1:3. A lower-ABV option goes 1:4. Start at 1:3 and adjust to your preference." },
    ],
  },
  {
    id: "c0ebc001-0003-0000-0000-000000000002",
    module_id: M1_3,
    title: "The Old Fashioned",
    slug: "the-old-fashioned-lesson",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 15,
    sort_order: 2,
    content: [
      { type: "heading", text: "The Spirit-Forward Classic" },
      { type: "paragraph", text: "The Old Fashioned is one of the oldest cocktail formats still in use. It is simply whiskey, sugar, and bitters — the goal is to enhance the spirit, not mask it." },
      { type: "heading", text: "The Build" },
      { type: "list", items: ["Add a sugar cube or 1 bar spoon of simple syrup to a rocks glass", "Add 2 dashes of Angostura bitters", "Add a small splash of water and stir to dissolve the sugar", "Add 2oz of bourbon or rye", "Add a large ice cube and stir for 20-30 seconds", "Express an orange peel over the glass and drop it in"] },
      { type: "tip", text: "Stirring time controls dilution. 20 seconds gives a sharper, more spirit-forward drink. 40 seconds gives a smoother, more integrated result. Learn which you prefer." },
      { type: "paragraph", text: "The Old Fashioned is a test of restraint. Resist the urge to add fruit, soda water, or anything else. The original is perfect as it is." },
    ],
  },
  {
    id: "c0ebc001-0003-0000-0000-000000000003",
    module_id: M1_3,
    title: "The Daiquiri",
    slug: "the-daiquiri-lesson",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 12,
    sort_order: 3,
    content: [
      { type: "heading", text: "Three Ingredients, One Rule" },
      { type: "paragraph", text: "The Daiquiri — rum, lime, sugar — is one of the most important cocktails to master. It teaches you the sour template that underpins dozens of other drinks." },
      { type: "heading", text: "The Golden Ratio" },
      { type: "paragraph", text: "The classic Daiquiri ratio is 2oz rum : 3/4oz fresh lime juice : 3/4oz simple syrup. This is a starting point, not a rule — limes vary in acidity, so always taste and adjust." },
      { type: "list", items: ["Combine all ingredients in a shaker with ice", "Shake hard for 10-12 seconds until the shaker is frosty cold", "Double strain into a chilled coupe glass", "No garnish needed — the drink should speak for itself"] },
      { type: "tip", text: "Always use fresh lime juice. Bottled lime juice tastes cooked and artificial. There is no substitute." },
      { type: "heading", text: "Balancing the Sour" },
      { type: "paragraph", text: "If your Daiquiri tastes too tart, add a touch more syrup. If too sweet, add more lime. The balance point is where neither sweetness nor sourness dominates." },
    ],
  },

  // ── Module 2.1: The Sour Family ───────────────────────────────────────────
  {
    id: "c0ebc002-0001-0000-0000-000000000001",
    module_id: M2_1,
    title: "Anatomy of a Sour",
    slug: "anatomy-of-a-sour",
    type: "theory",
    xp_reward: 75,
    estimated_mins: 15,
    sort_order: 1,
    content: [
      { type: "heading", text: "The Template Behind Dozens of Cocktails" },
      { type: "paragraph", text: "The sour is one of the oldest and most versatile cocktail templates. Once you understand it, you can create or deconstruct almost any sour-style drink you encounter." },
      { type: "heading", text: "The Three Components" },
      { type: "list", items: ["Spirit: the backbone, determines character and strength", "Citrus: the sour element, provides acidity and brightness (lemon or lime)", "Sweetener: balances the acid, can be simple syrup, liqueur, or flavored syrup"] },
      { type: "paragraph", text: "The standard ratio is 2:3/4:3/4 — two parts spirit to three-quarter parts each of citrus and sweetener. This is a guideline, not a law. Adjust based on the specific citrus and your palate." },
      { type: "tip", text: "Egg white or aquafaba adds a silky texture and foam without adding flavor. It is optional but transforms the mouthfeel." },
      { type: "heading", text: "Shaking vs Not Shaking" },
      { type: "paragraph", text: "All sours are shaken — never stirred. The shaking emulsifies the citrus, chills and dilutes, and creates a slight cloudiness that is visually appealing." },
    ],
  },
  {
    id: "c0ebc002-0001-0000-0000-000000000002",
    module_id: M2_1,
    title: "The Whiskey Sour",
    slug: "the-whiskey-sour",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 15,
    sort_order: 2,
    content: [
      { type: "heading", text: "The Benchmark Sour" },
      { type: "paragraph", text: "The Whiskey Sour is the reference point for the entire sour family. Master this and every other sour becomes easier." },
      { type: "heading", text: "The Recipe" },
      { type: "list", items: ["2oz bourbon (rye works too)", "3/4oz fresh lemon juice", "3/4oz simple syrup", "1 egg white (optional but recommended)", "Angostura bitters for garnish"] },
      { type: "heading", text: "The Technique" },
      { type: "paragraph", text: "If using egg white, dry shake first: combine all ingredients without ice and shake hard for 15 seconds to emulsify the egg. Then add ice and shake again for 10 seconds to chill. This creates a stable, long-lasting foam." },
      { type: "tip", text: "Lemon juice varies in acidity between fruits and seasons. Always taste your citrus before making cocktails in volume, and adjust accordingly." },
      { type: "paragraph", text: "Strain into a rocks glass over a large ice cube. Add a few drops of Angostura on top of the foam and drag a cocktail pick through to create a pattern." },
    ],
  },
  {
    id: "c0ebc002-0001-0000-0000-000000000003",
    module_id: M2_1,
    title: "The Margarita",
    slug: "the-margarita-lesson",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 15,
    sort_order: 3,
    content: [
      { type: "heading", text: "The World's Best-Selling Cocktail" },
      { type: "paragraph", text: "The Margarita is the sour template applied to tequila. Simple on paper, endlessly variable in practice. The difference between a great Margarita and a mediocre one is almost always ingredient quality." },
      { type: "heading", text: "The Classic Recipe" },
      { type: "list", items: ["2oz blanco tequila (100% agave only)", "1oz fresh lime juice", "3/4oz Cointreau or triple sec", "Salt for the rim (optional)"] },
      { type: "heading", text: "Tommy's Margarita" },
      { type: "paragraph", text: "Tommy's — invented by Julio Bermejo in San Francisco — replaces the orange liqueur with agave nectar. This shifts the focus entirely to the tequila and is considered by many to be the superior version for quality spirits." },
      { type: "tip", text: "Half-rim the glass with salt rather than full rim. This lets each sip be the drinker's choice — salted or not." },
      { type: "paragraph", text: "Shake hard with ice. Strain into a rocks glass over fresh ice or serve up in a coupe. Both are correct." },
    ],
  },

  // ── Module 2.2: Stirred & Spirit-Forward ──────────────────────────────────
  {
    id: "c0ebc002-0002-0000-0000-000000000001",
    module_id: M2_2,
    title: "The Manhattan",
    slug: "the-manhattan",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 15,
    sort_order: 1,
    content: [
      { type: "heading", text: "The Stirred Classic" },
      { type: "paragraph", text: "The Manhattan is whiskey, sweet vermouth, and bitters. It is spirit-forward, complex, and entirely dependent on ingredient quality. Use cheap vermouth and you will taste it." },
      { type: "heading", text: "The Recipe" },
      { type: "list", items: ["2oz rye whiskey (bourbon works but changes the character)", "1oz sweet vermouth (Carpano Antica or Dolin Rouge recommended)", "2 dashes Angostura bitters", "Maraschino cherry for garnish"] },
      { type: "heading", text: "Stirring Technique" },
      { type: "paragraph", text: "Add all ingredients to a mixing glass filled with large ice. Stir with a bar spoon using a smooth, circular motion for 30-40 seconds. The goal is dilution and chill without aeration." },
      { type: "tip", text: "Vermouth is wine — it oxidises after opening. Store it in the fridge and use within a month. Flat, oxidised vermouth is the most common reason a Manhattan tastes off." },
      { type: "paragraph", text: "Strain into a chilled coupe or Nick and Nora glass. Express an orange peel if you like additional citrus aroma, but the cherry is the traditional garnish." },
    ],
  },
  {
    id: "c0ebc002-0002-0000-0000-000000000002",
    module_id: M2_2,
    title: "The Negroni",
    slug: "the-negroni",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 15,
    sort_order: 2,
    content: [
      { type: "heading", text: "Equal Parts, Maximum Complexity" },
      { type: "paragraph", text: "The Negroni is gin, Campari, and sweet vermouth in equal parts. Three ingredients, each strong in its own right, combining into something greater than the sum." },
      { type: "heading", text: "The Recipe" },
      { type: "list", items: ["1oz gin (London Dry preferred)", "1oz Campari", "1oz sweet vermouth", "Orange twist for garnish"] },
      { type: "paragraph", text: "Stir over ice for 30 seconds. Strain into a rocks glass over a large ice cube. Express and drop an orange twist." },
      { type: "heading", text: "Variations" },
      { type: "list", items: ["Boulevardier: replace gin with bourbon for a richer, warmer drink", "Negroni Sbagliato: replace gin with prosecco for a lighter, lower-ABV version", "White Negroni: replace Campari with Suze and sweet vermouth with Lillet Blanc"] },
      { type: "tip", text: "The Negroni is one of the best cocktails to batch in advance. Mix in a bottle, keep in the fridge, and it improves over a few days." },
    ],
  },
  {
    id: "c0ebc002-0002-0000-0000-000000000003",
    module_id: M2_2,
    title: "The Martini",
    slug: "the-martini",
    type: "recipe_walkthrough",
    xp_reward: 100,
    estimated_mins: 15,
    sort_order: 3,
    content: [
      { type: "heading", text: "The Most Argued Cocktail" },
      { type: "paragraph", text: "No cocktail generates more debate than the Martini. Gin or vodka. Wet or dry. Stirred or shaken. Olive or twist. Every choice matters, and none is objectively correct." },
      { type: "heading", text: "The Classic Gin Martini" },
      { type: "list", items: ["2.5oz London Dry gin", "0.5oz dry vermouth (Noilly Prat or Dolin Dry)", "Lemon twist or olive for garnish"] },
      { type: "paragraph", text: "Stir over ice for 40 seconds — longer than most stirred drinks because dilution is critical here. Strain into a frozen Martini or coupe glass." },
      { type: "heading", text: "Wet vs Dry" },
      { type: "paragraph", text: "A wet Martini has more vermouth (up to equal parts). A dry Martini has very little — some bartenders just rinse the glass. Start wet and work drier as you develop a preference. An extremely dry Martini is just cold gin." },
      { type: "tip", text: "Bond was wrong. Shaking a Martini bruises the gin (actually over-dilutes and aerates it). Stir a Martini. Always." },
    ],
  },

  // ── Module 2.3: Advanced Techniques ───────────────────────────────────────
  {
    id: "c0ebc002-0003-0000-0000-000000000001",
    module_id: M2_3,
    title: "Fat Washing Spirits",
    slug: "fat-washing-spirits",
    type: "technique",
    xp_reward: 125,
    estimated_mins: 20,
    sort_order: 1,
    content: [
      { type: "heading", text: "Infusing Fat Into Spirits" },
      { type: "paragraph", text: "Fat washing is a technique for infusing fat-soluble flavors into spirits. The classic example is bacon bourbon — used to legendary effect at PDT in New York." },
      { type: "heading", text: "The Process" },
      { type: "list", items: ["Melt or warm your fat (butter, bacon fat, coconut oil, nut oil)", "Combine warm fat with room-temperature spirit in a jar at roughly 1:8 ratio", "Let sit at room temperature for 4-8 hours, stirring occasionally", "Place in the freezer overnight — the fat will solidify and float", "Strain through cheesecloth to remove all fat solids", "Fine strain again if clarity is needed"] },
      { type: "tip", text: "Alcohol-soluble flavor compounds move from the fat into the spirit during infusion. When the fat solidifies in the freezer, these flavors remain in the liquid." },
      { type: "paragraph", text: "The result is a spirit with the aroma and flavour profile of the fat but none of the greasy mouthfeel. Bourbon fat-washed with brown butter has a nutty, caramelised depth that transforms an Old Fashioned." },
    ],
  },
  {
    id: "c0ebc002-0003-0000-0000-000000000002",
    module_id: M2_3,
    title: "Infusions & Tinctures",
    slug: "infusions-and-tinctures",
    type: "technique",
    xp_reward: 125,
    estimated_mins: 20,
    sort_order: 2,
    content: [
      { type: "heading", text: "Extracting Flavor with Alcohol" },
      { type: "paragraph", text: "Infusions and tinctures are two methods for adding flavor to spirits. The difference is concentration and application." },
      { type: "heading", text: "Infusions" },
      { type: "paragraph", text: "An infusion replaces the spirit entirely. You add flavoring ingredients directly to a bottle and let it sit for days to weeks. Chili vodka, elderflower gin, or vanilla rum are common examples. Taste daily and strain when you reach the desired intensity." },
      { type: "heading", text: "Tinctures" },
      { type: "paragraph", text: "Tinctures are highly concentrated extracts made with a small amount of neutral high-proof spirit. A few drops change a cocktail. Common tinctures: black pepper, cardamom, citrus peel, tobacco." },
      { type: "tip", text: "For tinctures, use 95% neutral grain spirit if available. High ABV extracts more efficiently and the small volumes used mean the extra strength does not affect the final drink significantly." },
      { type: "list", items: ["Soft herbs (basil, mint): 2-4 hours max or they go green and bitter", "Hard spices (cloves, cardamom): 1-3 days", "Citrus peel: 3-5 days", "Vanilla bean: 1-2 weeks", "Chili: taste every hour — capsaicin extracts fast"] },
    ],
  },
  {
    id: "c0ebc002-0003-0000-0000-000000000003",
    module_id: M2_3,
    title: "Batching for Events",
    slug: "batching-for-events",
    type: "technique",
    xp_reward: 100,
    estimated_mins: 15,
    sort_order: 3,
    content: [
      { type: "heading", text: "Scaling Cocktails Without Sacrificing Quality" },
      { type: "paragraph", text: "Batching lets you pre-make cocktails for groups without the chaos of making each drink individually. Done right, guests cannot tell the difference." },
      { type: "heading", text: "What Can Be Batched" },
      { type: "paragraph", text: "Stirred cocktails batch perfectly — Manhattan, Negroni, Martini. They keep for weeks in the freezer. Sours need fresh citrus and are harder to batch, but can be made in advance and kept cold for a few hours." },
      { type: "heading", text: "The Pre-Dilution Calculation" },
      { type: "paragraph", text: "When you stir or shake a cocktail, it gains roughly 20-25% dilution from melting ice. For a batched drink served without stirring, add this water upfront." },
      { type: "list", items: ["Calculate total spirit + modifier volume", "Add 20% of that volume as filtered water", "Bottle and refrigerate (or freeze for spirit-only batches)", "Serve directly from bottle — no ice needed if frozen"] },
      { type: "tip", text: "Label everything with the date and contents. Batched cocktails look identical in the dark." },
    ],
  },
  {
    id: "c0ebc002-0003-0000-0000-000000000004",
    module_id: M2_3,
    title: "Building a Signature Cocktail",
    slug: "building-a-signature-cocktail",
    type: "technique",
    xp_reward: 150,
    estimated_mins: 20,
    sort_order: 4,
    content: [
      { type: "heading", text: "Creating Something Original" },
      { type: "paragraph", text: "Every bartender eventually tries to create their own cocktail. Most fail because they start with flavors rather than starting with structure." },
      { type: "heading", text: "Start with a Template" },
      { type: "paragraph", text: "Every great cocktail builds on an existing template: sour, Old Fashioned, highball, flip, fizz, or swizzle. Choose a template, then ask what spirit and what modifiers fit the experience you want to create." },
      { type: "heading", text: "The Balance Framework" },
      { type: "list", items: ["Strong: the spirit — determines weight and character", "Weak: dilution from ice or added water", "Sweet: syrup, liqueur, or sweet vermouth", "Sour: citrus, verjuice, or acidulated water", "Bitter: amari, bitters, or bitter liqueurs", "Aromatic: garnish, rinse, or expressed oil"] },
      { type: "tip", text: "Write down every iteration. Your first version will not be the best one, and you need to be able to reproduce the version you loved." },
      { type: "paragraph", text: "Name it last. The name should reflect the drink, not the other way around. Too many bartenders name a cocktail before they know what it tastes like." },
    ],
  },
]

async function main() {
  console.log("Seeding learning paths…")

  const { error: pathError } = await supabase.from("learning_paths").upsert(paths)
  if (pathError) { console.error("paths:", pathError.message); process.exit(1) }

  const { error: moduleError } = await supabase.from("path_modules").upsert(modules)
  if (moduleError) { console.error("modules:", moduleError.message); process.exit(1) }

  const { error: lessonError } = await supabase.from("lessons").upsert(lessons)
  if (lessonError) { console.error("lessons:", lessonError.message); process.exit(1) }

  console.log(`Done — ${paths.length} paths, ${modules.length} modules, ${lessons.length} lessons seeded`)
}

main().catch(console.error)
