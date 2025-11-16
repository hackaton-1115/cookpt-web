'use client';

import { Heart } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';
import { getLikedRecipeIds } from '@/lib/recipe-likes';
import { findRecipesByIds } from '@/lib/recipe-storage';
import { createClient } from '@/lib/supabase/client';
import { Recipe } from '@/lib/types';

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();

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
    <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
      <div className='text-center'>
        {/* 픽셀 로더 */}
        <div className='mx-auto mb-6 flex items-center justify-center'>
          <PixelIconBox icon={Heart} variant='primary' size='large' className='pixel-rotate' />
        </div>
        <p className='pixel-text text-sm text-[#5d4037]'>좋아요한 레시피를 불러오는 중...</p>
      </div>
    </div>
  ) : (
    <main className='min-h-screen bg-[#fafafa] py-8'>
      <div className='container mx-auto px-4'>
        {/* 페이지 헤더 */}
        <div className='mb-8 border-b-4 border-[#5d4037] pb-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
              <Heart className='h-6 w-6 fill-white text-white' />
            </div>
            <h1 className='pixel-text text-base text-[#5d4037]'>좋아요한 레시피</h1>
          </div>
          <p className='text-sm text-[#5d4037]/70'>
            {recipes.length > 0
              ? `${recipes.length}개의 레시피를 좋아요 했습니다`
              : '아직 좋아요한 레시피가 없습니다'}
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className='py-16 text-center'>
            {/* 빈 상태 아이콘 박스 */}
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <Heart className='h-12 w-12 text-[#5d4037]/50' />
            </div>
            <h3 className='pixel-text mb-3 text-sm text-[#5d4037]'>
              {isLoggedIn ? '아직 좋아요한 레시피가 없습니다' : '로그인이 필요합니다'}
            </h3>
            <p className='mx-auto mb-6 max-w-md text-sm text-[#5d4037]/60'>
              {isLoggedIn
                ? '레시피 페이지에서 마음에 드는 레시피를 찾아보세요!'
                : '로그인하고 좋아하는 레시피를 저장해보세요!'}
            </p>
            {!isLoggedIn ? (
              <button
                onClick={() => router.push('/login')}
                className='inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
              >
                <span className='pixel-text text-xs'>로그인하기</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/recipes')}
                className='inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
              >
                <span className='pixel-text text-xs'>레시피 찾아보기</span>
              </button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} initialLiked={true} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
