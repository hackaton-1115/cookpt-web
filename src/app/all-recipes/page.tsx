'use client';

import { Loader2 } from 'lucide-react';

import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { loadGeneratedRecipes } from '@/lib/recipe-storage';
import { Recipe } from '@/lib/types';

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const allRecipes = await loadGeneratedRecipes();
        setRecipes(allRecipes);
      } catch (error) {
        console.error('레시피 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return loading ? (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
        <h2 className='mb-2 text-xl font-semibold'>레시피를 불러오는 중...</h2>
      </div>
    </div>
  ) : (
    <main className='bg-background min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-foreground mb-2 text-3xl font-bold'>모든 레시피</h1>
          <p className='text-muted-foreground'>
            AI가 생성한 모든 레시피를 확인하세요 ({recipes.length}개)
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className='text-muted-foreground py-12 text-center'>
            <p className='mb-4 text-lg'>아직 생성된 레시피가 없습니다.</p>
            <p>재료 사진을 업로드하여 첫 레시피를 만들어보세요!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
