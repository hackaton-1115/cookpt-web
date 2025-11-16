import { ChefHat, Clock, Heart, Zap } from 'lucide-react';

const benefits = [
  { icon: Zap, text: '3초만에 레시피 생성' },
  { icon: Clock, text: '시간과 재료 절약' },
  { icon: Heart, text: '음식물 쓰레기 감소' },
  { icon: ChefHat, text: '다양한 요리 도전' },
];

export function Benefits() {
  return (
    <section className='bg-[#ffe0e0] px-6 py-16'>
      <div className='mx-auto max-w-4xl'>
        <h2 className='pixel-text mb-12 text-center text-xl text-[#5d4037]'>왜 CookPT인가요?</h2>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className='pixel-shadow-sm flex items-center gap-4 border-4 border-[#5d4037] bg-white p-4'
            >
              <div className='flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252]'>
                <benefit.icon className='h-6 w-6 text-white' />
              </div>
              <span className='text-lg text-[#5d4037]'>{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
