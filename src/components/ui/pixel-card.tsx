import * as React from 'react';

import { cn } from '@/lib/utils';

export interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: 'regular' | 'small';
  interactive?: boolean;
  children: React.ReactNode;
}

const PixelCard = React.forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, shadow = 'regular', interactive = false, children, ...props }, ref) => {
    const baseStyles = 'bg-white border-4 border-[#5d4037]';

    const shadowStyles = {
      regular: 'pixel-shadow',
      small: 'pixel-shadow-sm',
    };

    // const interactiveStyles = interactive
    //   ? 'hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all cursor-pointer'
    //   : '';

    return (
      <div ref={ref} className={cn(baseStyles, shadowStyles[shadow], className)} {...props}>
        {children}
      </div>
    );
  },
);

PixelCard.displayName = 'PixelCard';

export { PixelCard };
