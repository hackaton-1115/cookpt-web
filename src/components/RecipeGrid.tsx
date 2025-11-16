'use client';

import { ChefHat } from 'lucide-react';

import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { checkMultipleRecipesLiked } from '@/lib/recipe-likes';
import { Recipe } from '@/lib/types';

interface RecipeGridProps {
  recipes: Recipe[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  const [likedRecipes, setLikedRecipes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchLikedStatus = async () => {
      // 좋아요 상태 확인
      if (recipes.length > 0) {
        const recipeIds = recipes.map((r) => r.id);
        const liked = await checkMultipleRecipesLiked(recipeIds);
        setLikedRecipes(liked);
      }
    };

    fetchLikedStatus();
  }, [recipes]);

  if (recipes.length === 0) {
    return (
      <div className='py-16 text-center'>
        {/* 빈 상태 아이콘 박스 */}
        <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
          <ChefHat className='h-12 w-12 text-[#5d4037]/50' />
        </div>
        <h3 className='pixel-text mb-3 text-sm text-[#5d4037]'>아직 생성된 레시피가 없습니다</h3>
        <p className='mx-auto mb-6 max-w-md text-sm text-[#5d4037]/60'>
          재료 사진을 업로드하여 첫 레시피를 만들어보세요!
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} initialLiked={likedRecipes[recipe.id]} />
      ))}
    </div>
  );
}
