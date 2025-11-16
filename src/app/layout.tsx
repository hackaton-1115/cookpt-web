import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

import { Press_Start_2P } from 'next/font/google';

import NativeAuthProvider from '@/components/NativeAuthProvider';

import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CookPT - AI 냉장고 재료 기반 한식 레시피 추천',
  description:
    '냉장고 재료 사진을 업로드하면 AI가 자동으로 재료를 인식하고, 해당 재료로 만들 수 있는 레시피를 추천해드립니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${pressStart2P.variable} bg-[#fafafa] font-sans antialiased`}>
        <NativeAuthProvider>{children}</NativeAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
