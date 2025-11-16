'use client';

import { Upload, X } from 'lucide-react';

import Image from 'next/image';
import { useState, useRef } from 'react';

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
    <div className='border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          className={`flex aspect-video flex-col items-center justify-center border-4 border-dashed ${
            dragActive ? 'border-[#ff5252] bg-[#ff5252]/10' : 'border-[#5d4037]/30 bg-white'
          } cursor-pointer p-12 text-center transition-all`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload
            className='mx-auto mb-4 h-16 w-16 text-[#5d4037]/50'
            style={{ imageRendering: 'pixelated' }}
          />
          <p className='pixel-text mb-2 text-xs text-[#5d4037]'>
            {dragActive ? '여기에 이미지 놓기' : '클릭하거나 이미지 드롭'}
          </p>
          <p className='text-xs text-[#5d4037]/60'>식재료 사진을 업로드하세요</p>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleChange}
            className='hidden'
          />
        </div>
      ) : (
        <div className='relative aspect-video'>
          <Image
            src={preview}
            alt='업로드된 재료'
            fill
            className='border-4 border-[#5d4037] object-cover'
            style={{ imageRendering: 'pixelated' }}
            unoptimized
          />
          <button
            onClick={clearImage}
            className='pixel-button absolute top-2 right-2 z-10 cursor-pointer border-2 border-[#5d4037] bg-[#ff5252] p-2 text-white transition-colors hover:bg-[#e63946]'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      )}
    </div>
  );
}
