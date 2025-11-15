import { Recipe, RecognizedIngredient, RecognizeImageResponse } from './types';

// AI ingredient recognition using OpenAI Vision API
export async function recognizeIngredients(imageData: string): Promise<RecognizedIngredient[]> {
  try {
    const response = await fetch('/api/recognize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: RecognizeImageResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || '재료 인식에 실패했습니다.');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error recognizing ingredients:', error);
    throw error instanceof Error
      ? error
      : new Error('재료 인식 중 알 수 없는 오류가 발생했습니다.');
  }
}

// Match recipes based on recognized ingredients
export function findMatchingRecipes(ingredients: string[], allRecipes: Recipe[]) {
  const ingredientLower = ingredients.map((i) => i.toLowerCase());

  return allRecipes
    .map((recipe) => {
      const recipeIngredients = recipe.ingredients.map((i) => i.name.toLowerCase());
      const matchCount = ingredientLower.filter((ing) =>
        recipeIngredients.some((recIng: string) => recIng.includes(ing)),
      ).length;

      return {
        recipe,
        matchCount,
        matchPercentage: (matchCount / ingredientLower.length) * 100,
      };
    })
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
}
