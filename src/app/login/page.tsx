'use client';

import { ChefHat } from 'lucide-react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PixelIconBox } from '@/components/ui/pixel-icon-box';
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
      <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
        <div className='text-center'>
          <div className='mx-auto mb-6 flex items-center justify-center'>
            <PixelIconBox icon={ChefHat} variant='primary' size='large' className='pixel-rotate' />
          </div>
          <p className='pixel-text text-sm text-[#5d4037]'>로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4'>
      <div className='w-full max-w-md space-y-8'>
        {/* 로고 및 타이틀 */}
        <div className='text-center'>
          <div className='mb-6 flex justify-center'>
            <div className='flex h-20 w-20 items-center justify-center border-4 border-[#5d4037] bg-[#ff5252] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
              <ChefHat className='h-10 w-10 text-white' />
            </div>
          </div>
          <h1 className='pixel-text mb-3 text-base text-[#5d4037]'>CookPT</h1>
          <p className='text-sm text-[#5d4037]/70'>AI 냉장고 재료 기반 한식 레시피 추천</p>
        </div>

        {/* 로그인 섹션 */}
        <div className='border-4 border-[#5d4037] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
          <h2 className='pixel-text mb-3 text-center text-xs text-[#5d4037]'>로그인</h2>
          <p className='mb-6 text-center text-sm text-[#5d4037]/70'>
            소셜 계정으로 간편하게 로그인하세요
          </p>

          <div className='flex flex-col items-center gap-4'>
            {/* Google Login Button */}
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading.google || isLoading.kakao}
              className='flex w-full cursor-pointer items-center justify-center gap-3 border-4 border-[#5d4037] bg-white px-6 py-3 text-[#5d4037] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isLoading.google ? (
                <span className='text-sm font-semibold'>로딩 중...</span>
              ) : (
                <>
                  <svg
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 48 48'
                    className='h-6 w-6'
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
                  <span className='text-sm font-semibold'>구글 로그인</span>
                </>
              )}
            </button>

            {/* Kakao Login Button */}
            <button
              onClick={() => handleSocialLogin('kakao')}
              disabled={isLoading.google || isLoading.kakao}
              className='flex w-full cursor-pointer items-center justify-center gap-3 border-4 border-[#5d4037] bg-[#FEE500] px-6 py-3 text-[#5d4037] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isLoading.kakao ? (
                <span className='text-sm font-semibold'>로딩 중...</span>
              ) : (
                <>
                  <Image
                    src='/카카오 로고.svg'
                    alt='Kakao'
                    width={24}
                    height={24}
                    className='h-6 w-6'
                  />
                  <span className='text-sm font-semibold'>카카오 로그인</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className='text-center text-xs text-[#5d4037]/60'>
          로그인하시면{' '}
          <a href='/terms' className='text-[#5d4037] underline'>
            이용약관
          </a>
          과{' '}
          <a href='/privacy' className='text-[#5d4037] underline'>
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </main>
  );
}
