'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ArrowRight, ChefHat, Heart, User } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoginRequired } from '@/components/LoginRequired';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';
import { useLogin } from '@/hooks/useLogin';
import { getLikedRecipeIds } from '@/lib/recipe-likes';
import { createClient } from '@/lib/supabase/client';
import { isNativeApp, sendLogoutToNative } from '@/lib/supabase/native-auth';

export default function MyPage() {
  const [likedCount, setLikedCount] = useState<number>(0);
  const [myRecipesCount, setMyRecipesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [needsLogin, setNeedsLogin] = useState<boolean>(false);

  const router = useRouter();
  const { requestLogin, LoginDialogComponent } = useLogin();

  useEffect(() => {
    const loadUserAndStats = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        // 로그인하지 않은 경우 로그인 필요 상태로 설정
        setNeedsLogin(true);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        // 좋아요한 레시피 개수만 가져오기
        const likedIds = await getLikedRecipeIds();
        setLikedCount(likedIds.length);

        // 내가 만든 레시피 개수 가져오기
        const { count } = await supabase
          .from('recipes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUser.id);
        setMyRecipesCount(count || 0);
      } catch (error) {
        console.error('통계 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndStats();
  }, [router, requestLogin]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();

    // 네이티브 앱이면 저장된 토큰도 삭제하도록 알림
    if (isNativeApp()) {
      sendLogoutToNative();
    }

    router.push('/');
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
        <div className='text-center'>
          {/* 픽셀 로더 */}
          <div className='mx-auto mb-6 flex items-center justify-center'>
            <PixelIconBox icon={User} variant='primary' size='large' className='pixel-rotate' />
          </div>
          <p className='pixel-text text-sm text-[#5d4037]'>마이페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <main className='min-h-screen bg-[#fafafa] py-8'>
        <div className='container mx-auto max-w-4xl px-4 sm:px-6'>
          {/* 페이지 헤더 */}
          <div className='mb-8 border-b-4 border-[#5d4037] pb-6'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
                <User className='h-6 w-6 text-white' />
              </div>
              <h1 className='pixel-text text-base text-[#5d4037]'>마이페이지</h1>
            </div>
            <p className='text-sm text-[#5d4037]/70'>내 정보와 활동을 확인하세요</p>
          </div>
          <LoginRequired
            icon={User}
            message='마이페이지를 이용하려면 로그인해주세요'
            onLoginClick={requestLogin}
          />
        </div>
        <LoginDialogComponent />
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-[#fafafa] py-8'>
      <div className='container mx-auto max-w-4xl px-4 sm:px-6'>
        {/* 페이지 헤더 */}
        <div className='mb-8 border-b-4 border-[#5d4037] pb-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
              <User className='h-6 w-6 text-white' />
            </div>
            <h1 className='pixel-text text-base text-[#5d4037]'>마이페이지</h1>
          </div>
          <p className='text-sm text-[#5d4037]/70'>내 정보와 활동을 확인하세요</p>
        </div>

        {/* 사용자 정보 카드 */}
        <div className='mb-8 border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-4'>
              <div className='flex h-16 w-16 items-center justify-center border-4 border-[#5d4037] bg-[#ffe0e0] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
                <User className='h-8 w-8 text-[#5d4037]' />
              </div>
              <div>
                <h1 className='pixel-text mb-2 text-xs text-[#5d4037]'>
                  {user?.user_metadata?.full_name || '사용자'}님
                </h1>
                <p className='text-sm text-[#5d4037]/70'>{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='w-full cursor-pointer border-2 border-[#5d4037] bg-white px-6 py-3 text-sm font-semibold text-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:w-auto'
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 빠른 메뉴 */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {/* 내 레시피 카드 */}
          <Link href='/my-recipes'>
            <div className='cursor-pointer border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'>
              <div className='flex items-center gap-4'>
                <div className='flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#5d4037] bg-[#ffe0e0] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
                  <ChefHat className='h-7 w-7 text-[#5d4037]' />
                </div>
                <div className='flex-1'>
                  <h3 className='mb-2 text-base font-bold text-[#5d4037]'>내 레시피</h3>
                  <p className='text-sm text-[#5d4037]/70'>{myRecipesCount}개의 레시피</p>
                </div>
                <ArrowRight className='h-5 w-5 shrink-0 text-[#5d4037]' />
              </div>
            </div>
          </Link>

          {/* 좋아요한 레시피 카드 */}
          <Link href='/favorites'>
            <div className='cursor-pointer border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'>
              <div className='flex items-center gap-4'>
                <div className='flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#5d4037] bg-[#ffe0e0] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
                  <Heart className='h-7 w-7 fill-[#ff5252] text-[#ff5252]' />
                </div>
                <div className='flex-1'>
                  <h3 className='mb-2 text-base font-bold text-[#5d4037]'>좋아요한 레시피</h3>
                  <p className='text-sm text-[#5d4037]/70'>{likedCount}개의 레시피</p>
                </div>
                <ArrowRight className='h-5 w-5 shrink-0 text-[#5d4037]' />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
