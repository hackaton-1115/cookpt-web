import { ArrowRight } from 'lucide-react';

import { PixelCard } from '@/components/ui/pixel-card';

const steps = [
  {
    number: '01',
    title: '사진 업로드',
    description: '냉장고 속 식재료를 촬영하여 업로드하세요',
  },
  {
    number: '02',
    title: '옵션 선택',
    description: '원하는 음식 국적, 스타일, 조리 도구를 선택하세요',
  },
  {
    number: '03',
    title: '레시피 생성',
    description: 'AI가 맞춤형 레시피를 즉시 생성해드립니다',
  },
];

export function HowItWorks() {
  return (
    <section id='how-it-works' className='px-6 py-16'>
      <div className='mx-auto max-w-6xl'>
        <h2 className='pixel-text mb-12 text-center text-xl text-[#5d4037]'>사용 방법</h2>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {steps.map((step, index) => (
            <div key={index} className='relative'>
              <PixelCard className='p-6 text-center'>
                <div className='pixel-shadow-sm mx-auto mb-4 flex h-16 w-16 items-center justify-center border-4 border-[#5d4037] bg-[#ff5252]'>
                  <span className='pixel-text text-xl text-white'>{step.number}</span>
                </div>
                <h3 className='pixel-text mb-3 text-xs text-[#5d4037]'>{step.title}</h3>
                <p className='text-sm text-[#5d4037]/70'>{step.description}</p>
              </PixelCard>

              {index < steps.length - 1 && (
                <div className='absolute top-1/2 right-0 hidden translate-x-1/2 -translate-y-1/2 md:block'>
                  <ArrowRight className='h-8 w-8 text-[#5d4037]/30' />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
