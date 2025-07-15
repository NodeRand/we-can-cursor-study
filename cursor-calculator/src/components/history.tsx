'use client';

import React from 'react';
import { CalculationHistory } from '@/types/calculator';

interface HistoryProps {
    history: CalculationHistory[];
    onClearHistory: () => void;
    onUseHistoryItem: (item: CalculationHistory) => void;
}

export const History: React.FC<HistoryProps> = ({
    history,
    onClearHistory,
    onUseHistoryItem,
}) => {
    if (history.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>계산 기록이 없습니다</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">📝 계산 기록</h3>
                <button
                    onClick={onClearHistory}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                    전체 삭제
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
                {history
                    .slice()
                    .reverse()
                    .map(item => (
                        <div
                            key={item.id}
                            onClick={() => onUseHistoryItem(item)}
                            className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`inline-block w-2 h-2 rounded-full ${
                                                item.mode === 'basic'
                                                    ? 'bg-blue-500'
                                                    : 'bg-purple-500'
                                            }`}
                                        ></span>
                                        <span className="text-xs text-gray-500">
                                            {item.mode === 'basic'
                                                ? '기본'
                                                : '감정'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(
                                                item.timestamp,
                                            ).toLocaleTimeString('ko-KR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 truncate mb-1">
                                        {item.expression}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        = {item.result}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 ml-2">
                                    클릭하여 사용
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
