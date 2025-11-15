import {
  Beer,
  Dumbbell,
  Flame,
  Heart,
  Leaf,
  ListChecks,
  LucideIcon,
  Microwave,
  Package,
  PartyPopper,
  Scale,
  Snowflake,
  Sparkles,
  Sunrise,
  ThumbsUp,
  UtensilsCrossed,
  Wind,
  Zap,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { RecipeTheme } from '@/lib/types';

interface ThemeCardProps {
  theme: RecipeTheme;
  selected: boolean;
  onToggle: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Zap,
  ThumbsUp,
  ListChecks,
  Dumbbell,
  Heart,
  Scale,
  Leaf,
  Microwave,
  UtensilsCrossed,
  Sparkles,
  Wind,
  Package,
  Beer,
  Snowflake,
  Flame,
  Sunrise,
  PartyPopper,
};

const categoryColors = {
  time: 'bg-blue-950/30 border-blue-800/50 hover:border-blue-700',
  health: 'bg-green-950/30 border-green-800/50 hover:border-green-700',
  equipment: 'bg-purple-950/30 border-purple-800/50 hover:border-purple-700',
  situation: 'bg-orange-950/30 border-orange-800/50 hover:border-orange-700',
};

const selectedCategoryColors = {
  time: 'bg-blue-900/40 border-blue-600 ring-2 ring-blue-600/50',
  health: 'bg-green-900/40 border-green-600 ring-2 ring-green-600/50',
  equipment: 'bg-purple-900/40 border-purple-600 ring-2 ring-purple-600/50',
  situation: 'bg-orange-900/40 border-orange-600 ring-2 ring-orange-600/50',
};

const iconColors = {
  time: 'text-blue-400',
  health: 'text-green-400',
  equipment: 'text-purple-400',
  situation: 'text-orange-400',
};

export const ThemeCard = ({ theme, selected, onToggle }: ThemeCardProps) => {
  const Icon = iconMap[theme.icon] || Zap;

  const cardClass = selected
    ? selectedCategoryColors[theme.category]
    : categoryColors[theme.category];

  return (
    <Card
      className={`cursor-pointer p-4 transition-all duration-200 ${cardClass}`}
      onClick={onToggle}
    >
      <div className='flex items-start gap-3'>
        <div className='mt-0.5 flex-shrink-0'>
          <Icon className={`h-6 w-6 ${iconColors[theme.category]}`} />
        </div>
        <div className='flex-1'>
          <h3 className='mb-1 text-base font-semibold'>{theme.title}</h3>
          <p className='text-muted-foreground text-sm'>{theme.description}</p>
        </div>
        <div className='flex-shrink-0'>
          <div
            className={`h-5 w-5 rounded border-2 transition-colors ${
              selected
                ? 'border-primary bg-primary flex items-center justify-center'
                : 'border-gray-600 bg-gray-800/50'
            }`}
          >
            {selected && (
              <svg
                className='h-3 w-3 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
              </svg>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
