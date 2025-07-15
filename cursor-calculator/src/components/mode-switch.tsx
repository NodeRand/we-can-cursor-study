'use client';

import React from 'react';
import { CalculatorMode } from '@/types/calculator';

interface ModeSwitchProps {
    currentMode: CalculatorMode;
    onModeChange: (mode: CalculatorMode) => void;
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({
    currentMode,
    onModeChange,
}) => {
    return (
        <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
            <button
                onClick={() => onModeChange('basic')}
                className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 font-medium ${
                    currentMode === 'basic'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
            >
                <div className="flex items-center justify-center gap-2">
                    <span>📊</span>
                    <span>기본 계산</span>
                </div>
            </button>

            <button
                onClick={() => onModeChange('emotion')}
                className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 font-medium ${
                    currentMode === 'emotion'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
            >
                <div className="flex items-center justify-center gap-2">
                    <span>💭</span>
                    <span>감정 계산</span>
                </div>
            </button>
        </div>
    );
};
