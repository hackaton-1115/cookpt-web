'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RecognizePage() {
  const router = useRouter();

  useEffect(() => {
    // select-preferences로 리다이렉트
    router.push('/select-preferences');
  }, [router]);

  return null;
}
