# 웹사이트 구성 및 이미지 생성 기능
_Exported on 2025. 7. 21. at 15시 4분 22초 GMT+9 from Cursor (1.2.4)_

---

**User**

@OpenAI_Image  첨부 Api 문서를 기준으로
dall-e-3 모델의 이미지 생성 웹사이트를 구성하려고 합니다.
UI는 shadcn을 활용할 것입니다.
사용 UI 구성요소는 button, input, select, sonner를 활용합니다.
프롬프트를 입력하고 생성 버튼을 누르면 이미지가 생성될때까지 로딩화면이 보이다가
이미지 url을 받으면 이미지를 보여주는 기능입니다. 시작해봅시다.

---

**Cursor**

OpenAI의 DALL-E 3를 활용한 이미지 생성 웹사이트를 구현해보도록 하겠습니다.

먼저 필요한 패키지들을 설치하겠습니다:

먼저 OpenAI API를 사용하기 위한 설정 파일을 생성하겠습니다:

```typescript
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

이제 이미지 생성을 위한 API 라우트를 생성하겠습니다:

```typescript
import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '프롬프트를 입력해주세요.' },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: '이미지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

이제 메인 페이지를 수정하여 이미지 생성 UI를 구현하겠습니다:

```typescriptreact
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [size, setSize] = useState('1024x1024');

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('프롬프트를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, size }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '이미지 생성에 실패했습니다.');
      }

      setImageUrl(data[0].url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">DALL-E 3 이미지 생성기</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="이미지를 설명해주세요..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <Select
            value={size}
            onValueChange={setSize}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="이미지 크기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">1024x1024</SelectItem>
              <SelectItem value="1792x1024">1792x1024</SelectItem>
              <SelectItem value="1024x1792">1024x1792</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '생성 중...' : '생성하기'}
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={prompt}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>
      <Toaster />
    </main>
  );
}
```

마지막으로 환경 변수 파일을 생성하겠습니다:

기본적인 구현이 완료되었습니다. 사용하기 위해서는 다음 단계들이 필요합니다:

1. `.env.local` 파일을 생성하고 `OPENAI_API_KEY`에 OpenAI API 키를 설정해주세요.
2. 개발 서버를 실행하려면 다음 명령어를 실행하세요:
```bash
npm run dev
```

구현된 기능들:
- 프롬프트 입력 필드
- 이미지 크기 선택 (1024x1024, 1792x1024, 1024x1792)
- 이미지 생성 버튼
- 로딩 상태 표시
- 에러 처리 및 알림 (Sonner toast)
- 생성된 이미지 표시

추가 기능이나 수정이 필요하시다면 말씀해 주세요!

```shellscript
npm run dev
```

---

**User**

뭐징

---

**Cursor**

에러가 발생했네요. 이 에러는 Next.js에서 외부 이미지를 사용할 때 발생하는 설정 관련 문제입니다. OpenAI API에서 반환되는 이미지 URL을 사용하기 위해서는 Next.js의 이미지 설정을 수정해야 합니다.

next.config.ts 파일을 수정하겠습니다:

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default config
```

이제 개발 서버를 재시작하면 OpenAI에서 생성된 이미지가 정상적으로 표시될 것입니다. 다음 명령어로 서버를 재시작해주세요:

---

**User**

@OpenAI_Image_Cook_Book  현재 dalle-3 관련 쿡북입니다.
이를 활용하여 프롬프트를 조합하게 만들어서
다양한 스타일을 선택할 수 있게 하는 select 옵션을 만들어주세요

---

**Cursor**

DALL-E 3의 다양한 스타일 옵션을 추가하여 UI를 개선하겠습니다. 

```typescriptreact
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

type Style = {
  name: string;
  value: string;
  description: string;
};

