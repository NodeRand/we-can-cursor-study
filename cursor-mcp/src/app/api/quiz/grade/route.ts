import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type GradeRequest = {
    answers: { [questionId: string]: string };
};

// 정답 키는 서버에만 존재 (노출 금지)
const answerKey: Record<string, string> = {
    q1: 'a',
    q2: 'a',
    q3: 'b',
    q4: 'b',
    q5: 'a',
    q6: 'a',
    q7: 'a',
    q8: 'b',
};

export async function POST(req: NextRequest) {
    const body = (await req.json()) as GradeRequest;
    const { answers } = body ?? {};

    if (!answers || typeof answers !== 'object') {
        return NextResponse.json(
            { error: 'invalid_request', message: 'answers object is required' },
            { status: 400 },
        );
    }

    let correctCount = 0;
    const details = Object.entries(answerKey).map(([qid, correct]) => {
        const user = answers[qid];
        const isCorrect = user === correct;
        if (isCorrect) correctCount += 1;
        return {
            questionId: qid,
            correctAnswer: correct,
            userAnswer: user,
            isCorrect,
        };
    });

    const result = {
        model: 'sequential-thinking-json-v1',
        created: Math.floor(Date.now() / 1000),
        type: 'quiz.grade.result',
        score: {
            total: Object.keys(answerKey).length,
            correct: correctCount,
            rate: Number(
                (correctCount / Object.keys(answerKey).length).toFixed(2),
            ),
        },
        details,
    };

    return NextResponse.json(result);
}
