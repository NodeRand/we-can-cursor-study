import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DALL-E 3 이미지 생성기',
    description: 'DALL-E 3를 이용한 AI 이미지 생성 웹사이트',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="absolute right-4 top-4">
                        <ThemeToggle />
                    </div>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
