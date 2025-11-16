import { ChefHat, Home } from 'lucide-react';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
      <div className='text-center'>
        {/* 404 아이콘 박스 */}
        <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
          <ChefHat className='h-12 w-12 text-[#5d4037]/50' />
        </div>

        {/* 404 텍스트 */}
        <h1 className='pixel-text mb-4 text-2xl text-[#ff5252]'>404</h1>
        <h2 className='pixel-text mb-3 text-sm text-[#5d4037]'>Recipe Not Found</h2>
        <p className='mb-6 text-sm text-[#5d4037]/70'>
          The recipe you are looking for does not exist.
        </p>

        {/* 홈으로 버튼 */}
        <Link href='/'>
          <button className='inline-flex items-center gap-2 border-4 border-[#5d4037] bg-[#ff5252] px-8 py-4 text-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'>
            <Home className='h-5 w-5' />
            <span className='pixel-text text-xs'>Go Home</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
