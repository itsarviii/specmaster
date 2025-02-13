export const APP_NAME = "SpecMaster"
export const APP_DESCRIPTION = "The bartender's learning companion"

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  FLASHCARD_SESSION: 75,
  INGREDIENT_CHALLENGE: 100,
  NAME_THAT_COCKTAIL: 100,
  STREAK_BONUS: 25,
  FIRST_SAVE: 10,
} as const

export const GAME_QUESTIONS_PER_SESSION = 10
export const NAME_THAT_COCKTAIL_TIME_SECS = 15
export const INGREDIENT_CHALLENGE_OPTIONS = 10
export const NAME_THAT_COCKTAIL_OPTIONS = 4

export const WEAK_SPOT_THRESHOLD = 0.7
export const PRACTICE_WIDGET_COUNT = 5

export const RECIPES_PER_PAGE = 20

export const SPIRIT_LABELS: Record<string, string> = {
  whiskey: "Whiskey",
  gin: "Gin",
  rum: "Rum",
  vodka: "Vodka",
  tequila: "Tequila",
  brandy: "Brandy",
  wine: "Wine",
  beer: "Beer",
  non_alcoholic: "Non-Alcoholic",
  other: "Other",
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
}

export const METHOD_LABELS: Record<string, string> = {
  shake: "Shake",
  stir: "Stir",
  build: "Build",
  blend: "Blend",
  layer: "Layer",
  throw: "Throw",
}

export const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export const ROLE_LABELS: Record<string, string> = {
  home_bartender: "Home Bartender",
  bar_staff: "Bar Staff",
  professional: "Professional",
}

export const BADGE_SLUGS = {
  FIRST_RECIPE_SAVED: "first-recipe-saved",
  FIRST_LESSON_COMPLETE: "first-lesson-complete",
  FIRST_PATH_COMPLETE: "first-path-complete",
  STREAK_7: "streak-7",
  STREAK_30: "streak-30",
  FIRST_GAME: "first-game",
  PERFECT_CHALLENGE: "perfect-challenge",
  SPEED_POURER: "speed-pourer",
  MEMORY_LANE: "memory-lane",
} as const

export const LEVEL_TITLES = [
  "Bar Back",
  "Barkeep",
  "Pour Master",
  "Mixologist",
  "Cocktail Craftsman",
  "Spirits Expert",
  "Bar Veteran",
  "Head Bartender",
  "Bar Manager",
  "Master Bartender",
  "Legendary Barkeep",
] as const
