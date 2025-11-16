'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ChefHat, ChevronDown, Menu, User, X } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import LoginDialog from '@/components/auth/LoginDialog';
import { PixelButton } from '@/components/ui/pixel-button';
import { createClient } from '@/lib/supabase/client';
import { isNativeApp, sendLogoutToNative } from '@/lib/supabase/native-auth';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
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

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    // 네이티브 앱이면 저장된 토큰도 삭제하도록 알림
    if (isNativeApp()) {
      sendLogoutToNative();
    }

    setUser(null);
    setDropdownOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setDropdownOpen(false);
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
                /* 로그인된 사용자 드롭다운 */
                <div className='relative hidden md:block' ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className='flex items-center gap-2 border-2 border-[#5d4037] bg-white px-4 py-2 text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                  >
                    <User className='h-4 w-4' />
                    <span className='max-w-[150px] truncate text-sm'>
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* 픽셀 드롭다운 메뉴 */}
                  {dropdownOpen && (
                    <div className='absolute top-full right-0 mt-2 w-48 border-4 border-[#5d4037] bg-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
                      <div className='border-b-2 border-[#5d4037] px-4 py-3'>
                        <p className='pixel-text text-xs text-[#5d4037]'>내 계정</p>
                      </div>
                      <button
                        onClick={() => handleNavigation('/mypage')}
                        className='w-full border-b-2 border-[#5d4037]/20 px-4 py-3 text-left text-sm text-[#5d4037] transition-colors hover:bg-[#ffe0e0]'
                      >
                        마이페이지
                      </button>
                      <button
                        onClick={() => handleNavigation('/upload')}
                        className='w-full border-b-2 border-[#5d4037]/20 px-4 py-3 text-left text-sm text-[#5d4037] transition-colors hover:bg-[#ffe0e0]'
                      >
                        앱 시작하기
                      </button>
                      <button
                        onClick={handleLogout}
                        className='w-full px-4 py-3 text-left text-sm text-[#ff5252] transition-colors hover:bg-[#ffe0e0]'
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* 로그인 버튼 */
                <>
                  <PixelButton
                    variant='primary'
                    className='hidden whitespace-nowrap md:inline-flex'
                    onClick={() => setLoginDialogOpen(true)}
                  >
                    로그인
                  </PixelButton>
                  <LoginDialog isOpen={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
                </>
              )}
            </>
          )}

          <button
            className='flex h-10 w-10 items-center justify-center border-2 border-[#5d4037] bg-white shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none md:hidden'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
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
                    <Link href='/mypage' onClick={() => setMobileMenuOpen(false)}>
                      <button className='mb-2 w-full border-2 border-[#5d4037] bg-white px-4 py-3 text-left text-sm text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'>
                        마이페이지
                      </button>
                    </Link>
                    <Link href='/favorites' onClick={() => setMobileMenuOpen(false)}>
                      <button className='mb-2 w-full border-2 border-[#5d4037] bg-white px-4 py-3 text-left text-sm text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'>
                        좋아요한 레시피
                      </button>
                    </Link>
                    <Link href='/upload' onClick={() => setMobileMenuOpen(false)}>
                      <PixelButton variant='primary' className='w-full whitespace-nowrap'>
                        앱 시작하기
                      </PixelButton>
                    </Link>
                    <button
                      className='mt-2 w-full border-2 border-[#5d4037] bg-white px-4 py-3 text-left text-sm text-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <>
                    <PixelButton
                      variant='primary'
                      className='mt-4 w-full whitespace-nowrap'
                      onClick={() => {
                        setLoginDialogOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      로그인
                    </PixelButton>
                    <LoginDialog
                      isOpen={loginDialogOpen}
                      onClose={() => setLoginDialogOpen(false)}
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
