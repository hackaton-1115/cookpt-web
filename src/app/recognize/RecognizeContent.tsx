'use client';

import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Flame,
  Plus,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PixelAlert } from '@/components/ui/pixel-alert';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelCard } from '@/components/ui/pixel-card';
import { PixelIconBox } from '@/components/ui/pixel-icon-box';
import { PixelInput } from '@/components/ui/pixel-input';
import {
  PixelSelect,
  PixelSelectContent,
  PixelSelectItem,
  PixelSelectTrigger,
  PixelSelectValue,
} from '@/components/ui/pixel-select';
import { COOKING_TOOLS } from '@/lib/cooking-tool-data';
import { CUISINES } from '@/lib/cuisine-data';
import { getImageUrl } from '@/lib/image-storage';
import { INGREDIENT_CATEGORIES } from '@/lib/ingredient-categories';
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

  // 수동 재료 추가 관련 상태
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [newIngredientName, setNewIngredientName] = useState<string>('');
  const [newIngredientCategory, setNewIngredientCategory] = useState<string>('Other');
  const [inputError, setInputError] = useState<string | null>(null);

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

  // 재료 입력 유효성 검증
  const validateIngredientInput = (name: string): string | null => {
    if (!name || name.trim().length === 0) {
      return '재료 이름을 입력해주세요.';
    }

    if (name.trim().length > 50) {
      return '재료 이름은 50자 이하로 입력해주세요.';
    }

    const isDuplicate = ingredients.some(
      (ing) => ing.name.toLowerCase() === name.toLowerCase().trim(),
    );
    if (isDuplicate) {
      return '이미 추가된 재료입니다.';
    }

    const hasSpecialChars = /[<>{}[\]\\\/]/.test(name);
    if (hasSpecialChars) {
      return '재료 이름에 특수문자를 사용할 수 없습니다.';
    }

    return null;
  };

  // 수동 재료 추가
  const handleAddIngredient = () => {
    const validationError = validateIngredientInput(newIngredientName);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    const newIngredient: RecognizedIngredient = {
      name: newIngredientName.trim(),
      confidence: 1.0,
      category: newIngredientCategory,
      isManual: true,
    };

    setIngredients([...ingredients, newIngredient]);
    setSelectedIngredients((prev) => new Set([...prev, newIngredient.name]));

    // 폼 초기화
    setNewIngredientName('');
    setNewIngredientCategory('Other');
    setInputError(null);
    setShowAddDialog(false);
  };

  // Dialog 열기
  const handleOpenDialog = () => {
    setNewIngredientName('');
    setNewIngredientCategory('Other');
    setInputError(null);
    setShowAddDialog(true);
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
      <div className='flex min-h-screen items-center justify-center bg-[#fafafa]'>
        <div className='text-center'>
          <div className='mx-auto mb-6 flex items-center justify-center'>
            <PixelIconBox icon={ChefHat} variant='primary' size='large' className='pixel-rotate' />
          </div>
          <h2 className='pixel-text mb-3 text-xl text-[#5d4037]'>이미지 분석 중</h2>
          <p className='text-[#5d4037]/70'>AI가 사진을 분석하고 있습니다... (약 10초 소요)</p>
        </div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-[#fafafa] pb-24'>
      <div className='container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8'>
        <PixelButton
          variant='secondary'
          size='regular'
          onClick={() => router.push('/upload')}
          className='mb-4 inline-flex items-center gap-2 sm:mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          <span className='pixel-text text-xs'>뒤로 가기</span>
        </PixelButton>

        {error && (
          <div className='mb-6'>
            <PixelAlert
              title='오류 발생'
              description={error}
              onAction={() => router.push('/upload')}
              actionLabel='다시 시도'
            />
          </div>
        )}

        <div className='mb-8 sm:mb-10'>
          <h1 className='pixel-text mb-3 text-2xl text-[#5d4037] sm:text-3xl'>레시피 맞춤 설정</h1>
          <p className='text-base text-[#5d4037]/70 sm:text-lg'>
            재료를 선택하고 원하는 스타일을 고르면 더 정확한 레시피를 추천해드려요!
          </p>
        </div>

        {/* 재료 선택 섹션 */}
        <div className='mb-12'>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#5d4037] pb-3'>
            <div className='flex items-center gap-3'>
              <UtensilsCrossed className='h-6 w-6 text-[#5d4037]' />
              <h2 className='pixel-text text-base text-[#5d4037]'>인식된 재료</h2>
              <span className='text-sm text-[#5d4037]/70'>
                ({selectedIngredients.size}개 선택됨)
              </span>
            </div>
            <PixelButton variant='secondary' size='regular' onClick={handleOpenDialog}>
              <Plus className='h-4 w-4' />
              <span className='pixel-text text-md ml-2'>재료 추가</span>
            </PixelButton>
          </div>

          <div className='mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
            <div>
              <PixelCard className='mb-3 overflow-hidden p-0 sm:mb-4'>
                <div className='relative h-64 w-full sm:h-80'>
                  <Image
                    src={imageData || '/placeholder.svg'}
                    alt='Uploaded ingredients'
                    fill
                    className='pixelated object-cover'
                    style={{ imageRendering: 'pixelated' }}
                    unoptimized
                  />
                </div>
              </PixelCard>
              <p className='text-center text-xs text-[#5d4037]/70 sm:text-sm'>업로드한 사진</p>
            </div>

            <div>
              <div className='mb-3 flex items-center justify-between sm:mb-4'>
                <h3 className='text-lg font-semibold text-[#5d4037] sm:text-xl'>
                  {ingredients.length}개 재료 발견
                </h3>
              </div>

              <div className='max-h-[500px] space-y-2 overflow-y-auto pr-2 sm:space-y-3'>
                {ingredients.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.name}
                    name={ingredient.name}
                    confidence={ingredient.confidence}
                    category={ingredient.category}
                    selected={selectedIngredients.has(ingredient.name)}
                    onToggle={() => toggleIngredient(ingredient.name)}
                    isManual={ingredient.isManual}
                  />
                ))}

                {ingredients.length === 0 && (
                  <PixelCard className='p-8 text-center'>
                    <p className='text-[#5d4037]/70'>재료를 인식하지 못했습니다.</p>
                  </PixelCard>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 레시피 스타일 섹션 */}
        <div className='mb-12'>
          <div className='mb-6 flex items-center gap-3 border-b-4 border-[#5d4037] pb-3'>
            <Flame className='h-6 w-6 text-[#5d4037]' />
            <h2 className='pixel-text text-base text-[#5d4037]'>레시피 스타일</h2>
            <span className='text-sm text-[#5d4037]/70'>(하나만 선택)</span>
          </div>

          <div className='space-y-8'>
            {THEME_CATEGORIES.map((category) => {
              const themes = getThemesByCategory(category.id);
              return (
                <div key={category.id}>
                  <div className='mb-4'>
                    <h3 className='text-lg font-bold text-[#5d4037]'>{category.title}</h3>
                    <p className='text-sm text-[#5d4037]/70'>{category.description}</p>
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
          <div className='mb-6 flex items-center gap-3 border-b-4 border-[#5d4037] pb-3'>
            <ChefHat className='h-6 w-6 text-[#5d4037]' />
            <h2 className='pixel-text text-base text-[#5d4037]'>음식 국적</h2>
            <span className='text-sm text-[#5d4037]/70'>(하나만 선택)</span>
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
          <div className='mb-6 flex items-center gap-3 border-b-4 border-[#5d4037] pb-3'>
            <Utensils className='h-6 w-6 text-[#5d4037]' />
            <h2 className='pixel-text text-base text-[#5d4037]'>조리 도구</h2>
            <span className='text-sm text-[#5d4037]/70'>(여러 개 선택 가능)</span>
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
        <div className='fixed right-0 bottom-0 left-0 border-t-4 border-[#5d4037] bg-[#ffe0e0]'>
          <div className='container mx-auto max-w-6xl px-4 py-4 sm:px-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4'>
              <PixelButton
                size='large'
                variant='primary'
                onClick={handleContinue}
                disabled={selectedIngredients.size === 0}
                className='inline-flex items-center gap-3'
              >
                <span className='pixel-text text-base'>
                  레시피 찾기 ({selectedIngredients.size}개 재료)
                </span>
                <ArrowRight className='h-5 w-5' />
              </PixelButton>
            </div>
          </div>
        </div>
      </div>

      {/* 재료 추가 Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className='max-w-md border-4 border-[#5d4037] bg-white p-0'>
          <DialogHeader className='border-b-4 border-[#5d4037] bg-[#ffe0e0] p-6'>
            <DialogTitle className='pixel-text text-xl text-[#5d4037]'>재료 직접 추가</DialogTitle>
            <DialogDescription className='text-sm text-[#5d4037]/70'>
              AI가 인식하지 못한 재료를 직접 추가할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 p-6'>
            <div>
              <label className='pixel-text mb-2 block text-sm font-semibold text-[#5d4037]'>
                재료 이름 <span className='text-[#ff5252]'>*</span>
              </label>
              <PixelInput
                value={newIngredientName}
                onChange={(e) => {
                  setNewIngredientName(e.target.value);
                  setInputError(null);
                }}
                placeholder='예: 당근, 양파, 고추'
                error={!!inputError}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddIngredient();
                  }
                }}
              />
              {inputError && <p className='pixel-text mt-2 text-xs text-[#ff5252]'>{inputError}</p>}
            </div>

            <div>
              <label className='pixel-text mb-2 block text-sm font-semibold text-[#5d4037]'>
                카테고리
              </label>
              <PixelSelect value={newIngredientCategory} onValueChange={setNewIngredientCategory}>
                <PixelSelectTrigger>
                  <PixelSelectValue />
                </PixelSelectTrigger>
                <PixelSelectContent>
                  {INGREDIENT_CATEGORIES.map((cat) => (
                    <PixelSelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </PixelSelectItem>
                  ))}
                </PixelSelectContent>
              </PixelSelect>
            </div>
          </div>

          <DialogFooter className='flex flex-col gap-2 border-t-4 border-[#5d4037] bg-[#f5f5f5] p-6 sm:flex-row'>
            <PixelButton
              variant='secondary'
              size='regular'
              onClick={() => setShowAddDialog(false)}
              className='w-full sm:w-auto'
            >
              <span className='pixel-text text-md'>취소</span>
            </PixelButton>
            <PixelButton
              variant='primary'
              size='regular'
              onClick={handleAddIngredient}
              className='w-full sm:w-auto'
            >
              <span className='pixel-text text-md'>추가</span>
            </PixelButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
