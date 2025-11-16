'use client';

import { AlertCircle, ArrowLeft, ChefHat } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';
import { generateRecipes } from '@/lib/edge-functions';
import { checkMultipleRecipesLiked } from '@/lib/recipe-likes';
import { GenerateRecipesRequest, Recipe } from '@/lib/types';

export default function RecipesContent() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likedRecipes, setLikedRecipes] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadRecipes = async () => {
      const ingredientsParam = searchParams.get('ingredients');
      const themeParam = searchParams.get('theme');
      const cuisineParam = searchParams.get('cuisine');
      const toolsParam = searchParams.get('tools');
      const generationIdParam = searchParams.get('generationId');

      // 재료가 없으면 홈으로 리다이렉트
      if (!ingredientsParam) {
        router.push('/');
        return;
      }

      const ingredients = ingredientsParam.split(',').map((i) => i.trim());

      // 캐시 키 생성 (조건 + generationId 조합)
      const cacheKey = `recipes_${ingredientsParam}_${themeParam || ''}_${cuisineParam || ''}_${toolsParam || ''}_${generationIdParam || ''}`;

      try {
        setLoading(true);
        setError(null);

        // 1. SessionStorage에서 캐시 확인
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          console.log('캐시된 레시피 사용:', cacheKey);
          const cachedRecipes: Recipe[] = JSON.parse(cached);
          setRecipes(cachedRecipes);

          // 좋아요 상태 확인
          const recipeIds = cachedRecipes.map((r) => r.id);
          const liked = await checkMultipleRecipesLiked(recipeIds);
          setLikedRecipes(liked);
          setLoading(false);
          return;
        }

        // 2. 캐시가 없으면 AI 레시피 생성
        console.log('새로운 레시피 생성:', cacheKey);

        // 요청 객체 구성
        const request: GenerateRecipesRequest = {
          ingredients,
          theme: themeParam || undefined,
          cuisine: cuisineParam || undefined,
          tools: toolsParam ? toolsParam.split(',') : undefined,
        };

        const generatedRecipes = await generateRecipes(request);
        setRecipes(generatedRecipes);

        // 3. SessionStorage에 캐시 저장
        sessionStorage.setItem(cacheKey, JSON.stringify(generatedRecipes));

        // 좋아요 상태 확인
        const recipeIds = generatedRecipes.map((r) => r.id);
        const liked = await checkMultipleRecipesLiked(recipeIds);
        setLikedRecipes(liked);
      } catch (err) {
        console.error('레시피 생성 실패:', err);
        setError(err instanceof Error ? err.message : '레시피 생성 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [searchParams, router]);

  const ingredientsParam = searchParams.get('ingredients');
  const ingredients = ingredientsParam ? ingredientsParam.split(',').map((i) => i.trim()) : [];

  return loading ? (
    <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
      <div className='text-center'>
        {/* 픽셀 로더 박스 */}
        <div className='mx-auto mb-6 flex items-center justify-center'>
          <PixelIconBox icon={ChefHat} variant='primary' size='large' className='pixel-rotate' />
        </div>

        <h2 className='pixel-text mb-3 text-sm text-[#5d4037]'>레시피 생성 중...</h2>
        <p className='mx-auto max-w-md text-sm text-[#5d4037]/70'>
          AI가 맞춤 레시피를 만들고 있습니다 (약 30초 소요)
        </p>
      </div>
    </div>
  ) : (
    <div className='min-h-screen bg-[#fafafa]'>
      {/* 픽셀 데코레이션 */}
      <div className='pixel-rotate fixed top-20 left-10 h-8 w-8 bg-[#5d4037] opacity-20' />
      <div className='pixel-rotate fixed top-40 right-20 h-6 w-6 bg-[#5d4037] opacity-20' />
      <div className='pixel-rotate fixed bottom-20 left-1/4 h-4 w-4 bg-[#5d4037] opacity-20' />
      <div className='pixel-rotate fixed right-1/3 bottom-40 h-5 w-5 bg-[#5d4037] opacity-20' />

      {/* 헤더 */}
      <div className='sticky top-0 z-50 border-b-4 border-[#5d4037] bg-[#ffe0e0] p-6'>
        <div className='mx-auto max-w-7xl'>
          {/* 백 버튼 */}
          <button
            onClick={() => router.push('/recognize')}
            className='mb-4 flex cursor-pointer items-center gap-2 border-2 border-[#5d4037] bg-white px-4 py-2 text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
          >
            <ArrowLeft className='h-5 w-5' />
            <span className='text-sm'>돌아가기</span>
          </button>

          {/* 타이틀 & 카운터 */}
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='pixel-text mb-2 text-xl text-[#5d4037]'>AI 맞춤 레시피 추천</h1>
              {ingredients.length > 0 && (
                <p className='text-sm text-[#5d4037]/70'>재료: {ingredients.join(', ')}</p>
              )}
            </div>

            {!error && recipes.length > 0 && (
              <div className='pixel-text border-2 border-[#5d4037] bg-[#ff5252] px-4 py-2 text-xs text-white shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
                총 {recipes.length}개
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className='mx-auto max-w-7xl p-6'>
        {/* 에러 상태 */}
        {error && (
          <div className='mb-6 border-4 border-[#5d4037] bg-[#ffe0e0] p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
            <div className='flex items-start gap-4'>
              {/* 에러 아이콘 박스 */}
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
                <AlertCircle className='h-6 w-6 text-white' />
              </div>

              <div className='flex-1'>
                <h3 className='pixel-text mb-3 text-xs text-[#5d4037]'>레시피 생성 실패</h3>
                <p className='mb-4 text-sm text-[#5d4037]/70'>{error}</p>

                <div className='flex flex-wrap gap-3'>
                  <button
                    onClick={() => router.push('/recognize')}
                    className='border-2 border-[#5d4037] bg-white px-4 py-2 text-sm text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                  >
                    조건 다시 설정
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className='pixel-button border-2 border-[#5d4037] bg-[#ff5252] px-4 py-2 text-sm text-white shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 레시피 그리드 */}
        {!error && recipes.length > 0 && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} initialLiked={likedRecipes[recipe.id]} />
            ))}
          </div>
        )}

        {/* 레시피 없음 */}
        {!error && recipes.length === 0 && (
          <div className='py-16 text-center'>
            {/* 아이콘 박스 */}
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <ChefHat className='h-12 w-12 text-[#5d4037]/50' />
            </div>

            <h3 className='pixel-text mb-3 text-sm text-[#5d4037]'>아직 레시피가 없습니다</h3>
            <p className='mx-auto mb-6 max-w-md text-sm text-[#5d4037]/60'>
              재료를 다시 선택하고 첫 번째 레시피를 생성해보세요!
            </p>

            <button
              onClick={() => router.push('/recognize')}
              className='pixel-button inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-6 py-3 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
            >
              <ArrowLeft className='h-5 w-5' />
              <span className='pixel-text text-xs'>재료 선택으로 돌아가기</span>
            </button>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className='mt-12 border-t-4 border-[#5d4037] bg-[#ffe0e0] py-6'>
        <div className='mx-auto max-w-7xl px-6 text-center text-sm text-[#5d4037]/70'>
          <p>© 2025 CookPT • AI 기반 맞춤 레시피</p>
        </div>
      </footer>
    </div>
  );
}
