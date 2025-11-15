import { supabase } from './supabase';
import { RecognizedIngredient, Recipe } from './types';

interface EdgeFunctionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Edge Function을 통해 이미지에서 재료를 인식합니다.
 * @param imageData - base64로 인코딩된 이미지 데이터
 * @returns 인식된 재료 목록
 */
export const recognizeIngredients = async (
  imageData: string
): Promise<RecognizedIngredient[]> => {
  const { data, error } = await supabase.functions.invoke<
    EdgeFunctionResponse<RecognizedIngredient[]>
  >('recognize-ingredients', {
    body: { imageData },
  });

  if (error) {
    console.error('Error recognizing ingredients:', error);
    throw error;
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Failed to recognize ingredients');
  }

  return data.data || [];
};

/**
 * Edge Function을 통해 재료를 기반으로 레시피를 생성합니다.
 * @param ingredients - 재료 이름 배열
 * @returns 생성된 레시피 목록
 */
export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse<Recipe[]>>(
    'generate-recipes',
    {
      body: { ingredients },
    }
  );

  if (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Failed to generate recipes');
  }

  return data.data || [];
};
