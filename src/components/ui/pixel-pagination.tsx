'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useTransition } from 'react';

interface PixelPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  showRange?: number;
  preserveParams?: boolean;
}

export default function PixelPagination({
  currentPage,
  totalPages,
  basePath,
  showRange = 1,
  preserveParams = true,
}: PixelPaginationProps) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= showRange,
  );

  const handlePageChange = (page: number): void => {
    const params = preserveParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();
    params.set('page', page.toString());

    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`);
    });
  };

  const handlePrevious = (): void => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNext = (): void => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  return (
    <>
      {totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <div className='flex items-center gap-2'>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || isPending}
              aria-label='이전 페이지'
              className={`pixel-text flex items-center gap-1.5 border-2 border-[#5d4037] px-3 py-2 text-xs transition-all duration-100 ${
                currentPage === 1 || isPending
                  ? 'cursor-not-allowed bg-[rgba(93,64,55,0.2)] text-[rgba(93,64,55,0.4)]'
                  : 'cursor-pointer bg-white text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none'
              } `}
            >
              <ChevronLeft className='h-3 w-3' />
              <span className='hidden sm:inline'>이전</span>
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page, index, array) => (
              <Fragment key={page}>
                {index > 0 && array[index - 1] + 1 !== page && (
                  <span
                    className='pixel-text flex h-9 w-9 items-center justify-center text-xs text-[#5d4037]/50'
                    aria-hidden='true'
                  >
                    ...
                  </span>
                )}
                <button
                  onClick={() => handlePageChange(page)}
                  disabled={isPending}
                  aria-label={`${page}페이지로 이동`}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={`pixel-text h-9 w-9 border-2 border-[#5d4037] text-xs transition-all duration-100 ${
                    page === currentPage
                      ? 'bg-[#ff5252] text-white shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                      : isPending
                        ? 'cursor-not-allowed bg-white text-[#5d4037]/50'
                        : 'cursor-pointer bg-white text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none'
                  } `}
                >
                  {page}
                </button>
              </Fragment>
            ))}

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || isPending}
              aria-label='다음 페이지'
              className={`pixel-text flex items-center gap-1.5 border-2 border-[#5d4037] px-3 py-2 text-xs transition-all duration-100 ${
                currentPage === totalPages || isPending
                  ? 'cursor-not-allowed bg-[rgba(93,64,55,0.2)] text-[rgba(93,64,55,0.4)]'
                  : 'cursor-pointer bg-white text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none'
              } `}
            >
              <span className='hidden sm:inline'>다음</span>
              <ChevronRight className='h-3 w-3' />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
