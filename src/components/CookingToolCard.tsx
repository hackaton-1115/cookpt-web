import {
  Blend,
  CookingPot,
  Flame,
  LucideIcon,
  Microwave,
  Sandwich,
  Snowflake,
  Wind,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { CookingTool } from '@/lib/types';

interface CookingToolCardProps {
  tool: CookingTool;
  selected: boolean;
  onToggle: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Microwave,
  Flame,
  Oven: CookingPot, // Oven 아이콘이 없어서 CookingPot 사용
  Wind,
  CookingPot,
  Sandwich,
  Blend,
  Snowflake,
};

export const CookingToolCard = ({ tool, selected, onToggle }: CookingToolCardProps) => {
  const Icon = iconMap[tool.icon] || Flame;

  const cardClass = selected
    ? 'bg-primary/20 border-primary ring-2 ring-primary/50'
    : 'bg-card border-border hover:border-primary/50';

  return (
    <Card className={`cursor-pointer p-4 transition-all duration-200 ${cardClass}`} onClick={onToggle}>
      <div className='flex items-center gap-3'>
        <div className='text-primary flex-shrink-0'>
          <Icon className='h-6 w-6' />
        </div>
        <div className='flex-1'>
          <h3 className='text-base font-semibold'>{tool.title}</h3>
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
