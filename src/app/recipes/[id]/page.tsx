'use client';

import { ArrowLeft, ChefHat, Clock, Flame, Heart, Loader2, Users } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { checkRecipeLiked, toggleRecipeLike } from '@/lib/recipe-likes';
import { findRecipeById } from '@/lib/recipe-storage';
import { Recipe } from '@/lib/types';

const difficultyColor = {
  easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  hard: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const loadRecipe = async () => {
      // URL 디코딩 (한글 ID 처리)
      const id = decodeURIComponent(params.id as string);

      // Supabase에서 AI 생성 레시피 찾기
      const aiRecipe = await findRecipeById(id);
      setRecipe(aiRecipe);
      setLikesCount(aiRecipe?.likesCount || 0);

      // 좋아요 상태 확인
      if (aiRecipe) {
        const isLiked = await checkRecipeLiked(id);
        setLiked(isLiked);
      }

      setLoading(false);
    };

    loadRecipe();
  }, [params.id]);

  const handleLikeClick = async () => {
    if (!recipe || isLiking) return;

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

  const totalTime = recipe ? recipe.prepTime + recipe.cookTime : 0;

  return loading ? (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
        <p className='text-muted-foreground'>레시피를 불러오는 중...</p>
      </div>
    </div>
  ) : !recipe ? (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h2 className='mb-2 text-2xl font-bold'>레시피를 찾을 수 없습니다</h2>
        <p className='text-muted-foreground mb-6'>요청하신 레시피가 존재하지 않습니다.</p>
        <Button onClick={() => router.push('/recipes')}>레시피 목록으로 돌아가기</Button>
      </div>
    </div>
  ) : (
    <main className='bg-background min-h-screen'>
      <div className='container mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8'>
        <Link href='/recipes'>
          <Button variant='ghost' className='mb-4 sm:mb-6' size='sm'>
            <ArrowLeft className='mr-1 h-4 w-4 sm:mr-2' />
            레시피 목록으로
          </Button>
        </Link>

        <div className='grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-5'>
          <div className='space-y-4 sm:space-y-6 md:col-span-3'>
            <div>
              <div className='relative mb-3 h-56 overflow-hidden rounded-lg sm:mb-4 sm:h-72 md:h-96'>
                <Image
                  src={recipe.image || '/placeholder.svg'}
                  alt={recipe.title}
                  fill
                  className='object-cover'
                />
              </div>

              <div className='mb-2 flex flex-wrap items-center gap-2 sm:mb-3'>
                <Badge className={difficultyColor[recipe.difficulty] + ' text-xs'}>
                  {recipe.difficulty}
                </Badge>
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant='secondary' className='text-xs'>
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className='mb-3 flex items-start justify-between gap-3 sm:mb-4'>
                <div className='flex-1'>
                  <h1 className='text-foreground mb-2 text-2xl font-bold text-balance sm:mb-3 sm:text-3xl md:text-4xl'>
                    {recipe.title}
                  </h1>
                  <p className='text-muted-foreground text-base text-pretty sm:text-lg'>
                    {recipe.description}
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='lg'
                  className='shrink-0'
                  onClick={handleLikeClick}
                  disabled={isLiking}
                >
                  <Heart className={`mr-2 h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{likesCount}</span>
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
              <Card className='py-0'>
                <CardContent className='p-3 text-center sm:p-4'>
                  <Clock className='text-primary mx-auto mb-1 h-5 w-5 sm:mb-2 sm:h-6 sm:w-6' />
                  <div className='text-xl font-bold sm:text-2xl'>{totalTime}</div>
                  <div className='text-muted-foreground text-xs'>분</div>
                </CardContent>
              </Card>
              <Card className='py-0'>
                <CardContent className='p-3 text-center sm:p-4'>
                  <Users className='text-primary mx-auto mb-1 h-5 w-5 sm:mb-2 sm:h-6 sm:w-6' />
                  <div className='text-xl font-bold sm:text-2xl'>{recipe.servings}</div>
                  <div className='text-muted-foreground text-xs'>인분</div>
                </CardContent>
              </Card>
              <Card className='py-0'>
                <CardContent className='p-3 text-center sm:p-4'>
                  <ChefHat className='text-primary mx-auto mb-1 h-5 w-5 sm:mb-2 sm:h-6 sm:w-6' />
                  <div className='text-lg font-bold sm:text-xl'>{recipe.category}</div>
                  <div className='text-muted-foreground text-xs'>카테고리</div>
                </CardContent>
              </Card>
              <Card className='py-0'>
                <CardContent className='p-3 text-center sm:p-4'>
                  <Flame className='text-primary mx-auto mb-1 h-5 w-5 sm:mb-2 sm:h-6 sm:w-6' />
                  <div className='text-xl font-bold sm:text-2xl'>{recipe.nutrition.calories}</div>
                  <div className='text-muted-foreground text-xs'>칼로리</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg sm:text-xl'>재료</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 sm:space-y-3'>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className='flex items-start gap-2 sm:gap-3'>
                      <div className='bg-primary/10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6'>
                        <span className='text-primary text-xs font-semibold'>{index + 1}</span>
                      </div>
                      <div className='flex-1 text-sm sm:text-base'>
                        <span className='font-medium'>{ingredient.name}</span>
                        <span className='text-muted-foreground text-xs sm:text-sm'>
                          {' '}
                          - {ingredient.amount}
                          {ingredient.unit ? ` ${ingredient.unit}` : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg sm:text-xl'>조리법</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className='space-y-3 sm:space-y-4'>
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className='flex gap-3 sm:gap-4'>
                      <div className='bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-8 sm:w-8 sm:text-base'>
                        {index + 1}
                      </div>
                      <p className='flex-1 pt-1 text-sm text-pretty sm:text-base'>{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-4 sm:space-y-6 md:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg sm:text-xl'>영양 정보</CardTitle>
                <p className='text-muted-foreground text-xs sm:text-sm'>
                  1인분 기준 (총 {recipe.servings}인분)
                </p>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-sm font-medium'>칼로리</span>
                      <span className='font-bold'>{recipe.nutrition.calories} kcal</span>
                    </div>
                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                      <div
                        className='bg-primary h-full'
                        style={{
                          width: `${(recipe.nutrition.calories / 800) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-sm font-medium'>단백질</span>
                      <span className='font-bold'>{recipe.nutrition.protein}g</span>
                    </div>
                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                      <div
                        className='bg-accent h-full'
                        style={{
                          width: `${(recipe.nutrition.protein / 50) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-sm font-medium'>탄수화물</span>
                      <span className='font-bold'>{recipe.nutrition.carbs}g</span>
                    </div>
                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                      <div
                        className='bg-primary h-full'
                        style={{
                          width: `${(recipe.nutrition.carbs / 100) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-sm font-medium'>지방</span>
                      <span className='font-bold'>{recipe.nutrition.fat}g</span>
                    </div>
                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                      <div
                        className='bg-accent h-full'
                        style={{
                          width: `${(recipe.nutrition.fat / 50) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-sm font-medium'>식이섬유</span>
                      <span className='font-bold'>{recipe.nutrition.fiber}g</span>
                    </div>
                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                      <div
                        className='bg-primary h-full'
                        style={{
                          width: `${(recipe.nutrition.fiber / 20) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg sm:text-xl'>조리 도구</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {recipe.cookingTools.map((tool) => (
                    <Badge key={tool} variant='outline' className='text-xs capitalize'>
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg sm:text-xl'>조리 시간</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>준비 시간</span>
                  <span className='font-semibold'>{recipe.prepTime}분</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>조리 시간</span>
                  <span className='font-semibold'>{recipe.cookTime}분</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-semibold'>총 시간</span>
                  <span className='text-primary font-bold'>{totalTime}분</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
