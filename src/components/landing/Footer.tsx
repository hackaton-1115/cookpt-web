import { ChefHat } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t-4 border-[#5d4037] bg-[#ffe0e0] px-6 py-8'>
      <div className='mx-auto max-w-6xl text-center'>
        <div className='mb-4 flex items-center justify-center gap-2'>
          <ChefHat className='h-6 w-6 text-[#5d4037]' />
          <span className='pixel-text text-sm text-[#5d4037]'>CookPT</span>
        </div>
        <p className='mb-4 text-sm text-[#5d4037]/70'>
          AI 기술로 더 스마트한 요리 생활을 시작하세요
        </p>
        <p className='text-xs text-[#5d4037]/60'>© 2025 CookPT • AI 기반 간편 요리</p>
      </div>
    </footer>
  );
}
