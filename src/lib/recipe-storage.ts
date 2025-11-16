import { createClient } from './supabase/client';
import { Ingredient, NutritionInfo, Recipe } from './types';

/**
 * Supabase 클라이언트 인스턴스 가져오기
 */
const getSupabase = () => createClient();

/**
 * DB 레시피 데이터를 Recipe 타입으로 변환하는 헬퍼 함수
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertToRecipe = (recipe: any): Recipe => ({
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
});

/**
 * Supabase에서 AI 생성 레시피 불러오기 (단일 테이블 버전)
 */
export const loadGeneratedRecipes = async (): Promise<Recipe[]> => {
  try {
    const supabase = getSupabase();
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !recipes) {
      console.error('레시피 불러오기 실패:', error);
      return [];
    }

    // DB 데이터를 Recipe 타입으로 변환
    return recipes.map(convertToRecipe);
  } catch (error) {
    console.error('레시피 불러오기 실패:', error);
    return [];
  }
};

/**
 * 페이지네이션된 레시피 목록 불러오기
 * @param page 현재 페이지 번호 (1부터 시작)
 * @param pageSize 페이지당 레시피 개수
 * @returns 레시피 목록과 전체 개수
 */
export const loadRecipesPaginated = async (
  page: number = 1,
  pageSize: number = 12,
): Promise<{ recipes: Recipe[]; totalCount: number }> => {
  try {
    const supabase = getSupabase();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 전체 개수 조회
    const { count } = await supabase.from('recipes').select('*', { count: 'exact', head: true });

    // 페이지네이션된 레시피 조회
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('페이지네이션 레시피 불러오기 실패:', error);
      return { recipes: [], totalCount: 0 };
    }

    return {
      recipes: recipes?.map(convertToRecipe) || [],
      totalCount: count || 0,
    };
  } catch (error) {
    console.error('페이지네이션 레시피 불러오기 실패:', error);
    return { recipes: [], totalCount: 0 };
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

    return convertToRecipe(recipe);
  } catch (error) {
    console.error('레시피 찾기 실패:', error);
    return null;
  }
};

/**
 * 여러 ID로 레시피 목록 가져오기
 */
export const findRecipesByIds = async (ids: string[]): Promise<Recipe[]> => {
  try {
    if (ids.length === 0) {
      return [];
    }

    const supabase = getSupabase();
    const { data: recipes, error } = await supabase.from('recipes').select('*').in('id', ids);

    if (error || !recipes) {
      console.error('레시피 목록 조회 실패:', error);
      return [];
    }

    // DB 데이터를 Recipe 타입으로 변환
    return recipes.map(convertToRecipe);
  } catch (error) {
    console.error('레시피 목록 조회 실패:', error);
    return [];
  }
};

/**
 * 특정 사용자가 생성한 레시피 목록 가져오기
 */
export const findRecipesByUserId = async (userId: string): Promise<Recipe[]> => {
  try {
    const supabase = getSupabase();
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !recipes) {
      console.error('사용자 레시피 조회 실패:', error);
      return [];
    }

    // DB 데이터를 Recipe 타입으로 변환
    return recipes.map(convertToRecipe);
  } catch (error) {
    console.error('사용자 레시피 조회 실패:', error);
    return [];
  }
};
