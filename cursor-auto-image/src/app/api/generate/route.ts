import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt, style = 'natural' } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: '프롬프트를 입력해주세요.' },
                { status: 400 },
            );
        }

        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            style: style as 'natural' | 'vivid',
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: '이미지 생성 중 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}
