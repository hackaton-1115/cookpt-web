import { Check, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface IngredientCardProps {
  name: string;
  confidence: number;
  category: string;
  selected: boolean;
  onToggle: () => void;
}

export function IngredientCard({
  name,
  confidence,
  category,
  selected,
  onToggle,
}: IngredientCardProps) {
  return (
    <Card
      className={`cursor-pointer p-3 transition-all sm:p-4 ${
        selected ? 'border-primary bg-primary/5 ring-primary ring-2' : 'hover:border-primary/50'
      }`}
      onClick={onToggle}
    >
      <div className='flex items-start justify-between gap-2 sm:gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex flex-wrap items-center gap-2'>
            <h3 className='text-base font-semibold sm:text-lg'>{name}</h3>
            <Badge variant='secondary' className='text-xs'>
              {category}
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full sm:h-2'>
              <div
                className='bg-primary h-full transition-all'
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className='text-muted-foreground text-xs whitespace-nowrap sm:text-sm'>
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>
        <Button
          size='icon'
          variant={selected ? 'default' : 'outline'}
          className='h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9'
        >
          {selected ? (
            <Check className='h-3 w-3 sm:h-4 sm:w-4' />
          ) : (
            <X className='h-3 w-3 sm:h-4 sm:w-4' />
          )}
        </Button>
      </div>
    </Card>
  );
}
