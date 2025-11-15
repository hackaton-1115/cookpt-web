import { useCallback, useEffect, useState } from 'react'

import type {
  CameraOptions,
  GalleryOptions,
  ImageResult,
} from '@/lib/android-bridge'
import { getCookptAppVersion, isCookptApp } from '@/lib/utils'

export function useAndroidBridge() {
  const [isCookptNativeApp, setIsCookptNativeApp] = useState(false)
  const [appVersion, setAppVersion] = useState<string | null>(null)

  useEffect(() => {
    // CookptApp 네이티브 앱 여부 확인
    const isNativeApp = isCookptApp()
    const version = getCookptAppVersion()

    setIsCookptNativeApp(isNativeApp)
    setAppVersion(version)

    if (isNativeApp) {
      console.log('🚀 CookptApp 네이티브 앱 감지됨! 버전:', version)
    }
  }, [])

  // 카메라 열기
  const openCamera = useCallback(
    async (options: CameraOptions = {}): Promise<ImageResult> => {
      return new Promise((resolve, reject) => {
        if (!isCookptNativeApp || !window.AndroidBridge) {
          // CookptApp이 아니거나 브릿지가 없는 경우 일반 파일 입력 폴백
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.capture = 'environment'

          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1]
                resolve({
                  uri: reader.result as string,
                  base64,
                  cancelled: false,
                })
              }
              reader.onerror = () => reject(new Error('Failed to read image'))
              reader.readAsDataURL(file)
            } else {
              resolve({ uri: '', cancelled: true })
            }
          }

          input.click()

          return
        }

        // 안드로이드 브릿지로 카메라 열기
        const callbackName = `cameraCallback_${Date.now()}`

        // 글로벌 콜백 등록
        ;(
          window as typeof window & {
            [key: string]: (result: ImageResult) => void
          }
        )[callbackName] = (result: ImageResult) => {
          delete (
            window as typeof window & {
              [key: string]: (result: ImageResult) => void
            }
          )[callbackName]
          if (result.cancelled) {
            reject(new Error('Camera cancelled'))
          } else {
            resolve(result)
          }
        }

        try {
          window.AndroidBridge!.openCamera(
            JSON.stringify({ ...options, callback: callbackName })
          )
        } catch (error) {
          delete (
            window as typeof window & {
              [key: string]: (result: ImageResult) => void
            }
          )[callbackName]
          reject(error)
        }
      })
    },
    [isCookptNativeApp]
  )

  // 갤러리 열기
  const openGallery = useCallback(
    async (options: GalleryOptions = {}): Promise<ImageResult> => {
      return new Promise((resolve, reject) => {
        if (!isCookptNativeApp || !window.AndroidBridge) {
          // CookptApp이 아니거나 브릿지가 없는 경우 일반 파일 입력 폴백
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'

          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1]
                resolve({
                  uri: reader.result as string,
                  base64,
                  cancelled: false,
                })
              }
              reader.onerror = () => reject(new Error('Failed to read image'))
              reader.readAsDataURL(file)
            } else {
              resolve({ uri: '', cancelled: true })
            }
          }

          input.click()

          return
        }

        // 안드로이드 브릿지로 갤러리 열기
        const callbackName = `galleryCallback_${Date.now()}`

        // 글로벌 콜백 등록
        ;(
          window as typeof window & {
            [key: string]: (result: ImageResult) => void
          }
        )[callbackName] = (result: ImageResult) => {
          delete (
            window as typeof window & {
              [key: string]: (result: ImageResult) => void
            }
          )[callbackName]
          if (result.cancelled) {
            reject(new Error('Gallery cancelled'))
          } else {
            resolve(result)
          }
        }

        try {
          window.AndroidBridge!.openGallery(
            JSON.stringify({ ...options, callback: callbackName })
          )
        } catch (error) {
          delete (
            window as typeof window & {
              [key: string]: (result: ImageResult) => void
            }
          )[callbackName]
          reject(error)
        }
      })
    },
    [isCookptNativeApp]
  )

  return {
    isCookptNativeApp,
    appVersion,
    openCamera,
    openGallery,
  }
}
