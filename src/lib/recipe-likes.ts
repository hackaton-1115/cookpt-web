import { supabase } from './supabase';

/**
 * 세션 ID 생성 또는 가져오기 (익명 사용자용)
 */
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

/**
 * 레시피 좋아요 토글
 */
export const toggleRecipeLike = async (recipeId: string): Promise<boolean> => {
  try {
    // 현재 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || null;
    const sessionId = userId ? null : getSessionId();

    // 이미 좋아요 했는지 확인
    const { data: existingLike } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId)
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
        session_id: sessionId,
      });
      return true;
    }
  } catch (error) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};

/**
 * 레시피 좋아요 상태 확인
 */
export const checkRecipeLiked = async (recipeId: string): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || null;
    const sessionId = userId ? null : getSessionId();

    const { data } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error);
    return false;
  }
};

/**
 * 여러 레시피의 좋아요 상태 한 번에 확인
 */
export const checkMultipleRecipesLiked = async (
  recipeIds: string[]
): Promise<Record<string, boolean>> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || null;
    const sessionId = userId ? null : getSessionId();

    const { data } = await supabase
      .from('recipe_likes')
      .select('recipe_id')
      .in('recipe_id', recipeIds)
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId);

    const likedMap: Record<string, boolean> = {};
    recipeIds.forEach((id) => {
      likedMap[id] = false;
    });

    data?.forEach((like) => {
      likedMap[like.recipe_id] = true;
    });

    return likedMap;
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error);
    return {};
  }
};
