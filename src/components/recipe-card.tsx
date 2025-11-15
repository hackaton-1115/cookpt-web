import { Clock, Users, ChefHat } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
  matchPercentage?: number;
}

export function RecipeCard({ recipe, matchPercentage }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

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
    </Link>
  );
}
