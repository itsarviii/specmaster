export type ExperienceLevel = "beginner" | "intermediate" | "advanced"
export type UserRole = "home_bartender" | "bar_staff" | "professional"

export type Profile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  experience_level: ExperienceLevel | null
  role: UserRole | null
  onboarding_done: boolean
  created_at: string
  updated_at: string
}

export type SpiritCategory =
  | "whiskey"
  | "gin"
  | "rum"
  | "vodka"
  | "tequila"
  | "brandy"
  | "wine"
  | "beer"
  | "non_alcoholic"
  | "other"

export type Difficulty = "easy" | "medium" | "hard"
export type Method = "shake" | "stir" | "build" | "blend" | "layer" | "throw"

export type Recipe = {
  id: string
  slug: string
  name: string
  description: string | null
  image_url: string | null
  spirit_category: SpiritCategory
  difficulty: Difficulty
  prep_time_mins: number
  glassware: string | null
  garnish: string | null
  method: Method
  flavor_tags: string[]
  is_published: boolean
  created_at: string
}

export type Ingredient = {
  id: string
  recipe_id: string
  name: string
  amount: string | null
  unit: string | null
  is_optional: boolean
  sort_order: number
}

export type RecipeStep = {
  id: string
  recipe_id: string
  step_number: number
  instruction: string
  tip: string | null
}

export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[]
  steps: RecipeStep[]
  is_saved?: boolean
  rating?: number | null
}

export type LearningPath = {
  id: string
  slug: string
  title: string
  description: string | null
  image_url: string | null
  difficulty: Difficulty
  estimated_hours: number
  is_published: boolean
  sort_order: number
}

export type PathModule = {
  id: string
  path_id: string
  title: string
  sort_order: number
}

export type LessonType = "theory" | "technique" | "recipe_walkthrough"

export type Lesson = {
  id: string
  module_id: string
  title: string
  slug: string
  type: LessonType
  content: LessonContentBlock[]
  xp_reward: number
  estimated_mins: number
  sort_order: number
  is_published: boolean
}

export type LessonContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "recipe_callout"; recipe_id: string; recipe_name: string }
  | { type: "tip"; text: string }
  | { type: "list"; items: string[] }

export type UserPathEnrollment = {
  id: string
  user_id: string
  path_id: string
  enrolled_at: string
  completed_at: string | null
}

export type UserLessonCompletion = {
  id: string
  user_id: string
  lesson_id: string
  completed_at: string
}

export type XpSourceType = "lesson" | "badge" | "streak" | "game"

export type UserXpEvent = {
  id: string
  user_id: string
  xp_amount: number
  reason: string
  source_type: XpSourceType
  source_id: string | null
  earned_at: string
}

export type Badge = {
  id: string
  slug: string
  name: string
  description: string
  icon_url: string | null
}

export type UserBadge = {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge: Badge
}

export type UserStreak = {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_active_date: string | null
}

export type GameMode = "flashcard" | "ingredient_challenge" | "name_that_cocktail"
export type GameScope = "saved" | "random"

export type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}
