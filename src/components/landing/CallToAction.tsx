import { Sparkles } from 'lucide-react';

import Link from 'next/link';

import { PixelButton } from '@/components/ui/pixel-button';

const stats = [
  { value: '9+', label: '요리 국적' },
  { value: '7+', label: '레시피 스타일' },
  { value: '7+', label: '조리 도구' },
  { value: '∞', label: '가능한 조합' },
];

export function CallToAction() {
  return (
    <section id='download' className='px-6 py-16'>
      <div className='mx-auto max-w-4xl text-center'>
        <h2 className='pixel-text mb-6 text-xl text-[#5d4037]'>지금 바로 체험해보세요</h2>

        <p className='mb-8 text-lg text-[#5d4037]/70'>
          냉장고에 있는 재료로 어떤 요리를 만들 수 있을까요?
          <br />
          지금 바로 사진을 업로드하고 맞춤 레시피를 받아보세요!
        </p>

        <div className='pixel-shadow mb-8 border-4 border-[#5d4037] bg-white p-8'>
          <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='pixel-text mb-2 text-2xl text-[#ff5252]'>{stat.value}</div>
                <div className='text-sm text-[#5d4037]/60'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Link href='/upload'>
          <PixelButton size='large' className='inline-flex items-center gap-3 whitespace-nowrap'>
            <Sparkles className='h-6 w-6' />
            <span>무료로 시작하기</span>
          </PixelButton>
        </Link>
      </div>
    </section>
  );
}
