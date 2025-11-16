'use client';

import { ChefHat } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoginRequired } from '@/components/LoginRequired';
import { RecipeCard } from '@/components/RecipeCard';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';
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
        // 로그인하지 않은 경우 로그인 필요 상태로 설정
        setNeedsLogin(true);
        setLoading(false);
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
      <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
        <div className='text-center'>
          {/* 픽셀 로더 */}
          <div className='mx-auto mb-6 flex items-center justify-center'>
            <PixelIconBox icon={ChefHat} variant='primary' size='large' className='pixel-rotate' />
          </div>
          <p className='pixel-text text-sm text-[#5d4037]'>내 레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <main className='bg-background min-h-screen py-8'>
        <div className='container mx-auto px-4'>
          <div className='mb-8'>
            <div className='mb-2 flex items-center gap-2'>
              <ChefHat className='text-primary h-8 w-8' />
              <h1 className='text-foreground text-3xl font-bold'>내 레시피</h1>
            </div>
            <p className='text-muted-foreground'>내가 만든 레시피를 확인하세요</p>
          </div>
          <LoginRequired
            icon={ChefHat}
            message='내 레시피를 보려면 로그인해주세요'
            onLoginClick={requestLogin}
          />
        </div>
        <LoginDialogComponent />
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-[#fafafa] py-8'>
      <div className='container mx-auto px-4'>
        {/* 페이지 헤더 */}
        <div className='mb-8 border-b-4 border-[#5d4037] pb-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
              <ChefHat className='h-6 w-6 text-white' />
            </div>
            <h1 className='pixel-text text-base text-[#5d4037]'>내 레시피</h1>
          </div>
          <p className='text-sm text-[#5d4037]/70'>
            {recipes.length > 0
              ? `${recipes.length}개의 레시피를 만들었습니다`
              : '아직 만든 레시피가 없습니다'}
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className='py-16 text-center'>
            {/* 빈 상태 아이콘 박스 */}
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <ChefHat className='h-12 w-12 text-[#5d4037]/50' />
            </div>
            <h3 className='pixel-text mb-3 text-sm text-[#5d4037]'>아직 만든 레시피가 없습니다</h3>
            <p className='mx-auto mb-6 max-w-md text-sm text-[#5d4037]/60'>
              재료 사진을 업로드하고 나만의 레시피를 만들어보세요!
            </p>
            <button
              onClick={() => router.push('/upload')}
              className='inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
            >
              <span className='pixel-text text-xs'>새 레시피 만들기</span>
            </button>
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
