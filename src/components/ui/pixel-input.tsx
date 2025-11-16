import * as React from 'react';

import { cn } from '@/lib/utils';

export interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const PixelInput = React.forwardRef<HTMLInputElement, PixelInputProps>(
  ({ className, type = 'text', error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'pixel-text w-full border-4 bg-white px-4 py-3 text-base text-[#5d4037] transition-all outline-none placeholder:text-[#5d4037]/40',
          error
            ? 'border-[#ff5252] focus:border-[#ff5252]'
            : 'border-[#5d4037] focus:border-[#ff5252]',
          'disabled:cursor-not-allowed disabled:bg-[#f5f5f5] disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);

PixelInput.displayName = 'PixelInput';

export { PixelInput };
