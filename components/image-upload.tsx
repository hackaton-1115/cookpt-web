'use client'

import { Camera, Upload, X } from 'lucide-react'

import Image from 'next/image'
import { useRef, useState } from 'react'


import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAndroidBridge } from '@/hooks/use-android-bridge'


interface ImageUploadProps {
  onImageSelect: (imageData: string) => void
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { openCamera, openGallery } = useAndroidBridge()

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        onImageSelect(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const clearImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 안드로이드 브릿지를 사용한 카메라 열기
  const handleCameraClick = async () => {
    try {
      const result = await openCamera({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.cancelled && result.uri) {
        setPreview(result.uri)
        onImageSelect(result.uri)
      }
    } catch (error) {
      console.error('카메라 오류:', error)
      // 폴백: 기본 파일 입력 사용
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) handleFile(file)
      }
      input.click()
    }
  }

  // 안드로이드 브릿지를 사용한 갤러리 열기
  const handleGalleryClick = async () => {
    try {
      const result = await openGallery({
        allowsEditing: false,
        quality: 1,
      })

      if (!result.cancelled && result.uri) {
        setPreview(result.uri)
        onImageSelect(result.uri)
      }
    } catch (error) {
      console.error('갤러리 오류:', error)
      // 폴백: 기본 파일 입력 사용
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="image-upload"
      />

      {!preview ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-6 sm:p-12">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-foreground">
                Upload ingredient photo
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto px-4 sm:px-0">
              <Button
                onClick={handleGalleryClick}
                variant="default"
                className="w-full sm:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <Button
                onClick={handleCameraClick}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WEBP
            </p>
          </div>
        </Card>
      ) : (
        <Card className="relative overflow-hidden">
          <Button
            onClick={clearImage}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <Image
            src={preview || '/placeholder.svg'}
            alt="Uploaded ingredients"
            width={800}
            height={600}
            className="w-full h-auto max-h-96 object-cover"
            unoptimized
          />
        </Card>
      )}
    </div>
  )
}
