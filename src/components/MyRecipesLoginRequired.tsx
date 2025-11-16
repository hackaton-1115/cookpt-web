'use client';

import { ChefHat } from 'lucide-react';

import { LoginRequired } from '@/components/LoginRequired';
import { useLogin } from '@/hooks/useLogin';

export function MyRecipesLoginRequired() {
  const { requestLogin, LoginDialogComponent } = useLogin();

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
          <p className='text-sm text-[#5d4037]/70'>내가 만든 레시피를 확인하세요</p>
        </div>

        <LoginRequired
          icon={ChefHat}
          message='내 레시피를 보려면 로그인해주세요'
          onLoginClick={requestLogin}
        />
      </div>
      <LoginDialogComponent />
    </main>
  );
}
