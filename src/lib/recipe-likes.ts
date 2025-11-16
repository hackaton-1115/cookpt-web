import { createClient } from './supabase/client';

/**
 * Supabase 클라이언트 인스턴스 가져오기
 */
const getSupabase = () => createClient();

/**
 * 레시피 좋아요 토글 (로그인 필수)
 */
export const toggleRecipeLike = async (recipeId: string): Promise<boolean> => {
  try {
    const supabase = getSupabase();

    // 현재 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    const userId = user.id;

    // 이미 좋아요 했는지 확인
    const { data: existingLike } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLike) {
      // 좋아요 취소
      await supabase.from('recipe_likes').delete().eq('id', existingLike.id);
      return false;
    } else {
      // 좋아요 추가
      await supabase.from('recipe_likes').insert({
        recipe_id: recipeId,
        user_id: userId,
      });
      return true;
    }
  } catch (error) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};

/**
 * 레시피 좋아요 상태 확인 (로그인 필수)
 */
export const checkRecipeLiked = async (recipeId: string): Promise<boolean> => {
  try {
    const supabase = getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', user.id)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error);
    return false;
  }
};

/**
 * 여러 레시피의 좋아요 상태 한 번에 확인 (로그인 필수)
 */
export const checkMultipleRecipesLiked = async (
  recipeIds: string[]
): Promise<Record<string, boolean>> => {
  try {
    const supabase = getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const likedMap: Record<string, boolean> = {};
    recipeIds.forEach((id) => {
      likedMap[id] = false;
    });

    if (!user) {
      return likedMap;
    }

    const { data } = await supabase
      .from('recipe_likes')
      .select('recipe_id')
      .in('recipe_id', recipeIds)
      .eq('user_id', user.id);

    data?.forEach((like) => {
      likedMap[like.recipe_id] = true;
    });

    return likedMap;
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error);
    return {};
  }
};

/**
 * 사용자가 좋아요한 레시피 ID 목록 가져오기 (로그인 필수)
 */
export const getLikedRecipeIds = async (): Promise<string[]> => {
  try {
    const supabase = getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data } = await supabase
      .from('recipe_likes')
      .select('recipe_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return data?.map((like) => like.recipe_id) || [];
  } catch (error) {
    console.error('좋아요한 레시피 목록 조회 실패:', error);
    return [];
  }
};
