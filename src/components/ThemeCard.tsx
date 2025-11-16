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

import { PixelCheckbox } from '@/components/ui/pixel-checkbox';
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

export const ThemeCard = ({ theme, selected, onToggle }: ThemeCardProps) => {
  const Icon = iconMap[theme.icon] || Zap;

  return (
    <div
      className={`pixel-shadow cursor-pointer border-4 p-4 transition-all ${
        selected
          ? 'border-[#ff5252] bg-[#ffe0e0]'
          : 'border-[#5d4037] bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
      }`}
      onClick={onToggle}
    >
      <div className='flex items-start gap-3'>
        <div className='mt-0.5 flex-shrink-0'>
          <Icon className='h-6 w-6 text-[#5d4037]' />
        </div>
        <div className='flex-1'>
          <h3 className='mb-1 text-base font-semibold text-[#5d4037]'>{theme.title}</h3>
          <p className='text-sm text-[#5d4037]/70'>{theme.description}</p>
        </div>
        <PixelCheckbox checked={selected} onToggle={onToggle} className='flex-shrink-0' />
      </div>
    </div>
  );
};
