'use client';

import { ArrowRight, ChefHat, Sparkles } from 'lucide-react';

import Link from 'next/link';

import { PixelButton } from '@/components/ui/pixel-button';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';

export function Hero() {
  return (
    <section className='relative overflow-hidden px-6 py-20'>
      {/* Pixel Decorations */}
      <div className='pixel-rotate fixed top-20 left-10 h-8 w-8 bg-[#5d4037] opacity-20' />
      <div className='pixel-rotate fixed top-40 right-20 h-6 w-6 bg-[#ff5252] opacity-20' />
      <div className='pixel-rotate fixed bottom-40 left-1/4 h-10 w-10 bg-[#5d4037] opacity-10' />

      <div className='mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <div className='mb-6 inline-block'>
            <PixelIconBox icon={ChefHat} size='large' variant='primary' className='mx-auto mb-4' />
          </div>

          <h1 className='pixel-text mb-6 text-2xl text-[#5d4037] md:text-3xl'>CookPT</h1>

          <p className='mx-auto mb-4 max-w-3xl text-xl text-[#5d4037] md:text-2xl'>
            사진 한 장으로
            <br />
            <span className='text-[#ff5252]'>AI가 만드는 맞춤 레시피</span>
          </p>

          <p className='mx-auto mb-8 max-w-2xl text-lg text-[#5d4037]/70'>
            냉장고 속 재료를 찍으면 AI가 즉시 분석해서 당신만을 위한 레시피를 추천해드립니다.
          </p>

          <Link href='/upload'>
            <PixelButton size='large' className='inline-flex items-center gap-3 whitespace-nowrap'>
              <Sparkles className='h-6 w-6' />
              <span>지금 시작하기</span>
              <ArrowRight className='h-6 w-6' />
            </PixelButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
