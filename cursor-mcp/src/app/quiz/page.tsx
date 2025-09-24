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

export default function QuizPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    useEffect(() => {
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

    const allAnswered = useMemo(() => {
        return questions.length > 0 && questions.every(q => !!answers[q.id]);
    }, [answers, questions]);

    const onSelect = (qid: string, cid: string) => {
        setAnswers(prev => ({ ...prev, [qid]: cid }));
    };

    const onSubmit = async () => {
        try {
            const res = await fetch('/api/quiz/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }),
            });
            const data = await res.json();
            const url = `/quiz/result?payload=${encodeURIComponent(
                JSON.stringify(data),
            )}`;
            window.location.assign(url);
        } catch (e) {
            alert('제출 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                불러오는 중…
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
            <h1 className="text-2xl font-bold">Cursor 퀴즈</h1>
            <ol className="space-y-6">
                {questions.map((q, idx) => (
                    <li key={q.id} className="space-y-3">
                        <div className="font-semibold">
                            {idx + 1}. {q.question}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.choices.map(c => {
                                const active = answers[q.id] === c.id;
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => onSelect(q.id, c.id)}
                                        className={`text-left rounded-xl border p-3 transition ${
                                            active
                                                ? 'border-cyan-400 bg-cyan-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {c.text}
                                    </button>
                                );
                            })}
                        </div>
                    </li>
                ))}
            </ol>

            <div className="pt-6">
                <MagicButton
                    onClick={onSubmit}
                    className={
                        allAnswered ? '' : 'opacity-60 pointer-events-none'
                    }
                >
                    제출하고 JSON 결과 보기
                </MagicButton>
            </div>
        </div>
    );
}
