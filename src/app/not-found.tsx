import { Home } from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='space-y-4 text-center'>
        <h1 className='text-primary text-6xl font-bold'>404</h1>
        <h2 className='text-2xl font-semibold'>Recipe Not Found</h2>
        <p className='text-muted-foreground'>The recipe you are looking for does not exist.</p>
        <Link href='/'>
          <Button className='gap-2'>
            <Home className='h-4 w-4' />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
