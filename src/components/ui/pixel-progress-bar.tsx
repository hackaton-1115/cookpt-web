import * as React from 'react';

import { cn } from '@/lib/utils';

export interface PixelProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function PixelProgressBar({ value, className }: PixelProgressBarProps) {
  return (
    <div className={cn('h-2 w-full border-2 border-[#5d4037] bg-[#5d4037]/20', className)}>
      <div
        className='h-full bg-[#ff5252] transition-all'
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
