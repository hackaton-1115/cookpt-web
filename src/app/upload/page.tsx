'use client';

import { ArrowRight, Loader2 } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
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
    <main className='bg-background min-h-screen'>
      <div className='container mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8'>
        <div className='mb-6 text-center sm:mb-8'>
          <h1 className='text-foreground mb-2 text-2xl font-bold text-balance sm:mb-3 sm:text-3xl md:text-4xl'>
            Discover Recipes from Your Ingredients
          </h1>
          <p className='text-muted-foreground text-base text-balance sm:text-lg'>
            Upload a photo of your ingredients and get personalized Korean recipe recommendations
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
            <div className='bg-destructive/15 text-destructive border-destructive/50 rounded-lg border p-4 text-center text-sm'>
              {error}
            </div>
          )}

          {imageData && (
            <div className='flex justify-center'>
              <Button onClick={handleAnalyze} size='lg' className='gap-2' disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    Uploading...
                  </>
                ) : (
                  <>
                    Analyze Ingredients
                    <ArrowRight className='h-5 w-5' />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className='mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6'>
          <div className='bg-muted/50 rounded-lg p-4 text-center sm:p-6'>
            <div className='text-primary mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl'>01</div>
            <h3 className='mb-1 text-sm font-semibold sm:mb-2 sm:text-base'>Upload Photo</h3>
            <p className='text-muted-foreground text-xs sm:text-sm'>
              Take or upload a photo of your ingredients
            </p>
          </div>
          <div className='bg-muted/50 rounded-lg p-4 text-center sm:p-6'>
            <div className='text-primary mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl'>02</div>
            <h3 className='mb-1 text-sm font-semibold sm:mb-2 sm:text-base'>AI Recognition</h3>
            <p className='text-muted-foreground text-xs sm:text-sm'>
              Our AI identifies your ingredients automatically
            </p>
          </div>
          <div className='bg-muted/50 rounded-lg p-4 text-center sm:p-6'>
            <div className='text-primary mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl'>03</div>
            <h3 className='mb-1 text-sm font-semibold sm:mb-2 sm:text-base'>Get Recipes</h3>
            <p className='text-muted-foreground text-xs sm:text-sm'>
              Receive personalized Korean recipe recommendations
            </p>
          </div>
        </div>

        <div className='mt-8 text-center sm:mt-12'>
          <p className='text-muted-foreground mb-4'>Or explore recipes by theme</p>
          <Link href='/recipes'>
            <Button variant='outline' size='lg'>
              Browse Recipe Themes
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
