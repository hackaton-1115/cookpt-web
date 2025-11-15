/**
 * 리액트 네이티브 WebView에서 주입하는 인증 정보 타입 정의
 */
interface NativeAuth {
  accessToken: string;
  refreshToken: string;
}

/**
 * Window 객체 확장 - 네이티브 앱에서 주입하는 인증 정보
 */
interface Window {
  nativeAuth?: NativeAuth;
}
