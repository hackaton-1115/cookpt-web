'use client';

import { Heart } from 'lucide-react';

import Link from 'next/link';

import { useLogin } from '@/hooks/useLogin';

interface FavoritesEmptyProps {
  isLoggedIn: boolean;
}

export function FavoritesEmpty({ isLoggedIn }: FavoritesEmptyProps) {
  const { requestLogin, LoginDialogComponent } = useLogin();

  return (
    <>
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
            onClick={requestLogin}
            className='inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
          >
            <span className='pixel-text text-xs'>로그인하기</span>
          </button>
        ) : (
          <Link
            href='/all-recipes'
            className='inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
          >
            <span className='pixel-text text-xs'>레시피 찾아보기</span>
          </Link>
        )}
      </div>
      <LoginDialogComponent />
    </>
  );
}
