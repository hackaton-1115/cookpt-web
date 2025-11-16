'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ChefHat, Menu, User, X } from 'lucide-react';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import LoginDialog from '@/components/auth/LoginDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PixelButton } from '@/components/ui/pixel-button';
import { createClient } from '@/lib/supabase/client';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const supabase = createClient();

  useEffect(() => {
    // 현재 사용자 가져오기
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className='fixed top-0 z-50 w-full border-b-4 border-[#5d4037] bg-[#ffe0e0]'>
      <div className='container mx-auto flex items-center justify-between px-4 py-4'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='flex h-10 w-10 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252]'>
            <ChefHat className='pixelated h-6 w-6 text-white' />
          </div>
          <span className='pixel-text text-sm text-[#5d4037]'>CookPT</span>
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          <Link
            href='/all-recipes'
            className='text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
          >
            모든 레시피
          </Link>
          <Link
            href='/features'
            className='text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
          >
            기능
          </Link>
          <Link
            href='/how-it-works'
            className='text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
          >
            작동 방식
          </Link>
          <Link
            href='/download'
            className='text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
          >
            다운로드
          </Link>
        </div>

        <div className='flex items-center gap-3'>
          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='hidden gap-2 border-2 border-[#5d4037] bg-white hover:bg-white/90 md:inline-flex'
                    >
                      <User className='h-4 w-4' />
                      <span className='max-w-[150px] truncate'>
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='border-2 border-[#5d4037] bg-white'>
                    <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href='/mypage'>마이페이지</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/upload'>앱 시작하기</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <LoginDialog
                  trigger={
                    <PixelButton variant='primary' className='hidden whitespace-nowrap md:inline-flex'>
                      앱 시작하기
                    </PixelButton>
                  }
                />
              )}
            </>
          )}

          <Button
            size='lg'
            variant='ghost'
            className='border-2 border-[#5d4037] bg-white hover:bg-white/90 md:hidden'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='border-t-2 border-[#5d4037] bg-[#ffe0e0] md:hidden'>
          <div className='container mx-auto space-y-4 px-4 py-6'>
            <Link
              href='/all-recipes'
              className='block py-2 text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
              onClick={() => setMobileMenuOpen(false)}
            >
              모든 레시피
            </Link>
            <Link
              href='/features'
              className='block py-2 text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
              onClick={() => setMobileMenuOpen(false)}
            >
              기능
            </Link>
            <Link
              href='/how-it-works'
              className='block py-2 text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
              onClick={() => setMobileMenuOpen(false)}
            >
              작동 방식
            </Link>
            <Link
              href='/download'
              className='block py-2 text-[#5d4037]/70 transition-colors hover:text-[#5d4037]'
              onClick={() => setMobileMenuOpen(false)}
            >
              다운로드
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <div className='mt-4 border-t-2 border-[#5d4037] pt-4'>
                    <div className='mb-3 flex items-center gap-2 px-2'>
                      <User className='h-4 w-4' />
                      <span className='truncate text-sm font-medium'>
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </div>
                    <Link href='/favorites' onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        size='lg'
                        variant='outline'
                        className='mb-2 w-full border-2 border-[#5d4037] bg-white'
                      >
                        좋아요한 레시피
                      </Button>
                    </Link>
                    <Link href='/upload' onClick={() => setMobileMenuOpen(false)}>
                      <PixelButton variant='primary' className='w-full whitespace-nowrap'>
                        앱 시작하기
                      </PixelButton>
                    </Link>
                    <Button
                      variant='outline'
                      size='lg'
                      className='mt-2 w-full border-2 border-[#5d4037] bg-white text-red-600'
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <LoginDialog
                    trigger={
                      <PixelButton variant='primary' className='mt-4 w-full whitespace-nowrap'>
                        앱 시작하기
                      </PixelButton>
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
