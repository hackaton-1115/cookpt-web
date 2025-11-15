'use client';

import { Menu, Sparkles, X } from 'lucide-react';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <nav className='border-border/40 bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-sm'>
      <div className='container mx-auto flex items-center justify-between px-4 py-4'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='bg-primary relative rounded-lg p-2'>
            <Sparkles className='text-primary-foreground h-6 w-6' />
            <div className='bg-primary absolute inset-0 rounded-lg opacity-50 blur-md' />
          </div>
          <span className='text-2xl'>CookPT</span>
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          <Link
            href='/features'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            기능
          </Link>
          <Link
            href='/how-it-works'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            작동 방식
          </Link>
          <Link
            href='/download'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            다운로드
          </Link>
        </div>

        <div className='flex items-center gap-3'>
          <Link href='/upload'>
            <Button size='lg' className='bg-primary hover:bg-primary/90 hidden sm:inline-flex'>
              앱 시작하기
            </Button>
          </Link>

          <Button
            size='lg'
            variant='ghost'
            className='md:hidden'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='border-border/40 bg-background/95 border-t backdrop-blur-sm md:hidden'>
          <div className='container mx-auto space-y-4 px-4 py-6'>
            <Link
              href='/features'
              className='text-muted-foreground hover:text-foreground block py-2 transition-colors'
              onClick={() => setMobileMenuOpen(false)}
            >
              기능
            </Link>
            <Link
              href='/how-it-works'
              className='text-muted-foreground hover:text-foreground block py-2 transition-colors'
              onClick={() => setMobileMenuOpen(false)}
            >
              작동 방식
            </Link>
            <Link
              href='/download'
              className='text-muted-foreground hover:text-foreground block py-2 transition-colors'
              onClick={() => setMobileMenuOpen(false)}
            >
              다운로드
            </Link>
            <Link href='/upload'>
              <Button size='lg' className='bg-primary hover:bg-primary/90 mt-4 w-full'>
                앱 시작하기
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
