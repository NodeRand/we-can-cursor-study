import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getLengthPrompt = (length: string) => {
    switch (length) {
        case 'short':
            return '300-500자 정도의 짧은 글을 작성해주세요.';
        case 'medium':
            return '800-1200자 정도의 중간 길이의 글을 작성해주세요.';
        case 'long':
            return '2000자 이상의 긴 글을 작성해주세요.';
        default:
            return '800-1200자 정도의 중간 길이의 글을 작성해주세요.';
    }
};

const getTonePrompt = (tone: string) => {
    switch (tone) {
        case 'friendly':
            return '친근하고 편안한 말투로 작성해주세요.';
        case 'professional':
            return '전문적이고 격식있는 말투로 작성해주세요.';
        case 'casual':
            return '가볍고 캐주얼한 말투로 작성해주세요.';
        default:
            return '전문적이고 격식있는 말투로 작성해주세요.';
    }
};

export async function POST(request: Request) {
    try {
        const { keyword, options } = await request.json();

        if (!keyword) {
            return NextResponse.json(
                { error: '키워드가 필요합니다.' },
                { status: 400 },
            );
        }

        const lengthPrompt = getLengthPrompt(options.length);
        const tonePrompt = getTonePrompt(options.tone);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `당신은 전문 블로그 작가입니다. 주어진 키워드로 블로그 글을 작성해주세요.
${lengthPrompt}
${tonePrompt}
글의 구조는 다음과 같이 작성해주세요:
1. 제목
2. 소개
3. 본문 (여러 단락으로 구성)
4. 결론`,
                },
                {
                    role: 'user',
                    content: `다음 키워드로 블로그 글을 작성해주세요: ${keyword}`,
                },
            ],
        });

        const content =
            completion.choices[0]?.message?.content ||
            '글을 생성할 수 없습니다.';

        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}
