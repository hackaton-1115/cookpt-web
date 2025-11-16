'use client';

import { LucideIcon, LogIn } from 'lucide-react';

interface LoginRequiredProps {
  icon?: LucideIcon;
  message?: string;
  onLoginClick: () => void;
}

export const LoginRequired = ({
  icon: Icon = LogIn,
  message = '로그인이 필요한 서비스입니다.',
  onLoginClick,
}: LoginRequiredProps) => {
  return (
    <div className='py-16 text-center'>
      {/* 픽셀 아이콘 박스 */}
      <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
        <Icon className='h-12 w-12 text-[#5d4037]/50' />
      </div>

      {/* 메시지 */}
      <p className='pixel-text mb-6 text-sm text-[#5d4037]'>{message}</p>

      {/* 픽셀 버튼 */}
      <button
        onClick={onLoginClick}
        className='inline-flex cursor-pointer items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
      >
        <LogIn className='h-5 w-5' />
        <span className='pixel-text text-xs'>로그인하기</span>
      </button>
    </div>
  );
};
