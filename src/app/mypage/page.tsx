'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ArrowRight, ChefHat, Heart, Loader2, User } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLikedRecipeIds } from '@/lib/recipe-likes';
import { createClient } from '@/lib/supabase/client';

export default function MyPage() {
  const [likedCount, setLikedCount] = useState<number>(0);
  const [myRecipesCount, setMyRecipesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadUserAndStats = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        router.push('/login');
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
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return loading ? (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
        <h2 className='mb-2 text-xl font-semibold'>마이페이지를 불러오는 중...</h2>
      </div>
    </div>
  ) : (
    <main className='bg-background min-h-screen py-8'>
      <div className='container mx-auto max-w-4xl px-4'>
        {/* 페이지 헤더 */}
        <div className='mb-8'>
          <div className='mb-2 flex items-center gap-2'>
            <User className='h-8 w-8' />
            <h1 className='text-foreground text-3xl font-bold'>마이페이지</h1>
          </div>
          <p className='text-muted-foreground'>내 정보와 활동을 확인하세요</p>
        </div>

        {/* 사용자 정보 카드 */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 rounded-full p-3'>
                  <User className='text-primary h-8 w-8' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold'>
                    {user?.user_metadata?.full_name || '사용자'}님
                  </h1>
                  <p className='text-muted-foreground text-sm'>{user?.email}</p>
                </div>
              </div>
              <Button variant='outline' onClick={handleLogout} className='text-red-600'>
                로그아웃
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 빠른 메뉴 */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Link href='/my-recipes'>
            <Card className='hover:border-primary cursor-pointer transition-colors'>
              <CardContent className='flex items-center gap-4 p-6'>
                <div className='bg-primary/10 rounded-full p-3'>
                  <ChefHat className='text-primary h-8 w-8' />
                </div>
                <div className='flex-1'>
                  <h3 className='mb-1 text-lg font-semibold'>내 레시피</h3>
                  <p className='text-muted-foreground text-sm'>{myRecipesCount}개의 레시피</p>
                </div>
                <ArrowRight className='text-muted-foreground h-5 w-5' />
              </CardContent>
            </Card>
          </Link>

          <Link href='/favorites'>
            <Card className='hover:border-primary cursor-pointer transition-colors'>
              <CardContent className='flex items-center gap-4 p-6'>
                <div className='bg-red-500/10 rounded-full p-3'>
                  <Heart className='h-8 w-8 fill-red-500 text-red-500' />
                </div>
                <div className='flex-1'>
                  <h3 className='mb-1 text-lg font-semibold'>좋아요한 레시피</h3>
                  <p className='text-muted-foreground text-sm'>{likedCount}개의 레시피</p>
                </div>
                <ArrowRight className='text-muted-foreground h-5 w-5' />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
