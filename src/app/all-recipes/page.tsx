'use client';

import { ChefHat } from 'lucide-react';

import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';
import { checkMultipleRecipesLiked } from '@/lib/recipe-likes';
import { loadGeneratedRecipes } from '@/lib/recipe-storage';
import { Recipe } from '@/lib/types';

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedRecipes, setLikedRecipes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const allRecipes = await loadGeneratedRecipes();
        setRecipes(allRecipes);

        // 좋아요 상태 확인
        if (allRecipes.length > 0) {
          const recipeIds = allRecipes.map((r) => r.id);
          const liked = await checkMultipleRecipesLiked(recipeIds);
          setLikedRecipes(liked);
        }
      } catch (error) {
        console.error('레시피 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return loading ? (
    <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
      <div className='text-center'>
        {/* 픽셀 로더 */}
        <div className='mx-auto mb-6 flex items-center justify-center'>
          <PixelIconBox icon={ChefHat} variant='primary' size='large' className='pixel-rotate' />
        </div>
        <p className='pixel-text text-sm text-[#5d4037]'>레시피를 불러오는 중...</p>
      </div>
    </div>
  ) : (
    <main className='min-h-screen bg-[#fafafa] py-8'>
      <div className='container mx-auto px-4'>
        {/* 페이지 헤더 */}
        <div className='mb-8 border-b-4 border-[#5d4037] pb-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
              <ChefHat className='h-6 w-6 text-white' />
            </div>
            <h1 className='pixel-text text-base text-[#5d4037]'>모든 레시피</h1>
          </div>
          <p className='text-sm text-[#5d4037]/70'>
            AI가 생성한 모든 레시피를 확인하세요 ({recipes.length}개)
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className='py-16 text-center'>
            {/* 빈 상태 아이콘 박스 */}
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <ChefHat className='h-12 w-12 text-[#5d4037]/50' />
            </div>
            <h3 className='pixel-text mb-3 text-sm text-[#5d4037]'>
              아직 생성된 레시피가 없습니다
            </h3>
            <p className='mx-auto mb-6 max-w-md text-sm text-[#5d4037]/60'>
              재료 사진을 업로드하여 첫 레시피를 만들어보세요!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} initialLiked={likedRecipes[recipe.id]} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
