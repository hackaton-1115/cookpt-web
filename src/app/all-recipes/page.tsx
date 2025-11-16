import { ChefHat } from 'lucide-react';

import { RecipeGrid } from '@/components/RecipeGrid';
import PixelPagination from '@/components/ui/pixel-pagination';
import { loadRecipesPaginated } from '@/lib/recipe-storage';

const PAGE_SIZE = 12;

export default async function AllRecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // 페이지네이션된 레시피 데이터 가져오기
  const { recipes, totalCount } = await loadRecipesPaginated(currentPage, PAGE_SIZE);
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
            <h1 className='pixel-text text-base text-[#5d4037]'>모든 레시피</h1>
          </div>
          <p className='text-sm text-[#5d4037]/70'>
            AI가 생성한 모든 레시피를 확인하세요 ({totalCount}개)
          </p>
        </div>

        {/* 레시피 그리드 */}
        <RecipeGrid recipes={recipes} />

        {/* 페이지네이션 */}
        <PixelPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath='/all-recipes'
        />
      </div>
    </main>
  );
}
