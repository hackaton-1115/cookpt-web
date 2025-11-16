import { Heart } from 'lucide-react';

import { FavoritesEmpty } from '@/components/FavoritesEmpty';
import { RecipeCard } from '@/components/RecipeCard';
import PixelPagination from '@/components/ui/pixel-pagination';
import { findLikedRecipesPaginated } from '@/lib/recipe-storage';
import { createClient } from '@/lib/supabase/server';

const PAGE_SIZE = 12;

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // 서버에서 사용자 정보 가져오기
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않은 경우
  if (!user) {
    return (
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
            <p className='text-sm text-[#5d4037]/70'>아직 좋아요한 레시피가 없습니다</p>
          </div>

          <FavoritesEmpty isLoggedIn={false} />
        </div>
      </main>
    );
  }

  // 페이지네이션된 좋아요한 레시피 데이터 가져오기
  const { recipes, totalCount } = await findLikedRecipesPaginated(user.id, currentPage, PAGE_SIZE);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
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
            {totalCount > 0
              ? `${totalCount}개의 레시피를 좋아요 했습니다`
              : '아직 좋아요한 레시피가 없습니다'}
          </p>
        </div>

        {/* 레시피 그리드 또는 빈 상태 */}
        {recipes.length === 0 ? (
          <FavoritesEmpty isLoggedIn={true} />
        ) : (
          <>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} initialLiked={true} />
              ))}
            </div>
            {/* 페이지네이션 */}
            <PixelPagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath='/favorites'
            />
          </>
        )}
      </div>
    </main>
  );
}
