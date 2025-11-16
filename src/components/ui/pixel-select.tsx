'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

import * as React from 'react';

import { cn } from '@/lib/utils';

const PixelSelect = SelectPrimitive.Root;

const PixelSelectGroup = SelectPrimitive.Group;

const PixelSelectValue = SelectPrimitive.Value;

const PixelSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'pixel-text flex h-12 w-full items-center justify-between border-4 border-[#5d4037] bg-white px-4 py-3 text-base text-[#5d4037] transition-all outline-none placeholder:text-[#5d4037]/40',
      'focus:border-[#ff5252] disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className='h-4 w-4 opacity-50' />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
PixelSelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const PixelSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden border-4 border-[#5d4037] bg-white text-[#5d4037] shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
PixelSelectContent.displayName = SelectPrimitive.Content.displayName;

const PixelSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('pixel-text px-2 py-1.5 text-sm font-semibold text-[#5d4037]', className)}
    {...props}
  />
));
PixelSelectLabel.displayName = SelectPrimitive.Label.displayName;

const PixelSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'pixel-text relative flex w-full cursor-pointer items-center py-2 pr-8 pl-2 text-base outline-none select-none',
      'hover:bg-[#ffe0e0] focus:bg-[#ffe0e0]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
      <SelectPrimitive.ItemIndicator>
        <Check className='h-4 w-4 text-[#ff5252]' />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
PixelSelectItem.displayName = SelectPrimitive.Item.displayName;

const PixelSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[#5d4037]/20', className)}
    {...props}
  />
));
PixelSelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  PixelSelect,
  PixelSelectGroup,
  PixelSelectValue,
  PixelSelectTrigger,
  PixelSelectContent,
  PixelSelectLabel,
  PixelSelectItem,
  PixelSelectSeparator,
};
