import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * CookptApp 네이티브 앱 여부 확인
 * navigator.userAgent에 'CookptApp/1.0.0'이 포함되어 있는지 체크
 */
export function isCookptApp(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent || ''
  return userAgent.includes('CookptApp/')
}

/**
 * CookptApp 버전 추출
 * 예: "CookptApp/1.0.0" -> "1.0.0"
 */
export function getCookptAppVersion(): string | null {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return null
  }

  const userAgent = navigator.userAgent || ''
  const match = userAgent.match(/CookptApp\/([\d.]+)/)
  return match ? match[1] : null
}
