import { GenerateRecipesResponse, Recipe } from './types';

/**
 * OpenAI를 사용하여 재료 기반 레시피 생성
 * @param ingredients - 재료 목록
 * @returns 생성된 레시피 배열
 */
export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const response = await fetch('/api/generate-recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    const result: GenerateRecipesResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || '레시피 생성에 실패했습니다.');
    }

    return result.data || [];
  } catch (error) {
    console.error('레시피 생성 오류:', error);
    throw error instanceof Error
      ? error
      : new Error('레시피 생성 중 알 수 없는 오류가 발생했습니다.');
  }
};
