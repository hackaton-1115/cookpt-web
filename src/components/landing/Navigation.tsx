'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Menu, Sparkles, User, X } from 'lucide-react';

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
          {/* 데스크톱: 로그인 상태에 따른 UI */}
          {!isLoading && (
            <>
              {user ? (
                <>
                  {/* 로그인된 상태: 사용자 프로필 메뉴만 표시 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='hidden gap-2 md:inline-flex'>
                        <User className='h-4 w-4' />
                        <span className='max-w-[150px] truncate'>
                          {user.user_metadata?.full_name || user.email}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='bg-background/80 backdrop-blur-sm'>
                      <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href='/upload'>앱 시작하기</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
                        로그아웃
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* 비로그인 상태: LoginDialog 표시 */}
                  <LoginDialog
                    trigger={
                      <Button
                        size='lg'
                        className='bg-primary hover:bg-primary/90 hidden md:inline-flex'
                      >
                        앱 시작하기
                      </Button>
                    }
                  />
                </>
              )}
            </>
          )}

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

            {/* 모바일 메뉴: 로그인 상태에 따른 UI */}
            {!isLoading && (
              <>
                {user ? (
                  <>
                    {/* 로그인된 상태 */}
                    <div className='border-border/40 mt-4 border-t pt-4'>
                      <div className='mb-3 flex items-center gap-2 px-2'>
                        <User className='h-4 w-4' />
                        <span className='truncate text-sm font-medium'>
                          {user.user_metadata?.full_name || user.email}
                        </span>
                      </div>
                      <Link href='/upload' onClick={() => setMobileMenuOpen(false)}>
                        <Button size='lg' className='bg-primary hover:bg-primary/90 w-full'>
                          앱 시작하기
                        </Button>
                      </Link>
                      <Button
                        variant='outline'
                        size='lg'
                        className='mt-2 w-full text-red-600'
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        로그아웃
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 비로그인 상태 */}
                    <LoginDialog
                      trigger={
                        <Button size='lg' className='bg-primary hover:bg-primary/90 mt-4 w-full'>
                          앱 시작하기
                        </Button>
                      }
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
