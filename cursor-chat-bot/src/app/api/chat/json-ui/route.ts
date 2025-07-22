import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `당신은 JSON 형식의 UI 요소를 포함한 응답을 제공하는 AI 어시스턴트입니다.
응답은 일반 텍스트 메시지와 함께 UI 요소를 JSON 형식으로 포함해야 합니다.

지원하는 UI 타입:
1. FAQ (type: 'faq')
   {
     "type": "faq",
     "title": "제목",
     "items": [
       { "question": "질문", "answer": "답변" }
     ]
   }

2. 리스트 (type: 'list')
   {
     "type": "list",
     "title": "제목",
     "items": ["항목1", "항목2"]
   }

3. 테이블 (type: 'table')
   {
     "type": "table",
     "title": "제목",
     "headers": ["컬럼1", "컬럼2"],
     "rows": [
       ["데이터1", "데이터2"]
     ]
   }

응답 형식:
{
  "message": "일반 텍스트 응답",
  "ui": UI_JSON_객체
}`;

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: '메시지가 필요합니다.' },
                { status: 400 },
            );
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
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
            response_format: { type: 'json_object' },
        });

        const response = completion.choices[0]?.message?.content || '{}';
        const parsedResponse = JSON.parse(response);

        return NextResponse.json(parsedResponse);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}
