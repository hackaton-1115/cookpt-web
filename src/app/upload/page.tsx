'use client';

import { ArrowRight, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ImageUpload } from '@/components/ImageUpload';
import { uploadImage } from '@/lib/image-storage';

export default function Home() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleAnalyze = async () => {
    if (!imageData) return;

    setUploading(true);
    setError(null);

    try {
      // Supabase Storage에 이미지 업로드
      const imagePath = await uploadImage(imageData);

      // 업로드 성공 후 이미지 경로를 URL 파라미터로 전달하며 /recognize로 이동
      router.push(`/recognize?image=${encodeURIComponent(imagePath)}`);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
      setUploading(false);
    }
  };

  return (
    <main className='relative min-h-screen bg-[#fafafa] py-16'>
      {/* Pixel Decorations */}
      <div className='pixel-rotate fixed top-20 left-10 h-8 w-8 bg-[#5d4037] opacity-20' />
      <div className='pixel-rotate fixed top-40 right-20 h-6 w-6 bg-[#ff5252] opacity-20' />
      <div className='pixel-rotate fixed bottom-40 left-1/4 h-10 w-10 bg-[#5d4037] opacity-10' />
      <div className='pixel-rotate fixed right-1/3 bottom-20 h-8 w-8 bg-[#ff5252] opacity-15' />

      <div className='relative container mx-auto max-w-4xl px-4 sm:px-6'>
        <div className='mb-8 text-center sm:mb-12'>
          <h1 className='pixel-text mb-3 text-xl text-[#5d4037] sm:text-2xl'>
            냉장고 재료로 레시피 찾기
          </h1>
          <p className='text-base text-[#5d4037]/70 sm:text-lg'>
            재료 사진을 업로드하고 맞춤형 한식 레시피를 추천받으세요
          </p>
        </div>

        <div className='space-y-6'>
          <ImageUpload
            onImageSelect={(data) => {
              setImageData(data);
              setError(null);
            }}
          />

          {error && (
            <div className='pixel-shadow border-4 border-[#ff5252] bg-[#ffe0e0] p-4 text-center'>
              <p className='pixel-text text-xs text-[#5d4037]'>{error}</p>
            </div>
          )}

          {imageData && (
            <div className='flex justify-center'>
              <button
                onClick={handleAnalyze}
                disabled={uploading}
                className={`pixel-button pixel-shadow inline-flex cursor-pointer items-center justify-center gap-3 border-4 border-[#5d4037] px-8 py-4 transition-all ${
                  uploading
                    ? 'cursor-not-allowed bg-[#5d4037]/20 text-[#5d4037]/40'
                    : 'bg-[#ff5252] text-white hover:translate-x-2 hover:translate-y-2 hover:shadow-none'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    <span className='pixel-text text-xs'>업로드 중...</span>
                  </>
                ) : (
                  <>
                    <span className='pixel-text text-xs'>재료 분석하기</span>
                    <ArrowRight className='h-5 w-5' />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3'>
          <div className='pixel-shadow border-4 border-[#5d4037] bg-white p-6 text-center'>
            <div className='pixel-text mb-3 text-2xl text-[#ff5252]'>01</div>
            <h3 className='pixel-text mb-2 text-xs text-[#5d4037]'>사진 업로드</h3>
            <p className='text-sm text-[#5d4037]/70'>재료 사진을 촬영하거나 업로드하세요</p>
          </div>
          <div className='pixel-shadow border-4 border-[#5d4037] bg-white p-6 text-center'>
            <div className='pixel-text mb-3 text-2xl text-[#ff5252]'>02</div>
            <h3 className='pixel-text mb-2 text-xs text-[#5d4037]'>AI 인식</h3>
            <p className='text-sm text-[#5d4037]/70'>AI가 재료를 자동으로 인식합니다</p>
          </div>
          <div className='pixel-shadow border-4 border-[#5d4037] bg-white p-6 text-center'>
            <div className='pixel-text mb-3 text-2xl text-[#ff5252]'>03</div>
            <h3 className='pixel-text mb-2 text-xs text-[#5d4037]'>레시피 받기</h3>
            <p className='text-sm text-[#5d4037]/70'>맞춤형 한식 레시피를 추천받으세요</p>
          </div>
        </div>
      </div>
    </main>
  );
}