const STYLES: Style[] = [
  { 
    name: "자연스러운",
    value: "natural",
    description: "더 자연스럽고 사실적인 이미지를 생성합니다."
  },
  { 
    name: "생동감 있는",
    value: "vivid",
    description: "더 극적이고 하이퍼리얼한 이미지를 생성합니다."
  },
  {
    name: "미니멀 로고",
    value: "minimal_logo",
    description: "심플하고 현대적인 로고 디자인을 생성합니다."
  },
  {
    name: "라인 아트",
    value: "line_art",
    description: "심플한 라인으로 구성된 아트워크를 생성합니다."
  },
  {
    name: "아이콘",
    value: "icon",
    description: "웹사이트나 앱에 사용할 수 있는 아이콘을 생성합니다."
  },
  {
    name: "수채화",
    value: "watercolor",
    description: "부드럽고 예술적인 수채화 스타일의 이미지를 생성합니다."
  }
];

const IMAGE_SIZES = [
  { value: "1024x1024", label: "정사각형 (1024x1024)" },
  { value: "1792x1024", label: "가로 (1792x1024)" },
  { value: "1024x1792", label: "세로 (1024x1792)" }
];

export default function Home() {
  const [basePrompt, setBasePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState<string>('natural');

  const getStylePrompt = (styleValue: string, basePrompt: string): string => {
    switch (styleValue) {
      case 'minimal_logo':
        return `Vector logo design of ${basePrompt}, minimalistic, clean lines, professional, white background`;
      case 'line_art':
        return `Simple line art illustration of ${basePrompt}, black lines on white background, minimal, elegant`;
      case 'icon':
        return `Simple icon design of ${basePrompt}, suitable for website or app, flat design, solid colors`;
      case 'watercolor':
        return `Watercolor painting of ${basePrompt}, soft colors, artistic, flowing texture`;
      default:
        return basePrompt;
    }
  };

  const handleGenerate = async () => {
    if (!basePrompt) {
      toast.error('프롬프트를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const finalPrompt = getStylePrompt(style, basePrompt);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          size,
          style: style === 'natural' || style === 'vivid' ? style : 'natural'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '이미지 생성에 실패했습니다.');
      }

      setImageUrl(data[0].url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">DALL-E 3 이미지 생성기</h1>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={style}
              onValueChange={setStyle}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="스타일 선택" />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((style) => (
                  <SelectItem 
                    key={style.value} 
                    value={style.value}
                  >
                    <div>
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-gray-500">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={size}
              onValueChange={setSize}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="이미지 크기" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="이미지를 설명해주세요..."
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              disabled={loading}
            />
            <Button 
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? '생성 중...' : '생성하기'}
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={basePrompt}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>
      <Toaster />
    </main>
  );
}
```

이제 API 라우트도 스타일 옵션을 처리하도록 수정하겠습니다:

```typescript
import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, style = 'natural' } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '프롬프트를 입력해주세요.' },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      style: style as 'natural' | 'vivid',
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: '이미지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

이제 다음과 같은 기능이 추가되었습니다:

1. 다양한 스타일 옵션:
   - 자연스러운 (natural)
   - 생동감 있는 (vivid)
   - 미니멀 로고
   - 라인 아트
   - 아이콘
   - 수채화

2. 각 스타일에 대한 설명이 포함된 드롭다운 메뉴

3. 이미지 크기 옵션의 이름을 더 직관적으로 변경:
   - 정사각형 (1024x1024)
   - 가로 (1792x1024)
   - 세로 (1024x1792)

4. 스타일에 따른 프롬프트 자동 조정:
   - 각 스타일에 맞는 추가 프롬프트가 자동으로 포함됩니다.
   - DALL-E 3의 natural/vivid 스타일 옵션이 적절하게 적용됩니다.

UI가 더 직관적으로 개선되었으며, 사용자가 원하는 스타일을 쉽게 선택할 수 있습니다. 스타일을 선택하면 해당 스타일에 최적화된 프롬프트가 자동으로 생성됩니다.

추가로 수정하거나 개선하고 싶은 부분이 있으시다면 말씀해 주세요!

---

**User**

스타일 관련 드롭다운 너비를 조정하고싶은데 어떻게 해

---

**Cursor**

스타일 드롭다운의 너비를 조정하기 위해 Select 컴포넌트의 스타일을 수정하겠습니다:

```typescriptreact
// ... existing code ...
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[3fr_1fr] gap-2">
              <Select
                value={style}
                onValueChange={setStyle}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="스타일 선택" />
                </SelectTrigger>
                <SelectContent className="w-[300px]">
                  {STYLES.map((style) => (
                    <SelectItem 
                      key={style.value} 
                      value={style.value}
                    >
                      <div className="flex flex-col justify-center items-start py-2">
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm text-gray-500">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={size}
                onValueChange={setSize}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="이미지 크기" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
// ... existing code ...
```

다음과 같은 변경사항을 적용했습니다:

1. 스타일 선택 드롭다운의 너비를 `w-[300px]`로 설정하여 설명 텍스트가 잘리지 않도록 했습니다.
2. 트리거 버튼의 너비를 `w-full`로 설정하여 그리드 컬럼에 맞게 조정했습니다.
3. 스타일 아이템에 `py-2` 패딩을 추가하여 가독성을 높였습니다.
4. 그리드 컬럼 사이의 간격을 `gap-2`로 추가했습니다.

이제 스타일 드롭다운이 더 보기 좋게 표시될 것입니다. 드롭다운의 너비를 더 조정하고 싶으시다면 `w-[300px]` 값을 원하는 크기로 변경할 수 있습니다. 예를 들어:
- 더 넓게: `w-[400px]`
- 더 좁게: `w-[250px]`

원하시는 크기로 조정해드릴까요?

---

**User**

크기 옵션에 더 많은 선택지를 줄순 없나? 1024픽셀보다 낮은 크기들 말이야

---

**Cursor**

DALL-E 3 모델은 아쉽게도 1024x1024, 1792x1024, 1024x1792 이 세 가지 크기만 지원합니다. 더 작은 크기의 이미지가 필요하시다면, 생성된 이미지를 클라이언트 측에서 리사이징하는 방법을 구현할 수 있습니다.

예를 들어, 다음과 같이 수정할 수 있습니다:

---

**User**

그럼 네온 스타일만 추가해줄 수 있어?

---

**Cursor**

네, 네온 스타일을 추가해드리겠습니다:

```typescriptreact
// ... existing code ...
const STYLES: Style[] = [
  { 
    name: "자연스러운",
    value: "natural",
    description: "더 자연스럽고 사실적인 이미지를 생성합니다."
  },
  { 
    name: "생동감 있는",
    value: "vivid",
    description: "더 극적이고 하이퍼리얼한 이미지를 생성합니다."
  },
  {
    name: "네온",
    value: "neon",
    description: "밝고 화려한 네온 효과가 적용된 이미지를 생성합니다."
  },
  {
    name: "미니멀 로고",
    value: "minimal_logo",
    description: "심플하고 현대적인 로고 디자인을 생성합니다."
  },
// ... existing code ...

const getStylePrompt = (styleValue: string, basePrompt: string): string => {
  switch (styleValue) {
    case 'minimal_logo':
      return `Vector logo design of ${basePrompt}, minimalistic, clean lines, professional, white background`;
    case 'line_art':
      return `Simple line art illustration of ${basePrompt}, black lines on white background, minimal, elegant`;
    case 'icon':
      return `Simple icon design of ${basePrompt}, suitable for website or app, flat design, solid colors`;
    case 'watercolor':
      return `Watercolor painting of ${basePrompt}, soft colors, artistic, flowing texture`;
    case 'neon':
      return `${basePrompt} with vibrant neon lights effect, cyberpunk style, glowing elements, dark background, futuristic`;
    default:
      return basePrompt;
  }
};
```

네온 스타일 옵션이 추가되었습니다. 이 스타일을 선택하면 입력한 프롬프트에 네온 효과, 사이버펑크 스타일, 빛나는 요소들, 어두운 배경, 미래적인 느낌이 자동으로 추가됩니다.

예를 들어 "고양이"라고 입력하면 "고양이 with vibrant neon lights effect, cyberpunk style, glowing elements, dark background, futuristic"와 같은 프롬프트로 변환되어 네온 스타일의 이미지가 생성됩니다.

다른 스타일도 추가하고 싶으시다면 말씀해 주세요!

---

**User**

지금 설정에서 다크테마를 깔아주고
다크테마 라이트테마 선택하게 할 수 있는 버튼을 만들어줄 수 있어?

---

**Cursor**

네, Next.js와 shadcn/ui의 다크 모드를 설정하고 테마 전환 버튼을 추가하겠습니다.

먼저 다크 모드 프로바이더를 설정하겠습니다:

```typescriptreact
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

next-themes 패키지를 설치하겠습니다:

이제 테마 토글 버튼 컴포넌트를 만들겠습니다:

```typescriptreact
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">테마 전환</span>
    </Button>
  )
}
```

lucide-react 패키지를 설치하겠습니다:

이제 루트 레이아웃에 ThemeProvider와 ThemeToggle을 추가하겠습니다:

```typescriptreact
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DALL-E 3 이미지 생성기",
  description: "DALL-E 3를 이용한 AI 이미지 생성 웹사이트",
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
```

마지막으로 메인 페이지의 스타일을 다크 모드에 맞게 수정하겠습니다:

```typescriptreact
// ... existing code ...
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
          </div>
        )}
