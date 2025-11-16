'use client';

import { CheckCircle, Loader2 } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { isNativeApp, setupNativeMessageListener } from '@/lib/supabase/native-auth';

export default function AuthSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'redirecting'>('loading');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cleanupListener: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleAuthSuccess = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // 세션이 없으면 홈으로
        router.push('/');
        return;
      }

      // 네이티브 앱 환경이면 토큰 전송
      if (isNativeApp() && window.sendAuthSuccessToNative) {
        console.log('네이티브 앱 환경 감지: 토큰 전송 중...');
        window.sendAuthSuccessToNative(session.access_token, session.refresh_token);
        setStatus('success');

        const next = searchParams.get('next') || '/upload';

        // 네이티브 앱의 응답 리스닝
        cleanupListener = setupNativeMessageListener((message) => {
          if (message.type === 'AUTH_TOKENS_SAVED') {
            console.log('네이티브 앱에서 토큰 저장 완료');
            if (cleanupListener) cleanupListener();
            if (timeoutId) clearTimeout(timeoutId);

            setStatus('redirecting');
            router.push(next);
          }
        });

        // 5초 타임아웃 (네이티브 앱 응답 없으면 그냥 이동)
        timeoutId = setTimeout(() => {
          console.log('타임아웃: 네이티브 앱 응답 없이 이동');
          if (cleanupListener) cleanupListener();
          setStatus('redirecting');
          router.push(next);
        }, 5000);
      } else {
        // 일반 웹 브라우저면 바로 리다이렉트
        const next = searchParams.get('next') || '/upload';
        router.push(next);
      }
    };

    handleAuthSuccess();

    // Cleanup
    return () => {
      if (cleanupListener) cleanupListener();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, searchParams]);

  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        {status === 'loading' && (
          <>
            <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
            <h2 className='mb-2 text-xl font-semibold'>로그인 처리 중...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className='mx-auto mb-4 h-12 w-12 text-green-500' />
            <h2 className='mb-2 text-xl font-semibold'>로그인 성공!</h2>
            <p className='text-muted-foreground'>네이티브 앱으로 인증 정보를 전송했습니다.</p>
          </>
        )}

        {status === 'redirecting' && (
          <>
            <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
            <h2 className='mb-2 text-xl font-semibold'>페이지 이동 중...</h2>
          </>
        )}
      </div>
    </div>
  );
}
