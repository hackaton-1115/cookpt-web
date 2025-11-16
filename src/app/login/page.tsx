'use client';

import { Sparkles } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<{ google: boolean; kakao: boolean }>({
    google: false,
    kakao: false,
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const checkAuth = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 리다이렉트 URL이 있으면 해당 페이지로, 없으면 /upload로
        const next = searchParams.get('next') || '/upload';
        router.push(next);
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, searchParams, supabase.auth]);

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));

    try {
      const next = searchParams.get('next') || '/upload';

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
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

  // 로그인 체크 중
  if (isCheckingAuth) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <Spinner className='h-8 w-8' />
      </div>
    );
  }

  return (
    <main className='bg-background flex min-h-screen flex-col items-center justify-center px-4'>
      <div className='w-full max-w-md space-y-8'>
        {/* 로고 및 타이틀 */}
        <div className='text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='bg-primary relative rounded-2xl p-4'>
              <Sparkles className='text-primary-foreground h-12 w-12' />
              <div className='bg-primary absolute inset-0 rounded-2xl opacity-50 blur-xl' />
            </div>
          </div>
          <h1 className='mb-2 text-4xl font-bold'>CookPT</h1>
          <p className='text-muted-foreground text-lg'>
            AI 냉장고 재료 기반 한식 레시피 추천
          </p>
        </div>

        {/* 로그인 섹션 */}
        <div className='border-border bg-card rounded-2xl border p-8 shadow-lg'>
          <h2 className='mb-2 text-center text-2xl font-semibold'>로그인</h2>
          <p className='text-muted-foreground mb-6 text-center text-sm'>
            소셜 계정으로 간편하게 로그인하세요
          </p>

          <div className='flex flex-col items-center gap-4'>
            {/* Google Sign In Button */}
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading.google || isLoading.kakao}
              className='group relative flex h-12 w-full max-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded bg-white px-3 text-center text-sm font-medium text-[#1f1f1f] transition-all duration-200 hover:shadow-[0_1px_2px_0_rgba(60,64,67,.30),0_1px_3px_1px_rgba(60,64,67,.15)] disabled:cursor-default disabled:border-[#1f1f1f1f] disabled:bg-[#ffffff61]'
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
                  {/* Google Icon */}
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
                  {/* Button Text */}
                  <span className='z-10 overflow-hidden pl-2 text-base font-semibold text-ellipsis whitespace-nowrap group-disabled:opacity-[0.38]'>
                    구글 로그인
                  </span>
                </>
              )}
            </button>

            {/* Kakao Login Button */}
            <button
              onClick={() => handleSocialLogin('kakao')}
              disabled={isLoading.google || isLoading.kakao}
              className='relative flex h-12 w-full max-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded bg-[#FEE500] disabled:cursor-default disabled:opacity-60'
            >
              {isLoading.kakao ? (
                <Spinner className='size-5 text-gray-600' />
              ) : (
                <>
                  {/* Kakao Icon */}
                  <div className='absolute left-4 flex h-5 w-5 shrink-0 items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M12 3C6.477 3 2 6.463 2 10.692c0 2.62 1.632 4.932 4.13 6.325l-.987 3.7c-.084.315.271.561.544.377l4.35-2.928c.66.095 1.337.145 2.023.145 5.523 0 10-3.463 10-7.62S17.523 3 12 3z'
                        fill='#000000'
                      />
                    </svg>
                  </div>
                  {/* Button Text */}
                  <span className='pl-2 text-base font-semibold text-[#000000]'>카카오 로그인</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className='text-muted-foreground text-center text-xs'>
          로그인하시면{' '}
          <a href='/terms' className='underline'>
            이용약관
          </a>
          과{' '}
          <a href='/privacy' className='underline'>
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </main>
  );
}
