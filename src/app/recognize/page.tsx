import { Suspense } from 'react';

import RecognizeContent from '@/app/recognize/RecognizeContent';

export default function RecognizePage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
          <div className='text-center'>
            {/* 픽셀 로더 박스 */}
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center border-4 border-[#5d4037] bg-[#ff5252] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <div className='pixel-rotate h-8 w-8 border-2 border-[#5d4037] bg-white' />
            </div>

            <p className='pixel-text text-sm text-[#5d4037]'>로딩 중...</p>
          </div>
        </div>
      }
    >
      <RecognizeContent />
    </Suspense>
  );
}
