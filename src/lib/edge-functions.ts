import { supabase } from './supabase';
import { GenerateRecipesRequest, RecognizedIngredient, Recipe } from './types';

interface EdgeFunctionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Edge Function을 통해 이미지에서 재료를 인식합니다.
 * @param imageDataOrUrl - base64로 인코딩된 이미지 데이터 또는 Supabase Storage URL
 * @returns 인식된 재료 목록
 */
export const recognizeIngredients = async (
  imageDataOrUrl: string,
): Promise<RecognizedIngredient[]> => {
  // URL인지 base64인지 판단
  const isUrl = imageDataOrUrl.startsWith('http://') || imageDataOrUrl.startsWith('https://');

  const { data, error } = await supabase.functions.invoke<
    EdgeFunctionResponse<RecognizedIngredient[]>
  >('recognize-ingredients', {
    body: isUrl ? { imageUrl: imageDataOrUrl } : { imageData: imageDataOrUrl },
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
 * API Route를 통해 재료를 기반으로 레시피를 생성합니다.
 * @param request - 레시피 생성 요청 (재료, 테마, 국적, 조리 도구)
 * @returns 생성된 레시피 목록
 */
export const generateRecipes = async (request: GenerateRecipesRequest): Promise<Recipe[]> => {
  // 유효성 검사
  if (!request.ingredients || request.ingredients.length === 0) {
    throw new Error('재료를 최소 1개 이상 선택해주세요.');
  }

  try {
    const response = await fetch('/api/generate-recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || '레시피 생성 중 오류가 발생했습니다.');
    }

    const data: EdgeFunctionResponse<Recipe[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || '레시피를 생성할 수 없습니다.');
    }

    // 빈 응답 처리
    if (!data.data || data.data.length === 0) {
      throw new Error('조건에 맞는 레시피를 찾을 수 없습니다. 조건을 완화해보세요.');
    }

    return data.data;
  } catch (error) {
    console.error('API 호출 실패:', error);

    if (error instanceof Error) {
      // 네트워크 에러
      if (error.message?.includes('fetch') || error.message?.includes('NetworkError')) {
        throw new Error('네트워크 연결을 확인해주세요.');
      }

      // 타임아웃
      if (error.message?.includes('timeout')) {
        throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
      }

      throw error;
    }

    throw new Error('레시피 생성 중 오류가 발생했습니다.');
  }
};
