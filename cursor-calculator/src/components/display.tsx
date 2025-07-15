'use client';

import React from 'react';
import { CalculatorMode } from '@/types/calculator';

interface DisplayProps {
    expression: string;
    result: string;
    mode: CalculatorMode;
    emotionResult?: string;
}

export const Display: React.FC<DisplayProps> = ({
    expression,
    result,
    mode,
    emotionResult,
}) => {
    const displayResult =
        mode === 'emotion' && emotionResult ? emotionResult : result;

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg mb-4 min-h-[120px] flex flex-col justify-between">
            {/* 계산식 표시 영역 */}
            <div className="text-right">
                <div className="text-sm text-gray-400 mb-2 min-h-[20px] overflow-hidden">
                    {expression ||
                        (mode === 'basic'
                            ? '계산식을 입력하세요'
                            : '감정을 선택하세요')}
                </div>

                {/* 결과 표시 영역 */}
                <div className="text-3xl font-bold min-h-[40px] overflow-hidden">
                    {displayResult || '0'}
                </div>
            </div>

            {/* 모드 표시 */}
            <div className="flex justify-between items-center mt-4">
                <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        mode === 'basic'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                    }`}
                >
                    {mode === 'basic' ? '📊 기본 계산' : '💭 감정 계산'}
                </div>

                {mode === 'emotion' && (
                    <div className="text-xs text-gray-400">감정 강도: 1-10</div>
                )}
            </div>
        </div>
    );
};
