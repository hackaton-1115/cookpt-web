'use client';

import { Heart, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoginRequired } from '@/components/LoginRequired';
import { RecipeCard } from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/useLogin';
import { getLikedRecipeIds } from '@/lib/recipe-likes';
import { findRecipesByIds } from '@/lib/recipe-storage';
import { createClient } from '@/lib/supabase/client';
import { Recipe } from '@/lib/types';

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();
  const { requestLogin, LoginDialogComponent } = useLogin();

  useEffect(() => {
    const checkAuthAndLoadFavorites = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);

      try {
        // 좋아요한 레시피 ID 가져오기
        const likedIds = await getLikedRecipeIds();

        if (likedIds.length > 0) {
          // ID로 레시피 조회
          const likedRecipes = await findRecipesByIds(likedIds);
          setRecipes(likedRecipes);
        }
      } catch (error) {
        console.error('좋아요 레시피 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadFavorites();
  }, []);

  return loading ? (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
        <h2 className='mb-2 text-xl font-semibold'>좋아요한 레시피를 불러오는 중...</h2>
      </div>
    </div>
  ) : (
    <main className='bg-background min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <div className='mb-2 flex items-center gap-2'>
            <Heart className='h-8 w-8 fill-red-500 text-red-500' />
            <h1 className='text-foreground text-3xl font-bold'>좋아요한 레시피</h1>
          </div>
          <p className='text-muted-foreground'>
            {recipes.length > 0
              ? `${recipes.length}개의 레시피를 좋아요 했습니다`
              : '아직 좋아요한 레시피가 없습니다'}
          </p>
        </div>

        {recipes.length === 0 ? (
          !isLoggedIn ? (
            <LoginRequired
              icon={Heart}
              message='로그인하고 좋아하는 레시피를 저장해보세요!'
              onLoginClick={requestLogin}
            />
          ) : (
            <div className='py-12 text-center'>
              <Heart className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
              <p className='text-muted-foreground mb-4 text-lg'>
                아직 좋아요한 레시피가 없습니다.
              </p>
              <Button onClick={() => router.push('/recipes')}>레시피 찾아보기</Button>
            </div>
          )
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} initialLiked={true} />
            ))}
          </div>
        )}
        <LoginDialogComponent />
      </div>
    </main>
  );
}
