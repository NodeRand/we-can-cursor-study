'use client';

import { useEffect, useMemo, useState } from 'react';
import { MagicButton } from '@/components/ui/magic-button';

type Choice = { id: string; text: string };
type Question = {
    id: string;
    type: 'single';
    question: string;
    choices: Choice[];
};

export default function QuizResultPage() {
    const [payload, setPayload] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 클라이언트에서만 payload 파싱
        const url = new URL(window.location.href);
        const raw = url.searchParams.get('payload');
        if (raw) {
            try {
                setPayload(JSON.parse(decodeURIComponent(raw)));
            } catch {
                setError('Invalid payload');
                setLoading(false);
                return;
            }
        } else {
            setError('결과 payload 가 없습니다.');
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const res = await fetch('/api/quiz/cursor', {
                    cache: 'no-store',
                });
                const data = await res.json();
                setQuestions(data.questions as Question[]);
            } catch (e: any) {
                setError(e?.message ?? 'failed to load');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const score = payload?.score;
    const details: Array<{
        questionId: string;
        correctAnswer: string;
        userAnswer: string;
        isCorrect: boolean;
    }> = payload?.details ?? [];

    const byId = useMemo(() => {
        const map: Record<string, Question> = {};
        for (const q of questions) map[q.id] = q;
        return map;
    }, [questions]);

    if (error && !payload) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                불러오는 중…
            </div>
        );
    }

    if (error && payload) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold">결과 요약</h1>
                    <p className="text-sm text-gray-500">
                        모델: {payload.model}
                    </p>
                </div>
                {score && (
                    <div className="text-right">
                        <div className="text-3xl font-extrabold">
                            {Math.round(score.rate * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">
                            {score.correct} / {score.total}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-5">
                {details.map((d, idx) => {
                    const q = byId[d.questionId];
                    if (!q) return null;
                    return (
                        <div
                            key={d.questionId}
                            className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="font-semibold">
                                    {idx + 1}. {q.question}
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        d.isCorrect
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}
                                >
                                    {d.isCorrect ? '정답' : '오답'}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {q.choices.map(c => {
                                    const isCorrect = c.id === d.correctAnswer;
                                    const isUser = c.id === d.userAnswer;
                                    const state = isCorrect
                                        ? 'correct'
                                        : isUser
                                        ? 'selected'
                                        : 'default';
                                    return (
                                        <div
                                            key={c.id}
                                            className={`rounded-xl border p-3 text-sm ${
                                                state === 'correct'
                                                    ? 'border-emerald-300 bg-emerald-50'
                                                    : state === 'selected'
                                                    ? 'border-amber-300 bg-amber-50'
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{c.text}</span>
                                                {state !== 'default' && (
                                                    <span
                                                        className={`ml-3 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                            state === 'correct'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                    >
                                                        {state === 'correct'
                                                            ? '정답'
                                                            : '선택'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <MagicButton as="a" href="/" className="px-5">
                    홈으로
                </MagicButton>
                <MagicButton as="a" href="/quiz" className="px-5">
                    다시 풀기
                </MagicButton>
            </div>
        </div>
    );
}
