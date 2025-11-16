import { Brain, Camera, Sparkles } from 'lucide-react';

import { PixelCard } from '@/components/ui/pixel-card';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';

const features = [
  {
    icon: Camera,
    title: '사진으로 시작',
    description: '냉장고 속 재료 사진만 찍으면 AI가 자동으로 식재료를 인식합니다.',
  },
  {
    icon: Brain,
    title: 'AI 맞춤 레시피',
    description: '선호하는 요리 스타일과 조리 도구에 맞춰 완벽한 레시피를 생성합니다.',
  },
  {
    icon: Sparkles,
    title: '상세한 가이드',
    description: '초보자도 쉽게 따라할 수 있는 단계별 조리법과 꿀팁을 제공합니다.',
  },
];

export function Features() {
  return (
    <section id='features' className='bg-[#ffe0e0] px-6 py-16'>
      <div className='mx-auto max-w-6xl'>
        <h2 className='pixel-text mb-12 text-center text-xl text-[#5d4037]'>주요 기능</h2>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {features.map((feature, index) => (
            <PixelCard key={index} interactive className='p-6'>
              <PixelIconBox
                icon={feature.icon}
                variant='secondary'
                size='medium'
                className='mb-4'
              />
              <h3 className='pixel-text mb-3 text-xs text-[#5d4037]'>{feature.title}</h3>
              <p className='text-sm text-[#5d4037]/70'>{feature.description}</p>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}
