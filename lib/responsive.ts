/**
 * 현재 화면이 모바일 환경인지 확인합니다.
 * @param breakpoint 모바일로 간주할 최대 너비 (기본값: 768px)
 * @returns 모바일 환경이면 true, 아니면 false
 */
export function isMobile(breakpoint: number = 768): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth < breakpoint;
}

/**
 * 현재 화면 너비를 반환합니다.
 * @returns 화면 너비 (픽셀)
 */
export function getScreenWidth(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  return window.innerWidth;
}
