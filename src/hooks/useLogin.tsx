'use client';

import { useState } from 'react';

import LoginDialog from '@/components/auth/LoginDialog';
import { isNativeApp } from '@/lib/supabase/native-auth';

/**
 * 로그인 처리를 위한 커스텀 훅
 * 네이티브 앱에서는 네이티브 로그인을 호출하고,
 * 웹에서는 로그인 다이얼로그를 표시합니다.
 */
export const useLogin = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);

  /**
   * 로그인 요청 처리
   * 네이티브 앱이면 네이티브 로그인 브릿지 호출,
   * 웹이면 로그인 다이얼로그 표시
   */
  const requestLogin = () => {
    if (isNativeApp() && window.openNativeLogin) {
      // 네이티브 앱: 네이티브 로그인 화면 호출
      window.openNativeLogin();
    } else {
      // 웹 브라우저: 로그인 다이얼로그 표시
      setIsLoginDialogOpen(true);
    }
  };

  /**
   * 로그인 다이얼로그를 닫음
   */
  const closeLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  /**
   * 로그인 다이얼로그 컴포넌트
   * 웹 환경에서만 렌더링됨 (네이티브 앱에서는 렌더링하지 않음)
   */
  const LoginDialogComponent = () => {
    // 네이티브 앱에서는 다이얼로그를 렌더링하지 않음
    if (isNativeApp()) {
      return null;
    }

    return (
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    );
  };

  return {
    requestLogin,
    closeLoginDialog,
    isLoginDialogOpen,
    LoginDialogComponent,
  };
};

