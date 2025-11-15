'use client';

import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { generateRecipes } from '@/lib/edge-functions';
import { checkMultipleRecipesLiked } from '@/lib/recipe-likes';
import { loadGeneratedRecipes } from '@/lib/recipe-storage';
import { Recipe } from '@/lib/types';

export default function RecipesContent() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likedRecipes, setLikedRecipes] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const ingredientsParam = searchParams.get('ingredients');

  useEffect(() => {
    const loadRecipes = async () => {
      // 재료가 없으면 홈으로 리다이렉트
      if (!ingredientsParam) {
        router.push('/');
        return;
      }

      const ingredients = ingredientsParam.split(',').map((i) => i.trim());

      // 기존에 생성된 레시피가 있는지 확인
      const existingRecipes = await loadGeneratedRecipes();
      if (existingRecipes.length > 0) {
        // 이미 생성된 레시피가 있으면 재사용
        setRecipes(existingRecipes);

        // 좋아요 상태 확인
        const recipeIds = existingRecipes.map((r) => r.id);
        const liked = await checkMultipleRecipesLiked(recipeIds);
        setLikedRecipes(liked);

        setLoading(false);
        return;
      }

      // AI 레시피 생성 (Edge Function에서 DB 저장까지 처리)
      try {
        const generatedRecipes = await generateRecipes(ingredients);
        setRecipes(generatedRecipes);

        // 좋아요 상태 확인
        const recipeIds = generatedRecipes.map((r) => r.id);
        const liked = await checkMultipleRecipesLiked(recipeIds);
        setLikedRecipes(liked);

        setLoading(false);
      } catch (err) {
        console.error('레시피 생성 실패:', err);
        setError(err instanceof Error ? err.message : '레시피 생성 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    loadRecipes();
  }, [ingredientsParam, router]);

  const ingredients = ingredientsParam ? ingredientsParam.split(',').map((i) => i.trim()) : [];

  return loading ? (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
        <h2 className='mb-2 text-xl font-semibold'>AI가 맞춤 레시피를 생성하고 있습니다</h2>
        <p className='text-muted-foreground'>약 15초 소요됩니다...</p>
      </div>
    </div>
  ) : (
    <main className='bg-background min-h-screen'>
      <div className='container mx-auto px-4 py-6 sm:px-6 sm:py-8'>
        {/* 헤더 */}
        <div className='mb-4 flex items-center justify-between sm:mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.push('/recognize')}
            size='sm'
            className='sm:size-default'
          >
            <ArrowLeft className='mr-1 h-4 w-4 sm:mr-2' />
            Back
          </Button>
        </div>

        {/* 에러 상태 */}
        {error && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>레시피 생성 실패</AlertTitle>
            <AlertDescription className='mt-2 flex flex-col gap-3'>
              <p>{error}</p>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' onClick={() => window.location.reload()}>
                  다시 시도
                </Button>
                <Button variant='outline' size='sm' onClick={() => router.push('/recognize')}>
                  재료 선택으로 돌아가기
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 타이틀 섹션 */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-foreground mb-2 text-2xl font-bold sm:mb-3 sm:text-3xl'>
            AI 맞춤 레시피 추천
          </h1>
          {ingredients.length > 0 && (
            <p className='text-muted-foreground text-sm sm:text-base'>
              재료: {ingredients.join(', ')}
            </p>
          )}
        </div>

        {/* 레시피 그리드 */}
        {!error && recipes.length > 0 && (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} initialLiked={likedRecipes[recipe.id]} />
            ))}
          </div>
        )}

        {/* 레시피 없음 */}
        {!error && recipes.length === 0 && (
          <div className='py-12 text-center'>
            <p className='text-muted-foreground text-lg'>생성된 레시피가 없습니다.</p>
            <Button variant='outline' onClick={() => router.push('/recognize')} className='mt-4'>
              재료 선택으로 돌아가기
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
