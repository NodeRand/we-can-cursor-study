import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AI 멀티 유틸리티 웹앱',
    description: 'OpenAI API를 활용한 다양한 AI 기능을 제공하는 웹앱입니다.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                <main className="min-h-screen bg-gray-50">{children}</main>
            </body>
        </html>
    );
}
