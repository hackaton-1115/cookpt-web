import * as React from 'react';

import { cn } from '@/lib/utils';

export interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'regular' | 'large';
  children: React.ReactNode;
}

const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'primary', size = 'regular', children, ...props }, ref) => {
    const baseStyles =
      'pixel-button cursor-pointer pixel-text inline-flex items-center justify-center border-4 border-[#5d4037] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
      primary: 'bg-[#ff5252] text-white pixel-shadow hover:bg-[#ff5252]',
      secondary: 'bg-white text-[#5d4037] pixel-shadow-sm hover:bg-white',
    };

    const sizeStyles = {
      regular: 'px-6 py-3 text-sm',
      large: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PixelButton.displayName = 'PixelButton';

export { PixelButton };
