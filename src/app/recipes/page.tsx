'use client';

import { ArrowLeft, SlidersHorizontal } from 'lucide-react';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

import { RecipeCard } from '@/components/recipe-card';
import { RecipeFilters } from '@/components/recipe-filters';
import { RecipeThemeSection } from '@/components/recipe-theme-section';
import { Button } from '@/components/ui/button';
import { findMatchingRecipes } from '@/lib/ingredient-recognition';
import { RECIPES } from '@/lib/recipe-data';
import { getAllThemedRecipes, getRecipesByTheme, RECIPE_THEMES } from '@/lib/recipe-themes';
import { Recipe } from '@/lib/types';

function RecipesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ingredientsParam = searchParams.get('ingredients');
  const themeParam = searchParams.get('theme');

  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState(120);
  const [showFilters, setShowFilters] = useState(false);

  const ingredients = ingredientsParam ? ingredientsParam.split(',').map((i) => i.trim()) : [];

  const showThemes =
    !ingredientsParam &&
    !themeParam &&
    selectedTools.length === 0 &&
    selectedCategories.length === 0 &&
    maxTime === 120;

  let recipesToDisplay: Array<{
    recipe: Recipe;
    matchCount: number;
    matchPercentage: number;
  }> = [];

  if (themeParam) {
    const themedRecipes = getRecipesByTheme(themeParam, RECIPES);
    recipesToDisplay = themedRecipes.map((recipe) => ({
      recipe,
      matchCount: 0,
      matchPercentage: 0,
    }));
  } else if (ingredients.length > 0) {
    recipesToDisplay = findMatchingRecipes(ingredients, RECIPES);
  } else {
    recipesToDisplay = RECIPES.map((recipe) => ({
      recipe,
      matchCount: 0,
      matchPercentage: 0,
    }));
  }

  const filteredRecipes = recipesToDisplay.filter((item) => {
    const totalTime = item.recipe.prepTime + item.recipe.cookTime;

    if (totalTime > maxTime) return false;

    if (
      selectedTools.length > 0 &&
      !selectedTools.every((tool) => item.recipe.cookingTools.includes(tool))
    ) {
      return false;
    }

    if (selectedCategories.length > 0 && !selectedCategories.includes(item.recipe.category)) {
      return false;
    }

    return true;
  });

  const themedCollections = getAllThemedRecipes(RECIPES);
  const currentTheme = RECIPE_THEMES.find((t) => t.id === themeParam);

  return (
    <main className='bg-background min-h-screen'>
      <div className='container mx-auto px-4 py-6 sm:px-6 sm:py-8'>
        <div className='mb-4 flex items-center justify-between sm:mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.push('/')}
            size='sm'
            className='sm:size-default'
          >
            <ArrowLeft className='mr-1 h-4 w-4 sm:mr-2' />
            Back
          </Button>

          {!showThemes && (
            <Button
              variant='outline'
              onClick={() => setShowFilters(!showFilters)}
              className='lg:hidden'
              size='sm'
            >
              <SlidersHorizontal className='mr-1 h-4 w-4 sm:mr-2' />
              Filters
            </Button>
          )}
        </div>

        <div className='mb-6 sm:mb-8'>
          <h1 className='text-foreground mb-2 text-2xl font-bold sm:mb-3 sm:text-3xl'>
            {themeParam && currentTheme
              ? currentTheme.title
              : ingredients.length > 0
                ? 'Recipe Recommendations'
                : 'Browse Recipes by Theme'}
          </h1>
          {ingredients.length > 0 && (
            <p className='text-muted-foreground text-sm sm:text-base'>
              Based on: {ingredients.join(', ')}
            </p>
          )}
          {themeParam && currentTheme && (
            <p className='text-muted-foreground text-sm sm:text-base'>{currentTheme.description}</p>
          )}
        </div>

        {showThemes ? (
          <div className='space-y-6 sm:space-y-8'>
            {themedCollections.map(({ theme, recipes }) => (
              <RecipeThemeSection
                key={theme.id}
                title={theme.title}
                description={theme.description}
                recipes={recipes}
                icon={<theme.icon className='h-6 w-6' />}
                themeQuery={theme.id}
              />
            ))}
          </div>
        ) : (
          <div className='grid gap-6 lg:grid-cols-4'>
            <div className={`${showFilters ? 'block' : 'hidden'} lg:col-span-1 lg:block`}>
              <RecipeFilters
                selectedTools={selectedTools}
                selectedCategories={selectedCategories}
                maxTime={maxTime}
                onToolsChange={setSelectedTools}
                onCategoriesChange={setSelectedCategories}
                onMaxTimeChange={setMaxTime}
              />
            </div>

            <div className='lg:col-span-3'>
              {filteredRecipes.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3'>
                  {filteredRecipes.map((item) => (
                    <RecipeCard
                      key={item.recipe.id}
                      recipe={item.recipe}
                      matchPercentage={ingredients.length > 0 ? item.matchPercentage : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className='py-12 text-center'>
                  <p className='text-muted-foreground text-lg'>
                    No recipes found matching your filters
                  </p>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSelectedTools([]);
                      setSelectedCategories([]);
                      setMaxTime(120);
                    }}
                    className='mt-4'
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function RecipesPage() {
  return (
    <Suspense
      fallback={
        <div className='bg-background flex min-h-screen items-center justify-center'>
          <p>Loading recipes...</p>
        </div>
      }
    >
      <RecipesContent />
    </Suspense>
  );
}
