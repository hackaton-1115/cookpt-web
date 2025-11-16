import { ChevronRight } from 'lucide-react';

import Link from 'next/link';

import { Recipe } from '@/lib/types';

import { RecipeCard } from './RecipeCard';

interface RecipeThemeSectionProps {
  title: string;
  description: string;
  recipes: Recipe[];
  icon?: React.ReactNode;
  themeQuery?: string;
}

export function RecipeThemeSection({
  title,
  description,
  recipes,
  icon,
  themeQuery,
}: RecipeThemeSectionProps) {
  if (recipes.length === 0) return null;

  return (
    <section className='py-8'>
      <div className='mb-6 border-b-4 border-[#5d4037] pb-4'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            {icon && (
              <div className='flex h-12 w-12 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]'>
                {icon}
              </div>
            )}
            <div>
              <h2 className='pixel-text mb-2 text-xs text-[#5d4037]'>{title}</h2>
              <p className='text-sm text-[#5d4037]/70'>{description}</p>
            </div>
          </div>
          {themeQuery && (
            <Link href={`/recipes?theme=${themeQuery}`}>
              <div className='inline-flex items-center gap-2 border-2 border-[#5d4037] bg-white px-4 py-2 text-sm text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'>
                <span>View All</span>
                <ChevronRight className='h-4 w-4' />
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {recipes.slice(0, 4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
