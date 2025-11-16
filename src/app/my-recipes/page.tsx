'use client';

import { ChefHat, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/useLogin';
import { checkMultipleRecipesLiked } from '@/lib/recipe-likes';
import { findRecipesByUserId } from '@/lib/recipe-storage';
import { createClient } from '@/lib/supabase/client';
import { Recipe } from '@/lib/types';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedRecipes, setLikedRecipes] = useState<Record<string, boolean>>({});
  const [needsLogin, setNeedsLogin] = useState<boolean>(false);

  const router = useRouter();
  const { requestLogin, LoginDialogComponent } = useLogin();

  useEffect(() => {
    const loadMyRecipes = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // 로그인하지 않은 경우 로그인 요청
        setNeedsLogin(true);
        setLoading(false);
        requestLogin();
        return;
      }

      try {
        // 내가 만든 레시피 가져오기
        const myRecipes = await findRecipesByUserId(user.id);
        setRecipes(myRecipes);

        // 좋아요 상태 확인
        if (myRecipes.length > 0) {
          const recipeIds = myRecipes.map((r) => r.id);
          const liked = await checkMultipleRecipesLiked(recipeIds);
          setLikedRecipes(liked);
        }
      } catch (error) {
        console.error('내 레시피 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMyRecipes();
  }, [router, requestLogin]);

  if (loading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
          <h2 className='mb-2 text-xl font-semibold'>내 레시피를 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <ChefHat className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <h2 className='mb-2 text-xl font-semibold'>로그인이 필요합니다</h2>
          <p className='text-muted-foreground mb-4'>내 레시피를 보려면 로그인해주세요</p>
          <Button onClick={requestLogin}>로그인하기</Button>
        </div>
        <LoginDialogComponent />
      </div>
    );
  }

  return (
    <main className='bg-background min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <div className='mb-2 flex items-center gap-2'>
            <ChefHat className='text-primary h-8 w-8' />
            <h1 className='text-foreground text-3xl font-bold'>내 레시피</h1>
          </div>
          <p className='text-muted-foreground'>
            {recipes.length > 0
              ? `${recipes.length}개의 레시피를 만들었습니다`
              : '아직 만든 레시피가 없습니다'}
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className='py-12 text-center'>
            <ChefHat className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
            <p className='text-muted-foreground mb-4 text-lg'>
              아직 만든 레시피가 없습니다.
            </p>
            <Button onClick={() => router.push('/upload')}>새 레시피 만들기</Button>
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
