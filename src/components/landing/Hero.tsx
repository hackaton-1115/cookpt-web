'use client'

import { Camera, Sparkles } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface HeroProps {
  onLearnMore?: () => void
}

export function Hero({ onLearnMore }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-24 sm:pb-20 sm:pt-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

      <div className="container relative z-10 mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="border-primary/20 bg-primary/10 inline-flex items-center gap-2 rounded-full border px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">AI 기반 레시피 추천</span>
            </div>

            <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
              사진 한 장으로
              <br />
              <span className="text-primary">맞춤 레시피</span>를
              <br />
              바로 만나보세요
            </h1>

            <p className="text-muted-foreground max-w-lg text-lg sm:text-xl">
              냉장고 속 재료를 찍으면 AI가 즉시 분석해서 당신만을 위한 레시피를 추천해드립니다.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 px-6 py-5 text-base sm:px-8 sm:py-6 sm:text-lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  지금 시작하기
                </Button>
              </Link>
              {onLearnMore && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5 px-6 py-5 text-base sm:px-8 sm:py-6 sm:text-lg"
                  onClick={onLearnMore}
                >
                  더 알아보기
                </Button>
              )}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
            <div className="border-primary/20 shadow-primary/10 relative overflow-hidden rounded-2xl border shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1617735605078-8a9336be0816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwaW5ncmVkaWVudHMlMjBraXRjaGVufGVufDF8fHx8MTc2MzA5NzE5Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cooking ingredients"
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
