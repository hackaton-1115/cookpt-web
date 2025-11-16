'use client';

import { LucideIcon, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface LoginRequiredProps {
  icon?: LucideIcon;
  message?: string;
  onLoginClick: () => void;
}

export const LoginRequired = ({
  icon: Icon = LogIn,
  message = '로그인이 필요한 서비스입니다.',
  onLoginClick,
}: LoginRequiredProps) => {
  return (
    <div className='py-12 text-center'>
      <Icon className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
      <p className='text-muted-foreground mb-4 text-lg'>{message}</p>
      <Button onClick={onLoginClick}>로그인하기</Button>
    </div>
  );
};
