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

    // 이미 세션이 있는지 확인
    const {
      data: { session: existingSession },
    } = await supabase.auth.getSession();

    if (existingSession) {
      console.log('기존 세션이 있어 네이티브 토큰 복원을 건너뜁니다.');
      // 보안을 위해 window 객체에서 토큰 삭제
      delete window.nativeAuth;
      return true;
    }

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
 * 리액트 네이티브 WebView 환경인지 확인합니다.
 * User-Agent에 CookptApp이 포함되어 있으면 네이티브 앱으로 간주합니다.
 *
 * @returns 네이티브 앱 여부
 */
export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // User-Agent에 CookptApp이 포함되어 있으면 네이티브 앱
  return navigator.userAgent.includes('CookptApp');
};

/**
 * 네이티브 앱으로 메시지를 전송합니다.
 * 리액트 네이티브 WebView의 postMessage를 사용합니다.
 *
 * @param message - 전송할 메시지 객체
 */
export const sendToNativeApp = (message: NativeBridgeMessage): void => {
  if (!isNativeApp()) {
    console.warn('네이티브 앱 환경이 아닙니다.');
    return;
  }

  if (!window.ReactNativeWebView) {
    console.warn('ReactNativeWebView가 없습니다.');
    return;
  }

  try {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
    console.log('네이티브 앱으로 메시지 전송:', message.type);
  } catch (error) {
    console.error('네이티브 앱 메시지 전송 실패:', error);
  }
};

/**
 * 인증 성공 시 네이티브 앱으로 세션 정보를 전송합니다.
 *
 * @param accessToken - Supabase access token
 * @param refreshToken - Supabase refresh token
 */
export const sendAuthSuccessToNative = (accessToken: string, refreshToken: string): void => {
  sendToNativeApp({
    type: 'AUTH_SUCCESS',
    payload: {
      accessToken,
      refreshToken,
    },
  });
};

/**
 * 인증 실패 시 네이티브 앱으로 에러를 전송합니다.
 *
 * @param error - 에러 메시지
 */
export const sendAuthErrorToNative = (error: string): void => {
  sendToNativeApp({
    type: 'AUTH_ERROR',
    payload: {
      error,
    },
  });
};

/**
 * 로그아웃 시 네이티브 앱에 알림을 전송합니다.
 * 네이티브 앱에서 저장된 토큰을 삭제하도록 합니다.
 */
export const sendLogoutToNative = (): void => {
  sendToNativeApp({
    type: 'AUTH_LOGOUT',
  });
};

/**
 * 네이티브 앱에서 오는 메시지를 리스닝합니다.
 *
 * @param callback - 메시지를 받았을 때 호출할 콜백 함수
 * @returns cleanup 함수
 */
export const setupNativeMessageListener = (
  callback: (message: NativeBridgeMessage) => void
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleMessage = (event: MessageEvent) => {
    try {
      // 네이티브 앱에서 온 메시지인지 확인
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      if (data && data.type) {
        callback(data as NativeBridgeMessage);
      }
    } catch {
      // JSON 파싱 실패 시 무시
    }
  };

  window.addEventListener('message', handleMessage);

  // cleanup 함수 반환
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};
