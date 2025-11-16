import * as React from 'react';

import { cn } from '@/lib/utils';

export interface PixelIconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  icon: React.ComponentType<{ className?: string }>;
  size?: 'small' | 'medium' | 'large';
}

const PixelIconBox = React.forwardRef<HTMLDivElement, PixelIconBoxProps>(
  ({ className, variant = 'primary', icon: Icon, size = 'medium', ...props }, ref) => {
    const baseStyles = 'flex items-center justify-center border-[#5d4037]';

    const variantStyles = {
      primary: 'bg-[#ff5252] border-4 pixel-shadow-sm',
      secondary: 'bg-white border-2',
    };

    const sizeStyles = {
      small: 'w-12 h-12',
      medium: 'w-16 h-16',
      large: 'w-24 h-24',
    };

    const iconSizes = {
      small: 'w-6 h-6',
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
    };

    const iconColor = variant === 'primary' ? 'text-white' : 'text-[#5d4037]';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        <Icon className={cn(iconSizes[size], iconColor, 'pixelated')} />
      </div>
    );
  },
);

PixelIconBox.displayName = 'PixelIconBox';

export { PixelIconBox };
