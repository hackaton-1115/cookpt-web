'use client';

import { ChefHat, Clock, Heart, Users } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLogin } from '@/hooks/useLogin';
import { toggleRecipeLike } from '@/lib/recipe-likes';
import { createClient } from '@/lib/supabase/client';
import { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
  matchPercentage?: number;
  initialLiked?: boolean;
}

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

export function RecipeCard({ recipe, matchPercentage, initialLiked = false }: RecipeCardProps) {
  const { requestLogin, LoginDialogComponent } = useLogin();
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likesCount, setLikesCount] = useState<number>(recipe.likesCount || 0);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const totalTime = recipe.prepTime + recipe.cookTime;

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();

    // 인증 상태 변경 감지
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiking) return;

    // 로그인하지 않은 경우 로그인 요청
    if (!isLoggedIn) {
      requestLogin();
      return;
    }

    setIsLiking(true);
    try {
      const newLiked = await toggleRecipeLike(recipe.id);
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('좋아요 실패:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className='cursor-pointer border-4 border-[#5d4037] bg-white shadow-[8px_8px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none'>
        {/* 이미지 영역 */}
        <div className='relative h-48 overflow-hidden border-b-4 border-[#5d4037]'>
          <Image
            src={recipe.image || '/placeholder.svg'}
            alt={recipe.title}
            fill
            className='object-cover'
            style={{ imageRendering: 'pixelated' }}
          />

          {/* 매치 퍼센트 배지 */}
          {matchPercentage !== undefined && matchPercentage > 0 && (
            <div className='pixel-text absolute top-2 right-2 border-2 border-[#5d4037] bg-[#ff5252] px-3 py-1 text-xs text-white shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
              {Math.round(matchPercentage)}%
            </div>
          )}

          {/* 난이도 배지 */}
          <div className='absolute top-2 left-2 border-2 border-[#5d4037] bg-[#ffe0e0] px-2 py-1 text-xs text-[#5d4037]'>
            {difficultyLabels[recipe.difficulty]}
          </div>

          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeClick}
            disabled={isLiking}
            className='absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center border-2 border-[#5d4037] bg-white/90 shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                liked ? 'fill-[#ff5252] text-[#ff5252]' : 'text-[#5d4037]'
              }`}
            />
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className='p-4'>
          {/* 타이틀 */}
          <h3 className='pixel-text mb-3 line-clamp-2 text-xs text-[#5d4037]'>{recipe.title}</h3>

          {/* 설명 */}
          <p className='mb-3 line-clamp-2 text-sm text-[#5d4037]/70'>{recipe.description}</p>

          {/* 메타 정보 */}
          <div className='mb-3 flex flex-wrap items-center gap-4 text-sm text-[#5d4037]/70'>
            <div className='flex items-center gap-1'>
              <Clock className='h-4 w-4' />
              <span>{totalTime}분</span>
            </div>
            <div className='flex items-center gap-1'>
              <Users className='h-4 w-4' />
              <span>{recipe.servings}인분</span>
            </div>
            <div className='flex items-center gap-1'>
              <ChefHat className='h-4 w-4' />
              <span className='truncate'>{recipe.category}</span>
            </div>
            {likesCount > 0 && (
              <div className='flex items-center gap-1'>
                <Heart className='h-4 w-4 fill-[#ff5252] text-[#ff5252]' />
                <span>{likesCount}</span>
              </div>
            )}
          </div>

          {/* 태그 */}
          <div className='flex flex-wrap gap-2'>
            {recipe.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                className='border-2 border-[#5d4037] bg-[#ffe0e0] px-2 py-1 text-xs text-[#5d4037]'
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      <LoginDialogComponent />
    </Link>
  );
}
