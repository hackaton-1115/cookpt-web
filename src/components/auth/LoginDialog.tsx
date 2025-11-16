'use client';

import { X } from 'lucide-react';

import Image from 'next/image';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

interface LoginDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LoginDialog({
  children,
  trigger,
  isOpen: controlledOpen,
  onClose,
}: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<{ google: boolean; kakao: boolean }>({
    google: false,
    kakao: false,
  });

  const supabase = createClient();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onClose !== undefined ? onClose : () => setInternalOpen(!internalOpen);

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
    <>
      {/* Trigger Button */}
      {trigger && (
        <div onClick={() => controlledOpen === undefined && setInternalOpen(true)}>{trigger}</div>
      )}

      {/* Pixel Modal Overlay */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#5d4037]/80 p-4'>
          {/* Pixel Modal */}
          <div className='relative w-full max-w-md border-4 border-[#5d4037] bg-[#fafafa] p-6 shadow-[12px_12px_0px_0px_rgba(93,64,55,1)]'>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen()}
              className='absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center border-2 border-[#5d4037] bg-white text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
            >
              <X className='h-4 w-4' />
            </button>

            {/* Header */}
            <div className='mb-6 text-center'>
              <h2 className='pixel-text mb-3 text-base text-[#5d4037]'>로그인</h2>
              <p className='text-sm text-[#5d4037]/70'>소셜 계정으로 간편하게 로그인하세요</p>
            </div>

            {/* Login Buttons */}
            <div className='flex flex-col items-center gap-4'>
              {/* Google Login Button */}
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading.google || isLoading.kakao}
                className='flex w-full cursor-pointer items-center justify-center gap-3 border-4 border-[#5d4037] bg-white px-6 py-3 text-[#5d4037] shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading.google ? (
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold'>로딩 중...</span>
                  </div>
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
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold'>로딩 중...</span>
                  </div>
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

            {children && <div className='mt-6'>{children}</div>}
          </div>
        </div>
      )}
    </>
  );
}
