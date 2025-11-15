import { Suspense } from 'react';

import RecognizeContent from '@/app/recognize/RecognizeContent';

export default function RecognizePage() {
  return (
    <Suspense
      fallback={
        <div className='bg-background flex min-h-screen items-center justify-center'>
          <p className='text-muted-foreground'>로딩 중...</p>
        </div>
      }
    >
      <RecognizeContent />
    </Suspense>
  );
}
