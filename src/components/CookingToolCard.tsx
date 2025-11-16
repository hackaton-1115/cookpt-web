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

import { PixelCheckbox } from '@/components/ui/pixel-checkbox';
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

  return (
    <div
      className={`pixel-shadow cursor-pointer border-4 p-4 transition-all ${
        selected
          ? 'border-[#ff5252] bg-[#ffe0e0]'
          : 'border-[#5d4037] bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
      }`}
      onClick={onToggle}
    >
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0'>
          <Icon className='h-6 w-6 text-[#5d4037]' />
        </div>
        <div className='flex-1'>
          <h3 className='text-base font-semibold text-[#5d4037]'>{tool.title}</h3>
        </div>
        <PixelCheckbox checked={selected} onToggle={onToggle} className='flex-shrink-0' />
      </div>
    </div>
  );
};
