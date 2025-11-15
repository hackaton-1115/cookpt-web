import { Brain, Camera, Clock, Heart, Sparkles, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Camera,
    title: '사진으로 간편하게',
    description:
      '냉장고 속 재료나 식재료를 사진으로 찍기만 하면 됩니다. 복잡한 입력은 필요 없어요.',
  },
  {
    icon: Brain,
    title: 'AI 식재료 인식',
    description: '최신 AI 기술로 사진 속 재료를 정확하게 인식하고 분석합니다.',
  },
  {
    icon: Sparkles,
    title: '맞춤형 레시피',
    description: '당신의 재료로 만들 수 있는 최적의 레시피를 실시간으로 추천해드립니다.',
  },
  {
    icon: Clock,
    title: '빠른 추천',
    description: '몇 초 안에 여러 레시피 옵션을 받아보고 바로 요리를 시작하세요.',
  },
  {
    icon: Heart,
    title: '영양 정보 제공',
    description: '각 레시피의 칼로리, 영양소 정보를 한눈에 확인할 수 있습니다.',
  },
  {
    icon: Users,
    title: '커뮤니티 공유',
    description: '나만의 레시피를 공유하고 다른 사용자들의 요리 팁을 배워보세요.',
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="to-card/50 bg-gradient-to-b from-background px-4 py-12 sm:py-20"
    >
      <div className="container mx-auto">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="border-primary/20 bg-primary/10 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">주요 기능</span>
          </div>
          <h2 className="mb-4 text-3xl sm:mb-6 sm:text-4xl lg:text-5xl">
            요리가 더 쉬워지는
            <br />
            <span className="text-primary">스마트한 경험</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            CookPT는 AI 기술로 당신의 요리 생활을 완전히 바꿔놓습니다
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 border-primary/10 hover:border-primary/30 hover:shadow-primary/5 transition-all hover:shadow-lg"
            >
              <CardContent className="space-y-3 p-5 sm:space-y-4 sm:p-6">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
