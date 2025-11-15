// 안드로이드 브릿지 타입 정의

export interface CameraOptions {
  allowsEditing?: boolean
  aspect?: [number, number]
  quality?: number // 0-1
}

export interface GalleryOptions {
  allowsEditing?: boolean
  quality?: number // 0-1
  allowsMultipleSelection?: boolean
}

export interface ImageResult {
  uri: string
  base64?: string
  width?: number
  height?: number
  cancelled?: boolean
}

declare global {
  interface Window {
    // 카메라 열기
    openCamera?: (options?: CameraOptions) => Promise<ImageResult>

    // 갤러리 열기
    openGallery?: (options?: GalleryOptions) => Promise<ImageResult>

    // 안드로이드 브릿지 존재 여부
    AndroidBridge?: {
      openCamera: (optionsJson: string) => void
      openGallery: (optionsJson: string) => void
    }
  }
}

export {}
