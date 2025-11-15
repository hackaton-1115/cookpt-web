import { Recipe } from './types'
import { Zap, Microwave, Clock, Leaf, Flame, UtensilsCrossed } from 'lucide-react'

export interface RecipeTheme {
  id: string
  title: string
  description: string
  icon: any
  filterFn: (recipe: Recipe) => boolean
}

export const RECIPE_THEMES: RecipeTheme[] = [
  {
    id: 'microwave-only',
    title: 'Microwave Only',
    description: 'Recipes you can make with just a microwave',
    icon: Microwave,
    filterFn: (recipe) => {
      // Recipes that don't require wok, pan, or pot (no stovetop)
      const hasStove = recipe.cookingTools.some((tool) =>
        ['wok', 'pan', 'pot'].includes(tool)
      )
      return !hasStove
    },
  },
  {
    id: 'quick-meals',
    title: 'Quick & Easy',
    description: 'Ready in 20 minutes or less',
    icon: Zap,
    filterFn: (recipe) => recipe.prepTime + recipe.cookTime <= 20,
  },
  {
    id: 'under-30',
    title: '30-Minute Meals',
    description: 'Delicious dishes in half an hour',
    icon: Clock,
    filterFn: (recipe) =>
      recipe.prepTime + recipe.cookTime > 20 &&
      recipe.prepTime + recipe.cookTime <= 30,
  },
  {
    id: 'vegetarian',
    title: 'Vegetarian Friendly',
    description: 'Plant-based Korean recipes',
    icon: Leaf,
    filterFn: (recipe) => recipe.tags.includes('vegetarian'),
  },
  {
    id: 'no-cook',
    title: 'No Cooking Required',
    description: 'Fresh recipes with no heat needed',
    icon: UtensilsCrossed,
    filterFn: (recipe) => recipe.cookTime === 0 || recipe.tags.includes('no-cook'),
  },
  {
    id: 'spicy',
    title: 'Spicy Favorites',
    description: 'For those who love heat',
    icon: Flame,
    filterFn: (recipe) => recipe.tags.includes('spicy'),
  },
]

export function getRecipesByTheme(
  themeId: string,
  recipes: Recipe[]
): Recipe[] {
  const theme = RECIPE_THEMES.find((t) => t.id === themeId)
  if (!theme) return []
  return recipes.filter(theme.filterFn)
}

export function getAllThemedRecipes(recipes: Recipe[]) {
  return RECIPE_THEMES.map((theme) => ({
    theme,
    recipes: recipes.filter(theme.filterFn),
  }))
}
