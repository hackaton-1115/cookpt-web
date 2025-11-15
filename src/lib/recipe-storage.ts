import { Database } from './database.types';
import { supabase } from './supabase';
import { Ingredient, NutritionInfo, Recipe } from './types';

type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];

/**
 * base64 이미지를 Supabase Storage에 업로드
 */
const uploadImageToStorage = async (base64Image: string, recipeId: string): Promise<string> => {
  try {
    // base64를 blob으로 변환
    const base64Data = base64Image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Supabase Storage에 업로드
    const fileName = `${recipeId}-${Date.now()}.png`;
    const { error } = await supabase.storage.from('recipe-images').upload(fileName, blob, {
      contentType: 'image/png',
      upsert: true,
    });

    if (error) {
      console.error('이미지 업로드 실패:', error);
      return '/placeholder-recipe.jpg';
    }

    // Public URL 생성
    const { data: urlData } = supabase.storage.from('recipe-images').getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return '/placeholder-recipe.jpg';
  }
};

/**
 * AI 생성 레시피를 Supabase에 저장 (단일 테이블 버전)
 */
export const saveGeneratedRecipes = async (recipes: Recipe[]): Promise<void> => {
  try {
    for (const recipe of recipes) {
      // 이미지가 base64인 경우 Storage에 업로드
      let imageUrl = recipe.image;
      if (recipe.image.startsWith('data:')) {
        imageUrl = await uploadImageToStorage(recipe.image, recipe.id);
      }

      // 레시피 전체 데이터를 단일 테이블에 저장
      const { error } = await supabase.from('recipes').upsert({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        image_url: imageUrl,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        category: recipe.category,
        ingredients: recipe.ingredients as unknown as RecipeInsert['ingredients'],
        instructions: recipe.instructions,
        nutrition: recipe.nutrition as unknown as RecipeInsert['nutrition'],
        cooking_tools: recipe.cookingTools,
        tags: recipe.tags,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('레시피 저장 실패:', error);
        continue;
      }
    }
  } catch (error) {
    console.error('레시피 저장 실패:', error);
    throw error;
  }
};

/**
 * Supabase에서 AI 생성 레시피 불러오기 (단일 테이블 버전)
 */
export const loadGeneratedRecipes = async (): Promise<Recipe[]> => {
  try {
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
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !recipe) {
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
    };
  } catch (error) {
    console.error('레시피 찾기 실패:', error);
    return null;
  }
};

/**
 * 레시피 삭제
 */
export const clearGeneratedRecipes = async (): Promise<void> => {
  try {
    const { error } = await supabase.from('recipes').delete().neq('id', '');
    if (error) {
      console.error('레시피 삭제 실패:', error);
    }
  } catch (error) {
    console.error('레시피 삭제 실패:', error);
  }
};
