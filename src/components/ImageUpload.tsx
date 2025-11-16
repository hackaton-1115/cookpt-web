'use client';

import { Camera, Upload, X } from 'lucide-react';

import Image from 'next/image';
import { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='w-full'>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleChange}
        className='hidden'
        id='image-upload'
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
          <div className='flex flex-col items-center justify-center gap-3 p-6 sm:gap-4 sm:p-12'>
            <div className='flex gap-3 sm:gap-4'>
              <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16'>
                <Camera className='text-primary h-6 w-6 sm:h-8 sm:w-8' />
              </div>
              <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16'>
                <Upload className='text-primary h-6 w-6 sm:h-8 sm:w-8' />
              </div>
            </div>

            <div className='text-center'>
              <p className='text-foreground text-base font-semibold sm:text-lg'>
                재료 사진 업로드
              </p>
              <p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
                드래그 앤 드롭 또는 클릭하여 선택하세요
              </p>
            </div>

            <div className='flex w-full flex-col gap-2 px-4 sm:w-auto sm:flex-row sm:gap-3 sm:px-0'>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant='default'
                className='w-full sm:w-auto'
              >
                <Upload className='mr-2 h-4 w-4' />
                파일 선택
              </Button>
              <Button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.capture = 'environment';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleFile(file);
                  };
                  input.click();
                }}
                variant='outline'
                className='w-full sm:w-auto'
              >
                <Camera className='mr-2 h-4 w-4' />
                사진 촬영
              </Button>
            </div>

            <p className='text-muted-foreground text-xs'>JPG, PNG, WEBP 지원</p>
          </div>
        </Card>
      ) : (
        <Card className='relative overflow-hidden py-0'>
          <Button
            onClick={clearImage}
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2 z-10 h-8 w-8 rounded-full'
          >
            <X className='h-4 w-4' />
          </Button>
          <div className='relative h-96 w-full'>
            <Image
              src={preview || '/placeholder.svg'}
              alt='업로드된 재료'
              fill
              className='object-cover'
              unoptimized
            />
          </div>
        </Card>
      )}
    </div>
  );
}
