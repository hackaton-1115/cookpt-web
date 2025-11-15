import { Apple, Smartphone } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function CallToAction() {
  return (
    <section id="download" className="relative overflow-hidden px-4 py-12 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />

      <div className="container relative z-10 mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
            <div className="border-primary/20 shadow-primary/10 relative overflow-hidden rounded-2xl border shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjMxMTMyODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Fresh ingredients"
                width={1080}
                height={720}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          </div>

          <div className="order-1 space-y-6 sm:space-y-8 lg:order-2">
            <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
              지금 바로 시작하고
              <br />
              <span className="text-primary">새로운 요리 경험</span>을
              <br />
              만나보세요
            </h2>

            <p className="text-muted-foreground max-w-lg text-lg sm:text-xl">
              무료로 다운로드하고 매일 새로운 레시피를 발견하세요. 50,000명 이상의 사용자가 이미
              CookPT와 함께하고 있습니다.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="w-full bg-primary px-6 py-5 text-base hover:bg-primary/90 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                >
                  <Apple className="mr-2 h-5 w-5" />
                  App Store
                </Button>
              </Link>
              <Link href="/upload">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5 w-full px-6 py-5 text-base sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Google Play
                </Button>
              </Link>
            </div>

            <div className="space-y-3 pt-4">
              <div className="text-muted-foreground flex items-center gap-3 text-sm sm:text-base">
                <div className="bg-primary/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span>무료로 시작, 별도 결제 없음</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-3 text-sm sm:text-base">
                <div className="bg-primary/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span>매일 업데이트되는 새로운 레시피</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-3 text-sm sm:text-base">
                <div className="bg-primary/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span>iOS 및 Android 모두 지원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
