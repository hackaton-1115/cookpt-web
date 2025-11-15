import { ChevronRight } from 'lucide-react';

import Link from 'next/link';

import { Recipe } from '@/lib/types';

import { RecipeCard } from './recipe-card';

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
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {icon && <div className='text-primary'>{icon}</div>}
          <div>
            <h2 className='text-foreground text-2xl font-bold'>{title}</h2>
            <p className='text-muted-foreground text-sm'>{description}</p>
          </div>
        </div>
        {themeQuery && (
          <Link
            href={`/recipes?theme=${themeQuery}`}
            className='text-primary flex items-center gap-1 text-sm hover:underline'
          >
            View All
            <ChevronRight className='h-4 w-4' />
          </Link>
        )}
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {recipes.slice(0, 4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
