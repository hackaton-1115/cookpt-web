import { Recipe } from './types';

const STORAGE_KEY = 'ai-generated-recipes';

/**
 * AI 생성 레시피를 sessionStorage에 저장
 */
export const saveGeneratedRecipes = (recipes: Recipe[]): void => {
  try {
    if (typeof window === 'undefined') return; // SSR 체크
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('레시피 저장 실패:', error);
  }
};

/**
 * sessionStorage에서 AI 생성 레시피 불러오기
 */
export const loadGeneratedRecipes = (): Recipe[] => {
  try {
    if (typeof window === 'undefined') return []; // SSR 체크
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('레시피 불러오기 실패:', error);
    return [];
  }
};

/**
 * ID로 특정 레시피 찾기 (AI 생성 레시피에서만 검색)
 */
export const findRecipeById = (id: string): Recipe | null => {
  const generatedRecipes = loadGeneratedRecipes();
  const recipe = generatedRecipes.find((r) => r.id === id);
  return recipe || null;
};

/**
 * sessionStorage 초기화
 */
export const clearGeneratedRecipes = (): void => {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('레시피 삭제 실패:', error);
  }
};
