import { ChefHat } from 'lucide-react';

import Link from 'next/link';

import { MyRecipesLoginRequired } from '@/components/MyRecipesLoginRequired';
import { RecipeGrid } from '@/components/RecipeGrid';
import PixelPagination from '@/components/ui/pixel-pagination';
import { findRecipesByUserIdPaginated } from '@/lib/recipe-storage';
import { createClient } from '@/lib/supabase/server';

const PAGE_SIZE = 12;

export default async function MyRecipesPage({
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
    return <MyRecipesLoginRequired />;
  }

  // 페이지네이션된 레시피 데이터 가져오기
  const { recipes, totalCount } = await findRecipesByUserIdPaginated(
    user.id,
    currentPage,
    PAGE_SIZE,
  );
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
            {totalCount > 0
              ? `${totalCount}개의 레시피를 만들었습니다`
              : '아직 만든 레시피가 없습니다'}
          </p>
        </div>

        {/* 레시피 그리드 또는 빈 상태 */}
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
            <Link
              href='/upload'
              className='inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
            >
              <span className='pixel-text text-xs'>새 레시피 만들기</span>
            </Link>
          </div>
        ) : (
          <>
            <RecipeGrid recipes={recipes} />
            {/* 페이지네이션 */}
            <PixelPagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath='/my-recipes'
            />
          </>
        )}
      </div>
    </main>
  );
}
