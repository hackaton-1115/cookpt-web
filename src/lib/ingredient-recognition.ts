import { recognizeIngredients as recognizeIngredientsEdge } from './edge-functions';
import { Recipe, RecognizedIngredient } from './types';

// Supabase Edge Function을 사용한 AI 재료 인식
export const recognizeIngredients = async (imageData: string): Promise<RecognizedIngredient[]> => {
  try {
    const ingredients = await recognizeIngredientsEdge(imageData);
    // category 필드가 없으면 기본값 추가
    return ingredients.map((ing) => ({
      ...ing,
      category: (ing as RecognizedIngredient).category || 'Other',
    }));
  } catch (error) {
    console.error('재료 인식 오류:', error);
    throw error instanceof Error
      ? error
      : new Error('재료 인식 중 알 수 없는 오류가 발생했습니다.');
  }
};

// 인식된 재료를 기반으로 레시피 매칭
export const findMatchingRecipes = (ingredients: string[], allRecipes: Recipe[]) => {
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
};
