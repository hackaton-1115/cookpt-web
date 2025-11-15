import { createClient } from './supabase/client';
import { Ingredient, NutritionInfo, Recipe } from './types';

/**
 * Supabase 클라이언트 인스턴스 가져오기
 */
const getSupabase = () => createClient();

/**
 * Supabase에서 AI 생성 레시피 불러오기 (단일 테이블 버전)
 */
export const loadGeneratedRecipes = async (): Promise<Recipe[]> => {
  try {
    const supabase = getSupabase();
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !recipes) {
      console.error('레시피 불러오기 실패:', error);
      return [];
    }

    // DB 데이터를 Recipe 타입으로 변환
    return recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.image_url || '/placeholder-recipe.jpg',
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
      servings: recipe.servings,
      difficulty: recipe.difficulty as 'easy' | 'medium' | 'hard',
      ingredients: (recipe.ingredients as unknown as Ingredient[]) || [],
      instructions: recipe.instructions || [],
      nutrition: (recipe.nutrition as unknown as NutritionInfo) || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      category: recipe.category,
      cookingTools: recipe.cooking_tools || [],
      tags: recipe.tags || [],
      likesCount: recipe.likes_count || 0,
    }));
  } catch (error) {
    console.error('레시피 불러오기 실패:', error);
    return [];
  }
};

/**
 * ID로 특정 레시피 찾기 (단일 테이블 버전)
 */
export const findRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const supabase = getSupabase();
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('레시피 찾기 에러:', error);
      console.error('에러 코드:', error.code);
      console.error('에러 메시지:', error.message);
      console.error('에러 상세:', error.details);
      return null;
    }

    if (!recipe) {
      console.error('레시피를 찾을 수 없음. ID:', id);
      return null;
    }

    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.image_url || '/placeholder-recipe.jpg',
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
      servings: recipe.servings,
      difficulty: recipe.difficulty as 'easy' | 'medium' | 'hard',
      ingredients: (recipe.ingredients as unknown as Ingredient[]) || [],
      instructions: recipe.instructions || [],
      nutrition: (recipe.nutrition as unknown as NutritionInfo) || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      category: recipe.category,
      cookingTools: recipe.cooking_tools || [],
      tags: recipe.tags || [],
      likesCount: recipe.likes_count || 0,
    };
  } catch (error) {
    console.error('레시피 찾기 실패:', error);
    return null;
  }
};

