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
      // 로그인 성공 시 /auth/success로 리다이렉트 (네이티브 앱 지원)
      // 클라이언트 사이드에서 네이티브 앱 여부 확인 후 토큰 전송
      // callback=true 파라미터로 callback을 거쳤음을 표시
      return NextResponse.redirect(
        `${origin}/auth/success?next=${encodeURIComponent(next)}&callback=true`
      );
    } else {
      // 에러 발생 시 에러 정보와 함께 리다이렉트
      return NextResponse.redirect(
        `${origin}/auth/success?error=${encodeURIComponent(error.message)}&callback=true`
      );
    }
  }

  // code가 없는 경우
  return NextResponse.redirect(`${origin}/auth/success?error=no_code&callback=true`);
};
