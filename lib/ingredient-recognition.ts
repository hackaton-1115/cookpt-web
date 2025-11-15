import { RecognizedIngredient } from './types'

// Simulated AI ingredient recognition
export async function recognizeIngredients(
  imageData: string
): Promise<RecognizedIngredient[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock recognized ingredients based on common Korean cooking ingredients
  const mockIngredients: RecognizedIngredient[] = [
    { name: 'Egg', confidence: 0.95, category: 'Protein' },
    { name: 'Carrot', confidence: 0.92, category: 'Vegetable' },
    { name: 'Onion', confidence: 0.88, category: 'Vegetable' },
    { name: 'Green onion', confidence: 0.85, category: 'Vegetable' },
    { name: 'Garlic', confidence: 0.82, category: 'Seasoning' },
  ]

  // Randomly return 2-4 ingredients
  const count = Math.floor(Math.random() * 3) + 2
  return mockIngredients.slice(0, count)
}

// Match recipes based on recognized ingredients
export function findMatchingRecipes(
  ingredients: string[],
  allRecipes: any[]
) {
  const ingredientLower = ingredients.map((i) => i.toLowerCase())

  return allRecipes
    .map((recipe) => {
      const recipeIngredients = recipe.ingredients.map((i: any) =>
        i.name.toLowerCase()
      )
      const matchCount = ingredientLower.filter((ing) =>
        recipeIngredients.some((recIng: string) => recIng.includes(ing))
      ).length

      return {
        recipe,
        matchCount,
        matchPercentage: (matchCount / ingredientLower.length) * 100,
      }
    })
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
}
