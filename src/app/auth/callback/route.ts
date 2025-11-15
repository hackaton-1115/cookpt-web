import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // 로그인 후 이동할 페이지 (기본값: /upload)
  const next = searchParams.get('next') ?? '/upload';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 로그인 성공 시 지정된 페이지로 리다이렉트
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 발생 시 홈으로 리다이렉트 (또는 에러 페이지)
  return NextResponse.redirect(`${origin}/`);
};
