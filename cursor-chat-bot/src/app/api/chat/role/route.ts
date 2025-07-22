import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { message, systemPrompt } = await request.json();

        if (!message || !systemPrompt) {
            return NextResponse.json(
                { error: '메시지와 시스템 프롬프트가 필요합니다.' },
                { status: 400 },
            );
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        const aiMessage =
            completion.choices[0]?.message?.content ||
            '응답을 생성할 수 없습니다.';

        return NextResponse.json({ message: aiMessage });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}
