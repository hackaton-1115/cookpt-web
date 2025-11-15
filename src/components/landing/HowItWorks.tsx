import { BookOpen, Brain, Camera } from 'lucide-react'

import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    number: '01',
    icon: Camera,
    title: '사진 촬영',
    description: '냉장고 속 재료나 식재료를 카메라로 찍어주세요',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI 분석',
    description: 'AI가 사진 속 재료를 인식하고 최적의 조합을 분석합니다',
  },
  {
    number: '03',
    icon: BookOpen,
    title: '레시피 추천',
    description: '당신만을 위한 맞춤 레시피를 즉시 확인하고 요리를 시작하세요',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-12 sm:py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="mb-4 text-3xl sm:mb-6 sm:text-4xl lg:text-5xl">
            <span className="text-primary">3단계</span>로 완성되는
            <br />
            간편한 레시피 찾기
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            복잡한 과정 없이 누구나 쉽게 사용할 수 있습니다
          </p>
        </div>

        <div className="mb-12 grid items-center gap-8 sm:mb-16 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4 sm:space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-card/50 border-primary/10 hover:border-primary/30 transition-all">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex-shrink-0">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 text-sm text-primary">{step.number}</div>
                      <h3 className="mb-2 text-xl">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="from-primary/50 absolute left-8 top-full hidden h-6 w-px bg-gradient-to-b to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
            <div className="border-primary/20 shadow-primary/10 relative overflow-hidden rounded-2xl border shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1553813881-5e74278a18ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZm9vZCUyMHBob3RvfGVufDF8fHx8MTc2MzE4NTc0NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Smartphone food photography"
                width={1080}
                height={720}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
