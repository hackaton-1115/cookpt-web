import { Card } from '@/components/ui/card';
import { Cuisine } from '@/lib/types';

interface CuisineCardProps {
  cuisine: Cuisine;
  selected: boolean;
  onToggle: () => void;
}

export const CuisineCard = ({ cuisine, selected, onToggle }: CuisineCardProps) => {
  const cardClass = selected
    ? 'bg-primary/20 border-primary ring-2 ring-primary/50'
    : 'bg-card border-border hover:border-primary/50';

  return (
    <Card className={`cursor-pointer p-4 transition-all duration-200 ${cardClass}`} onClick={onToggle}>
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0 text-2xl'>{cuisine.icon}</div>
        <div className='flex-1'>
          <h3 className='text-base font-semibold'>{cuisine.title}</h3>
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
