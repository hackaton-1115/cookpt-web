import { PixelCheckbox } from '@/components/ui/pixel-checkbox';
import { Cuisine } from '@/lib/types';

interface CuisineCardProps {
  cuisine: Cuisine;
  selected: boolean;
  onToggle: () => void;
}

export const CuisineCard = ({ cuisine, selected, onToggle }: CuisineCardProps) => {
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
        <div className='flex-shrink-0 text-2xl'>{cuisine.icon}</div>
        <div className='flex-1'>
          <h3 className='text-base font-semibold text-[#5d4037]'>{cuisine.title}</h3>
        </div>
        <PixelCheckbox checked={selected} onToggle={onToggle} className='flex-shrink-0' />
      </div>
    </div>
  );
};
