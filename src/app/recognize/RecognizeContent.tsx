'use client';

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Flame,
  Loader2,
  UtensilsCrossed,
  Utensils,
} from 'lucide-react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CookingToolCard } from '@/components/CookingToolCard';
import { CuisineCard } from '@/components/CuisineCard';
import { IngredientCard } from '@/components/IngredientCard';
import { ThemeCard } from '@/components/ThemeCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { COOKING_TOOLS } from '@/lib/cooking-tool-data';
import { CUISINES } from '@/lib/cuisine-data';
import { getImageUrl } from '@/lib/image-storage';
import { recognizeIngredients } from '@/lib/ingredient-recognition';
import { getThemesByCategory, THEME_CATEGORIES } from '@/lib/theme-data';
import { RecognizedIngredient } from '@/lib/types';

export default function RecognizeContent() {
  const [loading, setLoading] = useState<boolean>(true);
  const [imageData, setImageData] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<RecognizedIngredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL 파라미터에서 이미지 경로 가져오기
    const imagePath = searchParams.get('image');

    if (!imagePath) {
      router.push('/upload');
      return;
    }

    // Supabase Storage에서 이미지 URL 가져오기
    const imageUrl = getImageUrl(imagePath);
    setImageData(imageUrl);

    const fetchIngredients = async () => {
      try {
        // AI가 이미지 URL로 재료 인식
        const recognized = await recognizeIngredients(imageUrl);
        setIngredients(recognized);
        const autoSelected = new Set(
          recognized.filter((i) => i.confidence > 0.8).map((i) => i.name),
        );
        setSelectedIngredients(autoSelected);
        setLoading(false);
      } catch (err) {
        console.error('재료 인식 실패:', err);
        setError(err instanceof Error ? err.message : '재료 인식 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [router, searchParams]);

  const toggleTheme = (themeId: string) => {
    setSelectedTheme((prev) => (prev === themeId ? null : themeId));
  };

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleCuisine = (cuisineId: string) => {
    setSelectedCuisine((prev) => (prev === cuisineId ? null : cuisineId));
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (selectedIngredients.size === 0) return;

    const params = new URLSearchParams();
    const ingredientList = Array.from(selectedIngredients).join(',');
    params.set('ingredients', ingredientList);

    if (selectedTheme) {
      params.set('theme', selectedTheme);
    }
    if (selectedCuisine) {
      params.set('cuisine', selectedCuisine);
    }
    if (selectedTools.size > 0) {
      params.set('tools', Array.from(selectedTools).join(','));
    }

    // 버튼 클릭 시마다 고유한 generation ID 생성 (캐싱 제어용)
    const generationId = Date.now();
    params.set('generationId', generationId.toString());

    router.push(`/recipes?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
          <h2 className='mb-2 text-xl font-semibold'>Analyzing your image</h2>
          <p className='text-muted-foreground'>AI가 사진을 분석하고 있습니다... (약 10초 소요)</p>
        </div>
      </div>
    );
  }

  return (
    <main className='bg-background min-h-screen pb-24'>
      <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8'>
        <Button
          variant='ghost'
          onClick={() => router.push('/upload')}
          className='mb-4 sm:mb-6'
          size='sm'
        >
          <ArrowLeft className='mr-1 h-4 w-4 sm:mr-2' />
          Back
        </Button>

        {error && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription className='mt-2 flex flex-col gap-3'>
              <p>{error}</p>
              <Button variant='outline' size='sm' onClick={() => router.push('/upload')}>
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className='mb-8 sm:mb-10'>
          <h1 className='text-foreground mb-2 text-3xl font-bold sm:mb-3 sm:text-4xl'>
            레시피 맞춤 설정
          </h1>
          <p className='text-muted-foreground text-sm sm:text-base'>
            재료를 선택하고 원하는 스타일을 고르면 더 정확한 레시피를 추천해드려요!
          </p>
        </div>

        {/* 재료 선택 섹션 */}
        <div className='mb-12'>
          <div className='mb-6 flex items-center gap-2 border-b pb-3'>
            <UtensilsCrossed className='text-primary h-6 w-6' />
            <h2 className='text-2xl font-bold'>인식된 재료</h2>
            <span className='text-muted-foreground text-sm'>
              ({selectedIngredients.size}개 선택됨)
            </span>
          </div>

          <div className='mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
            <div>
              <Card className='mb-3 overflow-hidden sm:mb-4'>
                <div className='relative h-64 w-full sm:h-80'>
                  <Image
                    src={imageData || '/placeholder.svg'}
                    alt='Uploaded ingredients'
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              </Card>
              <p className='text-muted-foreground text-center text-xs sm:text-sm'>업로드한 사진</p>
            </div>

            <div className='space-y-2 sm:space-y-3'>
              <div className='mb-3 flex items-center justify-between sm:mb-4'>
                <h3 className='text-lg font-semibold sm:text-xl'>
                  {ingredients.length}개 재료 발견
                </h3>
              </div>

              {ingredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient.name}
                  name={ingredient.name}
                  confidence={ingredient.confidence}
                  category={ingredient.category}
                  selected={selectedIngredients.has(ingredient.name)}
                  onToggle={() => toggleIngredient(ingredient.name)}
                />
              ))}

              {ingredients.length === 0 && (
                <Card className='p-8 text-center'>
                  <p className='text-muted-foreground'>재료를 인식하지 못했습니다.</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* 레시피 스타일 섹션 */}
        <div className='mb-12'>
          <div className='mb-6 flex items-center gap-2 border-b pb-3'>
            <Flame className='text-primary h-6 w-6' />
            <h2 className='text-2xl font-bold'>레시피 스타일</h2>
            <span className='text-muted-foreground text-sm'>(하나만 선택)</span>
          </div>

          <div className='space-y-8'>
            {THEME_CATEGORIES.map((category) => {
              const themes = getThemesByCategory(category.id);
              return (
                <div key={category.id}>
                  <div className='mb-4'>
                    <h3 className='text-lg font-bold'>{category.title}</h3>
                    <p className='text-muted-foreground text-sm'>{category.description}</p>
                  </div>
                  <div className='grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {themes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        theme={theme}
                        selected={selectedTheme === theme.id}
                        onToggle={() => toggleTheme(theme.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 음식 국적 섹션 */}
        <div className='mb-12'>
          <div className='mb-6 flex items-center gap-2 border-b pb-3'>
            <ChefHat className='text-primary h-6 w-6' />
            <h2 className='text-2xl font-bold'>음식 국적</h2>
            <span className='text-muted-foreground text-sm'>(하나만 선택)</span>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {CUISINES.map((cuisine) => (
              <CuisineCard
                key={cuisine.id}
                cuisine={cuisine}
                selected={selectedCuisine === cuisine.id}
                onToggle={() => toggleCuisine(cuisine.id)}
              />
            ))}
          </div>
        </div>

        {/* 조리 도구 섹션 */}
        <div className='mb-12'>
          <div className='mb-6 flex items-center gap-2 border-b pb-3'>
            <Utensils className='text-primary h-6 w-6' />
            <h2 className='text-2xl font-bold'>조리 도구</h2>
            <span className='text-muted-foreground text-sm'>(여러 개 선택 가능)</span>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {COOKING_TOOLS.map((tool) => (
              <CookingToolCard
                key={tool.id}
                tool={tool}
                selected={selectedTools.has(tool.id)}
                onToggle={() => toggleTool(tool.id)}
              />
            ))}
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className='bg-background/95 border-border fixed right-0 bottom-0 left-0 border-t backdrop-blur-sm'>
          <div className='container mx-auto max-w-6xl px-4 py-4 sm:px-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4'>
              <Button
                size='lg'
                onClick={handleContinue}
                disabled={selectedIngredients.size === 0}
                className='gap-2'
              >
                레시피 찾기 ({selectedIngredients.size}개 재료)
                <ArrowRight className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
