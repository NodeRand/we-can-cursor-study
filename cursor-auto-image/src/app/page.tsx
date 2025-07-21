'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Toaster, toast } from 'sonner';
import { useState } from 'react';
import Image from 'next/image';

type Style = {
    name: string;
    value: string;
    description: string;
};

const STYLES: Style[] = [
    {
        name: '자연스러운',
        value: 'natural',
        description: '더 자연스럽고 사실적인 이미지를 생성합니다.',
    },
    {
        name: '생동감 있는',
        value: 'vivid',
        description: '더 극적이고 하이퍼리얼한 이미지를 생성합니다.',
    },
    {
        name: '네온',
        value: 'neon',
        description: '밝고 화려한 네온 효과가 적용된 이미지를 생성합니다.',
    },
    {
        name: '미니멀 로고',
        value: 'minimal_logo',
        description: '심플하고 현대적인 로고 디자인을 생성합니다.',
    },
    {
        name: '라인 아트',
        value: 'line_art',
        description: '심플한 라인으로 구성된 아트워크를 생성합니다.',
    },
    {
        name: '아이콘',
        value: 'icon',
        description: '웹사이트나 앱에 사용할 수 있는 아이콘을 생성합니다.',
    },
    {
        name: '수채화',
        value: 'watercolor',
        description: '부드럽고 예술적인 수채화 스타일의 이미지를 생성합니다.',
    },
];

const IMAGE_SIZES = [
    { value: '1024x1024', label: '정사각형 (1024x1024)' },
    { value: '1792x1024', label: '가로 (1792x1024)' },
    { value: '1024x1792', label: '세로 (1024x1792)' },
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
            case 'neon':
                return `${basePrompt} with vibrant neon lights effect, cyberpunk style, glowing elements, dark background, futuristic`;
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
                    style:
                        style === 'natural' || style === 'vivid'
                            ? style
                            : 'natural',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '이미지 생성에 실패했습니다.');
            }

            setImageUrl(data[0].url);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : '이미지 생성에 실패했습니다.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto p-4 max-w-2xl min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
                DALL-E 3 이미지 생성기
            </h1>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="이미지를 설명해주세요..."
                        value={basePrompt}
                        onChange={e => setBasePrompt(e.target.value)}
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
                                {STYLES.map(style => (
                                    <SelectItem
                                        key={style.value}
                                        value={style.value}
                                    >
                                        <div className="flex flex-col justify-center items-start py-2">
                                            <div className="font-medium">
                                                {style.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {style.description}
                                            </div>
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
                                {IMAGE_SIZES.map(size => (
                                    <SelectItem
                                        key={size.value}
                                        value={size.value}
                                    >
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
