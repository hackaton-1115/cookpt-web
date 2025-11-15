import { createClient } from './client';

/**
 * 리액트 네이티브 WebView에서 주입한 세션 정보를 복원합니다.
 * WebView의 injectedJavaScript로 window.nativeAuth에 토큰이 주입되어 있어야 합니다.
 *
 * @returns 세션 복원 성공 여부
 */
export const restoreNativeSession = async (): Promise<boolean> => {
  // 브라우저 환경이 아니면 실행하지 않음
  if (typeof window === 'undefined') {
    return false;
  }

  // 네이티브에서 주입한 인증 정보 확인
  const nativeAuth = window.nativeAuth;

  if (!nativeAuth || !nativeAuth.accessToken || !nativeAuth.refreshToken) {
    // 네이티브 앱이 아니거나 토큰이 없음
    return false;
  }

  try {
    const supabase = createClient();

    // Supabase 세션 복원
    const { data, error } = await supabase.auth.setSession({
      access_token: nativeAuth.accessToken,
      refresh_token: nativeAuth.refreshToken,
    });

    if (error) {
      console.error('네이티브 세션 복원 실패:', error);
      return false;
    }

    if (data.session) {
      console.log('네이티브 세션 복원 성공:', data.session.user.email);

      // 보안을 위해 window 객체에서 토큰 삭제
      delete window.nativeAuth;

      return true;
    }

    return false;
  } catch (error) {
    console.error('네이티브 세션 복원 중 오류:', error);
    return false;
  }
};

/**
 * 네이티브 앱 환경인지 확인합니다.
 * window.nativeAuth가 정의되어 있으면 네이티브 앱으로 간주합니다.
 *
 * @returns 네이티브 앱 여부
 */
export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return !!window.nativeAuth;
};
