'use client';

import { ArrowLeft, ChefHat, Clock, Flame, Heart, Users } from 'lucide-react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PixelIconBox } from '@/components/ui/pixel-icon-box';
import { useLogin } from '@/hooks/useLogin';
import { checkRecipeLiked, toggleRecipeLike } from '@/lib/recipe-likes';
import { findRecipeById } from '@/lib/recipe-storage';
import { createClient } from '@/lib/supabase/client';
import { Recipe } from '@/lib/types';

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();
  const { requestLogin, LoginDialogComponent } = useLogin();

  useEffect(() => {
    const loadRecipe = async () => {
      // URL 디코딩 (한글 ID 처리)
      const id = decodeURIComponent(params.id as string);

      // 로그인 상태 확인
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      // Supabase에서 AI 생성 레시피 찾기
      const aiRecipe = await findRecipeById(id);
      setRecipe(aiRecipe);
      setLikesCount(aiRecipe?.likesCount || 0);

      // 좋아요 상태 확인
      if (aiRecipe) {
        const isLiked = await checkRecipeLiked(id);
        setLiked(isLiked);
      }

      setLoading(false);
    };

    loadRecipe();
  }, [params.id]);

  const handleLikeClick = async () => {
    if (!recipe || isLiking) return;

    // 로그인하지 않은 경우 로그인 요청
    if (!isLoggedIn) {
      requestLogin();
      return;
    }

    setIsLiking(true);
    try {
      const newLiked = await toggleRecipeLike(recipe.id);
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('좋아요 실패:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const totalTime = recipe ? recipe.prepTime + recipe.cookTime : 0;

  return loading ? (
    <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
      <div className='text-center'>
        {/* 픽셀 로더 박스 */}
        <div className='mx-auto mb-6 flex items-center justify-center'>
          <PixelIconBox icon={ChefHat} variant='primary' size='large' className='pixel-rotate' />
        </div>

        <p className='pixel-text text-sm text-[#5d4037]'>레시피를 불러오는 중...</p>
      </div>
    </div>
  ) : !recipe ? (
    <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
      <div className='max-w-md text-center'>
        {/* 에러 아이콘 박스 */}
        <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
          <ChefHat className='h-12 w-12 text-[#5d4037]/50' />
        </div>
        <h2 className='pixel-text mb-3 text-sm text-[#5d4037]'>레시피를 찾을 수 없습니다</h2>
        <p className='mb-6 text-sm text-[#5d4037]/60'>요청하신 레시피가 존재하지 않습니다.</p>
        <button
          onClick={() => router.push('/recipes')}
          className='pixel-button inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
        >
          <span className='pixel-text text-xs'>레시피 목록으로 돌아가기</span>
        </button>
      </div>
    </div>
  ) : (
    <div className='min-h-screen bg-[#fafafa]'>
      {/* 헤더 */}
      <div className='border-b-4 border-[#5d4037] bg-[#ffe0e0] p-6'>
        <div className='mx-auto max-w-4xl'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 border-2 border-[#5d4037] bg-white px-4 py-2 text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
          >
            <ArrowLeft className='h-4 w-4' />
            <span className='pixel-text text-xs'>뒤로</span>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className='mx-auto max-w-4xl px-6 py-8'>
        {/* 메인 이미지 카드 */}
        <div className='mb-8 border-4 border-[#5d4037] bg-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
          {/* 이미지 */}
          <div className='relative h-96 border-b-4 border-[#5d4037]'>
            {recipe.image &&
            recipe.image.trim() !== '' &&
            !recipe.image.includes('/placeholder') &&
            !imageError ? (
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className='object-cover'
                style={{ imageRendering: 'pixelated' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-[#ff5252]'>
                <ChefHat className='h-24 w-24 text-white' strokeWidth={2} />
              </div>
            )}
            {/* 카테고리 배지 */}
            <div className='absolute top-4 right-4 border-2 border-[#5d4037] bg-white px-4 py-2 text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
              <span className='pixel-text text-xs'>{recipe.category}</span>
            </div>
          </div>

          {/* 카드 콘텐츠 */}
          <div className='p-6'>
            {/* 제목 */}
            <h1 className='pixel-text mb-4 text-sm text-[#5d4037]'>{recipe.title}</h1>

            {/* 설명 */}
            <p className='mb-6 text-sm text-[#5d4037]/70'>{recipe.description}</p>

            {/* 통계 */}
            <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='flex items-center gap-2 text-[#5d4037]'>
                <Clock className='h-5 w-5' />
                <div>
                  <p className='text-xs text-[#5d4037]/60'>시간</p>
                  <p className='text-sm font-semibold'>{totalTime}분</p>
                </div>
              </div>
              <div className='flex items-center gap-2 text-[#5d4037]'>
                <Users className='h-5 w-5' />
                <div>
                  <p className='text-xs text-[#5d4037]/60'>인분</p>
                  <p className='text-sm font-semibold'>{recipe.servings}인분</p>
                </div>
              </div>
              <div className='flex items-center gap-2 text-[#5d4037]'>
                <ChefHat className='h-5 w-5' />
                <div>
                  <p className='text-xs text-[#5d4037]/60'>난이도</p>
                  <p className='text-sm font-semibold'>{difficultyLabels[recipe.difficulty]}</p>
                </div>
              </div>
              <div className='flex items-center gap-2 text-[#5d4037]'>
                <Flame className='h-5 w-5' />
                <div>
                  <p className='text-xs text-[#5d4037]/60'>칼로리</p>
                  <p className='text-sm font-semibold'>{recipe.nutrition.calories} kcal</p>
                </div>
              </div>
            </div>

            {/* 태그 */}
            <div className='mb-6 flex flex-wrap gap-2'>
              {recipe.tags.map((tag) => (
                <div
                  key={tag}
                  className='border-2 border-[#5d4037] bg-[#ffe0e0] px-3 py-1 text-sm text-[#5d4037]'
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* 좋아요 버튼 */}
            <button
              onClick={handleLikeClick}
              disabled={isLiking}
              className='pixel-button flex items-center gap-2 border-2 border-[#5d4037] bg-[#ff5252] px-4 py-2 text-white shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-white' : ''}`} />
              <span className='pixel-text text-xs'>{likesCount}</span>
            </button>
          </div>
        </div>

        {/* 그리드 레이아웃 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* 재료 섹션 */}
          <div className='self-start border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
            <h2 className='pixel-text mb-4 text-xs text-[#5d4037]'>재료</h2>
            <ul className='space-y-2'>
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className='flex justify-between border-b border-[#5d4037]/20 pb-2 text-sm text-[#5d4037]'
                >
                  <span>{ingredient.name}</span>
                  <span className='text-[#5d4037]/60'>
                    {ingredient.amount}
                    {ingredient.unit ? ` ${ingredient.unit}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 조리법 섹션 */}
          <div className='md:col-span-2'>
            <div className='mb-6 border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <h2 className='pixel-text mb-4 text-xs text-[#5d4037]'>조리법</h2>
              <ol className='space-y-4'>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className='flex gap-4'>
                    <span className='flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] text-white'>
                      <span className='pixel-text text-xs'>{index + 1}</span>
                    </span>
                    <p className='flex-1 pt-1 text-sm text-[#5d4037]'>{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* 영양정보 */}
            <div className='mb-6 border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <h2 className='pixel-text mb-2 text-xs text-[#5d4037]'>영양 정보</h2>
              <p className='mb-4 text-xs text-[#5d4037]/60'>
                1인분 기준 (총 {recipe.servings}인분)
              </p>
              <div className='space-y-3'>
                <div className='flex items-center justify-between border-b border-[#5d4037]/20 pb-2'>
                  <span className='text-sm text-[#5d4037]'>칼로리</span>
                  <span className='text-sm font-bold text-[#5d4037]'>
                    {recipe.nutrition.calories} kcal
                  </span>
                </div>
                <div className='flex items-center justify-between border-b border-[#5d4037]/20 pb-2'>
                  <span className='text-sm text-[#5d4037]'>단백질</span>
                  <span className='text-sm font-bold text-[#5d4037]'>
                    {recipe.nutrition.protein}g
                  </span>
                </div>
                <div className='flex items-center justify-between border-b border-[#5d4037]/20 pb-2'>
                  <span className='text-sm text-[#5d4037]'>탄수화물</span>
                  <span className='text-sm font-bold text-[#5d4037]'>
                    {recipe.nutrition.carbs}g
                  </span>
                </div>
                <div className='flex items-center justify-between border-b border-[#5d4037]/20 pb-2'>
                  <span className='text-sm text-[#5d4037]'>지방</span>
                  <span className='text-sm font-bold text-[#5d4037]'>{recipe.nutrition.fat}g</span>
                </div>
                <div className='flex items-center justify-between border-b border-[#5d4037]/20 pb-2'>
                  <span className='text-sm text-[#5d4037]'>식이섬유</span>
                  <span className='text-sm font-bold text-[#5d4037]'>
                    {recipe.nutrition.fiber}g
                  </span>
                </div>
              </div>
            </div>

            {/* 조리 도구 */}
            <div className='mb-6 border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <h2 className='pixel-text mb-4 text-xs text-[#5d4037]'>조리 도구</h2>
              <div className='flex flex-wrap gap-2'>
                {recipe.cookingTools.map((tool) => (
                  <div
                    key={tool}
                    className='border-2 border-[#5d4037] bg-white px-3 py-1 text-sm text-[#5d4037] capitalize'
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </div>

            {/* 조리 시간 */}
            <div className='border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <h2 className='pixel-text mb-4 text-xs text-[#5d4037]'>조리 시간</h2>
              <div className='space-y-3'>
                <div className='flex items-center justify-between border-b border-[#5d4037]/20 pb-2'>
                  <span className='text-sm text-[#5d4037]/60'>준비 시간</span>
                  <span className='text-sm font-semibold text-[#5d4037]'>{recipe.prepTime}분</span>
                </div>
                <div className='flex items-center justify-between border-b border-[#5d4037]/20 pb-2'>
                  <span className='text-sm text-[#5d4037]/60'>조리 시간</span>
                  <span className='text-sm font-semibold text-[#5d4037]'>{recipe.cookTime}분</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-semibold text-[#5d4037]'>총 시간</span>
                  <span className='text-sm font-bold text-[#ff5252]'>{totalTime}분</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 로그인 다이얼로그 */}
      <LoginDialogComponent />
    </div>
  );
}
