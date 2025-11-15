import { Facebook, Instagram, Sparkles, Youtube } from 'lucide-react'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-border/40 border-t px-4 py-12">
      <div className="container mx-auto">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative rounded-lg bg-primary p-2">
                <Sparkles className="text-primary-foreground h-5 w-5" />
                <div className="absolute inset-0 rounded-lg bg-primary opacity-50 blur-md" />
              </div>
              <span className="text-xl">CookPT</span>
            </Link>
            <p className="text-muted-foreground">AI로 더 쉽고 즐거운 요리 생활을 만듭니다</p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="bg-primary/10 hover:bg-primary/20 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              >
                <Instagram className="h-4 w-4 text-primary" />
              </a>
              <a
                href="#"
                className="bg-primary/10 hover:bg-primary/20 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              >
                <Youtube className="h-4 w-4 text-primary" />
              </a>
              <a
                href="#"
                className="bg-primary/10 hover:bg-primary/20 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              >
                <Facebook className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4">제품</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  기능
                </a>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  레시피
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  시작하기
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">고객지원</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  도움말
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  문의하기
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">회사</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  소개
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border/40 text-muted-foreground border-t pt-8 text-center text-sm">
          <p>&copy; 2025 CookPT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
