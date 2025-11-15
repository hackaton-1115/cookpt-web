'use client';

import { useEffect, useState } from 'react';

import { restoreNativeSession } from '@/lib/supabase/native-auth';

/**
 * 네이티브 앱에서 WebView로 실행될 때 자동으로 세션을 복원하는 Provider
 */
export default function NativeAuthProvider({ children }: { children: React.ReactNode }) {
  const [isRestoring, setIsRestoring] = useState<boolean>(true);

  useEffect(() => {
    const restore = async () => {
      // 네이티브 세션 복원 시도
      const restored = await restoreNativeSession();

      if (restored) {
        console.log('✅ 네이티브 앱 세션이 복원되었습니다.');
      }

      setIsRestoring(false);
    };

    restore();
  }, []);

  // 세션 복원 중에는 children을 렌더링하지 않음 (깜빡임 방지)
  // 복원이 매우 빠르므로 로딩 UI는 표시하지 않음
  if (isRestoring) {
    return null;
  }

  return <>{children}</>;
}
