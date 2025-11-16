import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface PixelCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  className?: string;
}

export function PixelCheckbox({ checked, onToggle, className }: PixelCheckboxProps) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={cn(
        'pixel-button flex h-5 w-5 items-center justify-center border-2 border-[#5d4037] transition-all',
        checked ? 'bg-[#ff5252]' : 'bg-white',
        className,
      )}
    >
      {checked && <Check className='h-3 w-3 text-white' strokeWidth={3} />}
    </button>
  );
}