// ... existing code ...
```

이제 다음과 같은 기능이 추가되었습니다:

1. 다크 모드/라이트 모드 지원
2. 우측 상단에 테마 전환 버튼 추가
3. 시스템 테마 자동 감지 및 적용
4. 부드러운 테마 전환 효과
5. 다크 모드에서도 잘 보이는 UI 요소들

테마 전환 버튼을 클릭하면 해당 테마로 전환되며, 페이지의 모든 요소들이 테마에 맞게 자동으로 스타일이 변경됩니다. 추가로 수정이 필요한 부분이 있다면 말씀해 주세요!

---

**User**

오 그럼 이제 모바일/데스크탑 반응형도 구현해줘

---

**Cursor**

네, 모바일과 데스크탑 환경에 맞게 반응형 디자인을 적용하겠습니다:

```typescriptreact
'use client';

// ... existing imports ...

export default function Home() {
  // ... existing states and functions ...

  return (
    <main className="container mx-auto p-4 max-w-2xl min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">DALL-E 3 이미지 생성기</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="이미지를 설명해주세요..."
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={handleGenerate}
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? '생성 중...' : '생성하기'}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
            <Select
              value={style}
              onValueChange={setStyle}
              disabled={loading}
            >
              <SelectTrigger className="w-full py-4 md:py-8">
                <SelectValue placeholder="스타일 선택" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {STYLES.map((style) => (
                  <SelectItem 
                    key={style.value} 
                    value={style.value}
                  >
                    <div className="flex flex-col justify-center items-start py-2">
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={size}
              onValueChange={setSize}
              disabled={loading}
            >
              <SelectTrigger className="w-full py-4 md:py-8">
                <SelectValue placeholder="이미지 크기" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {IMAGE_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center min-h-[200px] md:min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-foreground"></div>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={basePrompt}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>
      <Toaster />
    </main>
  );
}
```

다음과 같은 반응형 디자인 변경사항을 적용했습니다:

1. 모바일 화면 (작은 화면):
   - 제목 텍스트 크기 축소
   - 스타일과 크기 선택 드롭다운을 세로로 배치
   - 입력 필드와 버튼의 간격 조정
   - 로딩 스피너 크기 축소
   - 이미지 컨테이너 높이 축소
   - 여백과 패딩 축소

2. 데스크탑 화면 (큰 화면):
   - 더 큰 제목 텍스트
   - 스타일과 크기 선택 드롭다운을 2:1 비율로 가로 배치
   - 더 큰 로딩 스피너
   - 더 큰 이미지 컨테이너 (600px 높이)
   - 여유로운 여백과 패딩

3. 공통 개선사항:
   - 최소 화면 높이 설정
   - 이미지 컨테이너에 둥근 모서리 추가
   - 다크 모드에서의 텍스트 색상 조정
   - 버튼 텍스트 줄바꿈 방지
   - 입력 필드 너비 최적화

이제 모바일과 데스크탑 모두에서 보기 좋게 표시될 것입니다. 추가로 수정이 필요한 부분이 있으시다면 말씀해 주세요!

