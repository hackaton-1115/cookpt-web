'use client';

import Image from 'next/image';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Spinner } from '../ui/spinner';

interface LoginDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function LoginDialog({
  children,
  trigger,
  open,
  onOpenChange,
}: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState<{ google: boolean; kakao: boolean }>({
    google: false,
    kakao: false,
  });

  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/upload`,
        },
      });

      if (error) {
        console.error(`${provider} 로그인 에러:`, error);
        alert(`로그인 중 오류가 발생했습니다: ${error.message}`);
        setIsLoading((prev) => ({ ...prev, [provider]: false }));
      }
      // 리다이렉트가 성공하면 페이지가 이동하므로 로딩 상태를 해제할 필요 없음
    } catch (err) {
      console.error('예상치 못한 에러:', err);
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !open && (
        <DialogTrigger asChild>
          <Button variant='outline'>로그인</Button>
        </DialogTrigger>
      )}
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl'>로그인</DialogTitle>
          <DialogDescription className='text-center'>
            소셜 계정으로 간편하게 로그인하세요
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex flex-col items-center gap-3'>
          {/* Google Sign In Button - Official Design */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading.google || isLoading.kakao}
            className='group relative flex h-12 w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded bg-white px-3 text-center text-sm font-medium text-[#1f1f1f] transition-all duration-200 hover:shadow-[0_1px_2px_0_rgba(60,64,67,.30),0_1px_3px_1px_rgba(60,64,67,.15)] disabled:cursor-default disabled:border-[#1f1f1f1f] disabled:bg-[#ffffff61]'
            style={{ letterSpacing: '0.25px', fontFamily: 'Roboto, arial, sans-serif' }}
          >
            {/* Hover/Focus State Overlay */}
            <span className='absolute inset-0 bg-[#303030] opacity-0 transition-opacity duration-200 group-hover:opacity-[0.08] group-focus:opacity-[0.12] group-active:opacity-[0.12]' />

            {isLoading.google ? (
              <span className='z-10 flex items-center justify-center'>
                <Spinner className='size-5 text-gray-600' />
              </span>
            ) : (
              <>
                {/* Google Icon - 왼쪽 끝 */}
                <div className='absolute left-4 z-10 flex h-5 w-5 shrink-0 items-center justify-center group-disabled:opacity-[0.38]'>
                  <svg
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 48 48'
                    className='block h-5 w-5'
                  >
                    <path
                      fill='#EA4335'
                      d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                    />
                    <path
                      fill='#4285F4'
                      d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                    />
                    <path
                      fill='#34A853'
                      d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                    />
                    <path fill='none' d='M0 0h48v48H0z' />
                  </svg>
                </div>
                {/* Button Text - 중앙 */}
                <span className='z-10 overflow-hidden pl-2 text-base font-semibold text-ellipsis whitespace-nowrap group-disabled:opacity-[0.38]'>
                  구글 로그인
                </span>
              </>
            )}
          </button>

          {/* Kakao Login Button - Official Design */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={isLoading.google || isLoading.kakao}
            className='relative h-12 w-[200px] cursor-pointer overflow-hidden rounded disabled:cursor-default disabled:opacity-60'
          >
            {isLoading.kakao ? (
              <div className='flex h-12 w-[200px] items-center justify-center rounded bg-[#FEE500]'>
                <Spinner className='size-5 text-gray-600' />
              </div>
            ) : (
              <Image
                src='/카카오 로그인 버튼.svg'
                alt='Kakao로 계속하기'
                width={200}
                height={45}
                className='h-full w-full object-contain'
              />
            )}
          </button>
        </div>
        {children && <div className='mt-4'>{children}</div>}
      </DialogContent>
    </Dialog>
  );
}
