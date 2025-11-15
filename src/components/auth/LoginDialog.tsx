'use client';

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

interface LoginDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

export default function LoginDialog({ children, trigger }: LoginDialogProps) {
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
    <Dialog>
      <DialogTrigger asChild>{trigger || <Button variant='outline'>로그인</Button>}</DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl'>로그인</DialogTitle>
          <DialogDescription className='text-center'>
            소셜 계정으로 간편하게 로그인하세요
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex flex-col gap-3'>
          <Button
            onClick={() => handleSocialLogin('google')}
            variant='outline'
            className='h-12 w-full text-base'
            disabled={isLoading.google || isLoading.kakao}
          >
            {isLoading.google ? (
              <span className='flex items-center gap-2'>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
                로그인 중...
              </span>
            ) : (
              <>
                <svg className='mr-2 h-5 w-5' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='currentColor'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='currentColor'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='currentColor'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Google로 계속하기
              </>
            )}
          </Button>

          <Button
            onClick={() => handleSocialLogin('kakao')}
            variant='outline'
            className='h-12 w-full bg-[#FEE500] text-base text-[#000000] hover:bg-[#FEE500]/90 hover:text-[#000000]'
            disabled={isLoading.google || isLoading.kakao}
          >
            {isLoading.kakao ? (
              <span className='flex items-center gap-2'>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
                로그인 중...
              </span>
            ) : (
              <>
                <svg className='mr-2 h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.211.472.471.472h1.932a.472.472 0 1 0 0-.944zm-5.857-1.092l.696-1.707.638 1.707H9.092zm2.523.488l.002-.016a.469.469 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474.696.696 0 0 0-.653.447l-1.661 4.075a.472.472 0 0 0 .874.357l.33-.813h2.07l.299.8a.472.472 0 1 0 .884-.33l-.345-.926zM8.293 9.302a.472.472 0 0 0-.471-.472H4.577a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14c.261 0 .472-.212.472-.472z' />
                </svg>
                Kakao로 계속하기
              </>
            )}
          </Button>
        </div>
        {children && <div className='mt-4'>{children}</div>}
      </DialogContent>
    </Dialog>
  );
}
