import { Loader2 } from 'lucide-react';

import { Suspense } from 'react';

import RecipesContent from '@/app/recipes/RecipesContent';

export default function RecipesPage() {
  return (
    <Suspense
      fallback={
        <div className='bg-background flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
            <p className='text-muted-foreground'>레시피를 불러오는 중...</p>
          </div>
        </div>
      }
    >
      <RecipesContent />
    </Suspense>
  );
}
