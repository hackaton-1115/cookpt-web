export interface Ingredient {
  name: string
  amount: string
  unit?: string
}

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: Ingredient[]
  instructions: string[]
  nutrition: NutritionInfo
  category: string
  cookingTools: string[]
  tags: string[]
}

export interface RecognizedIngredient {
  name: string
  confidence: number
  category: string
}
