import { AlertCircle } from 'lucide-react';

import { PixelButton } from './pixel-button';

export interface PixelAlertProps {
  title?: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function PixelAlert({ title, description, onAction, actionLabel }: PixelAlertProps) {
  return (
    <div className='pixel-shadow border-4 border-[#ff5252] bg-[#ffe0e0] p-6'>
      <div className='flex gap-3'>
        <div className='flex h-8 w-8 items-center justify-center border-2 border-[#5d4037] bg-[#ff5252]'>
          <AlertCircle className='h-5 w-5 text-white' />
        </div>
        <div className='flex-1'>
          {title && <h3 className='pixel-text mb-2 text-xs text-[#5d4037]'>{title}</h3>}
          <p className='mb-3 text-sm text-[#5d4037]/70'>{description}</p>
          {onAction && actionLabel && (
            <PixelButton variant='secondary' size='regular' onClick={onAction}>
              {actionLabel}
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}
