'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleButton } from '@/components/ui/toggle-button';
import { BackButton } from '@/components/ui/back-button';

type BlogOptions = {
    length: 'short' | 'medium' | 'long';
    tone: 'friendly' | 'professional' | 'casual';
};

export default function BlogGenerator() {
    const [keyword, setKeyword] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<BlogOptions>({
        length: 'medium',
        tone: 'professional',
    });

    const handleSubmit = async () => {
        if (!keyword.trim()) {
            alert('키워드를 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/generate/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keyword,
                    options,
                }),
            });

            if (!response.ok) {
                throw new Error('API 요청에 실패했습니다.');
            }

            const data = await response.json();
            setContent(data.content);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        alert('클립보드에 복사되었습니다.');
    };

    return (
        <div className="container mx-auto max-w-4xl min-h-screen p-4 pb-10">
            <div className="flex items-center gap-4 mb-8">
                <BackButton />
                <h1 className="text-2xl font-bold text-gray-900">
                    블로그 글 생성기
                </h1>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-base font-medium text-gray-600 mb-2">
                        키워드
                    </label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder="블로그 글의 주제나 키워드를 입력하세요"
                        className="w-full p-2 border rounded-md text-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-base font-medium text-gray-600 mb-2">
                        글 길이
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['short', 'medium', 'long'] as const).map(length => (
                            <ToggleButton
                                key={length}
                                isSelected={options.length === length}
                                onClick={() =>
                                    setOptions(prev => ({ ...prev, length }))
                                }
                            >
                                {length === 'short' && '짧게'}
                                {length === 'medium' && '보통'}
                                {length === 'long' && '길게'}
                            </ToggleButton>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-base font-medium text-gray-600 mb-2">
                        말투
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['friendly', 'professional', 'casual'] as const).map(
                            tone => (
                                <ToggleButton
                                    key={tone}
                                    isSelected={options.tone === tone}
                                    onClick={() =>
                                        setOptions(prev => ({ ...prev, tone }))
                                    }
                                >
                                    {tone === 'friendly' && '친근하게'}
                                    {tone === 'professional' && '전문적으로'}
                                    {tone === 'casual' && '가볍게'}
                                </ToggleButton>
                            ),
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8"
                    >
                        {isLoading ? '생성 중...' : '글 생성하기'}
                    </Button>
                </div>

                {content && (
                    <div className="mt-12 mb-40">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                생성된 글
                            </h2>
                            <Button variant="secondary" onClick={handleCopy}>
                                복사하기
                            </Button>
                        </div>
                        <div className="bg-white p-4 rounded-lg border whitespace-pre-wrap text-gray-600">
                            {content}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
