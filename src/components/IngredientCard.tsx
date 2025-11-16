import { PixelCheckbox } from '@/components/ui/pixel-checkbox';
import { PixelProgressBar } from '@/components/ui/pixel-progress-bar';

interface IngredientCardProps {
  name: string;
  confidence: number;
  category: string;
  selected: boolean;
  onToggle: () => void;
  isManual?: boolean;
}

export function IngredientCard({
  name,
  confidence,
  category,
  selected,
  onToggle,
  isManual = false,
}: IngredientCardProps) {
  return (
    <div
      className={`pixel-shadow cursor-pointer border-4 p-4 transition-all ${
        selected
          ? 'border-[#ff5252] bg-[#ffe0e0]'
          : 'border-[#5d4037] bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
      }`}
      onClick={onToggle}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            <h3 className='text-base font-semibold text-[#5d4037]'>{name}</h3>
            <span className='border-2 border-[#5d4037] bg-white px-2 py-1 text-xs text-[#5d4037]'>
              {category}
            </span>
            {isManual && (
              <span className='border-2 border-[#ff5252] bg-[#ffe0e0] px-2 py-1 text-xs text-[#ff5252]'>
                직접 추가
              </span>
            )}
          </div>
          {!isManual && (
            <div className='flex items-center gap-2'>
              <PixelProgressBar value={confidence * 100} className='flex-1' />
              <span className='text-xs whitespace-nowrap text-[#5d4037]/70'>
                {Math.round(confidence * 100)}%
              </span>
            </div>
          )}
        </div>
        <PixelCheckbox checked={selected} onToggle={onToggle} className='shrink-0' />
      </div>
    </div>
  );
}
