'use client';

import { ChefHat, Clock, Heart, Users } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLogin } from '@/hooks/useLogin';
import { toggleRecipeLike } from '@/lib/recipe-likes';
import { createClient } from '@/lib/supabase/client';
import { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
  matchPercentage?: number;
  initialLiked?: boolean;
}

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

  const difficultyColor = {
    easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className='group h-full cursor-pointer overflow-hidden transition-shadow hover:shadow-lg'>
        <div className='relative h-40 overflow-hidden sm:h-48'>
          <Image
            src={recipe.image || '/placeholder.svg'}
            alt={recipe.title}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {matchPercentage !== undefined && matchPercentage > 0 && (
            <div className='bg-primary text-primary-foreground absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-semibold sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-sm'>
              {Math.round(matchPercentage)}% match
            </div>
          )}
          <Badge
            className={`absolute top-2 left-2 text-xs sm:top-3 sm:left-3 ${
              difficultyColor[recipe.difficulty]
            }`}
          >
            {recipe.difficulty}
          </Badge>
          <Button
            variant='ghost'
            size='icon'
            className='absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white sm:h-9 sm:w-9'
            onClick={handleLikeClick}
            disabled={isLiking}
          >
            <Heart
              className={`h-4 w-4 transition-all sm:h-5 sm:w-5 ${
                liked ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        </div>

        <CardContent className='p-3 sm:p-4'>
          <h3 className='group-hover:text-primary mb-1 line-clamp-1 text-base font-bold transition-colors sm:mb-2 sm:text-lg'>
            {recipe.title}
          </h3>
          <p className='text-muted-foreground mb-2 line-clamp-2 text-xs sm:mb-3 sm:text-sm'>
            {recipe.description}
          </p>

          <div className='text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm'>
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3 sm:h-4 sm:w-4' />
              <span>{totalTime} min</span>
            </div>
            <div className='flex items-center gap-1'>
              <Users className='h-3 w-3 sm:h-4 sm:w-4' />
              <span>{recipe.servings}</span>
            </div>
            <div className='flex items-center gap-1'>
              <ChefHat className='h-3 w-3 sm:h-4 sm:w-4' />
              <span className='truncate'>{recipe.category}</span>
            </div>
            {likesCount > 0 && (
              <div className='flex items-center gap-1'>
                <Heart className='h-3 w-3 fill-red-500 text-red-500 sm:h-4 sm:w-4' />
                <span>{likesCount}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className='p-3 pt-0 sm:p-4'>
          <div className='flex flex-wrap gap-2'>
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant='secondary' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
      <LoginDialogComponent />
    </Link>
  );
}
