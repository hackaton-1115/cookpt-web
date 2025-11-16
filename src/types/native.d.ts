/**
 * 리액트 네이티브 WebView에서 주입하는 인증 정보 타입 정의
 */
interface NativeAuth {
  accessToken: string;
  refreshToken: string;
}

/**
 * 리액트 네이티브 WebView 브릿지 메시지 타입
 */
interface NativeBridgeMessage {
  type: 'AUTH_SUCCESS' | 'AUTH_ERROR' | 'AUTH_LOGOUT' | 'AUTH_TOKENS_SAVED';
  payload?: {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  };
}

/**
 * Window 객체 확장 - 네이티브 앱에서 주입하는 인증 정보
 */
interface Window {
  nativeAuth?: NativeAuth;
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase?: any;
  // 네이티브 앱으로 인증 성공 토큰을 전송하는 함수
  sendAuthSuccessToNative?: (accessToken: string, refreshToken: string) => void;
  // 네이티브 앱의 로그인 화면을 여는 함수
  openNativeLogin?: () => void;
}
