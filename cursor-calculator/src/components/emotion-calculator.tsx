'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Emotion, EmotionType, EMOTION_CONFIG } from '@/types/calculator';
import { EmotionCalculator } from '@/utils/emotion-calculator';

interface EmotionCalculatorProps {
    expression: string;
    setExpression: React.Dispatch<React.SetStateAction<string>>;
    emotionResult: string;
    setEmotionResult: React.Dispatch<React.SetStateAction<string>>;
    addToHistory: (expression: string, result: string) => void;
}

export const EmotionCalculatorComponent: React.FC<EmotionCalculatorProps> = ({
    expression,
    setExpression,
    setEmotionResult,
    addToHistory,
}) => {
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
        null,
    );
    const [intensity, setIntensity] = useState<number>(5);
    const [currentEmotions, setCurrentEmotions] = useState<Emotion[]>([]);
    const [operator, setOperator] = useState<string>('');
    const [recommendation, setRecommendation] = useState<string>('');

    const emotions: EmotionType[] = [
        '기쁨',
        '슬픔',
        '화남',
        '불안',
        '스트레스',
        '평온',
        '설렘',
        '피로',
    ];

    const createEmotion = (type: EmotionType, intensity: number): Emotion => {
        const config = EMOTION_CONFIG[type];
        return {
            type,
            intensity,
            timestamp: new Date(),
            color: config.color,
            emoji: config.emoji,
        };
    };

    const handleEmotionSelect = (emotionType: EmotionType) => {
        setSelectedEmotion(emotionType);
    };

    const handleIntensityChange = (value: number) => {
        setIntensity(value);
    };

    const handleAddEmotion = () => {
        if (!selectedEmotion) return;

        const newEmotion = createEmotion(selectedEmotion, intensity);
        setCurrentEmotions(prev => [...prev, newEmotion]);

        // 표현식 업데이트
        const emotionText = `${newEmotion.emoji}${newEmotion.type}(${newEmotion.intensity})`;
        if (currentEmotions.length === 0) {
            setExpression(emotionText);
        } else if (operator) {
            setExpression(prev => prev + ` ${operator} ${emotionText}`);
            setOperator('');
        }

        setSelectedEmotion(null);
        setIntensity(5);
    };

    const handleOperatorClick = (op: string) => {
        if (currentEmotions.length === 0) return;
        setOperator(op);
        setExpression(prev => prev + ` ${op} `);
    };

    const handleCalculate = () => {
        if (currentEmotions.length === 0) return;

        let result = currentEmotions[0];

        // 순차적으로 감정 계산
        for (let i = 1; i < currentEmotions.length; i++) {
            result = EmotionCalculator.add(result, currentEmotions[i]);
        }

        const resultText = EmotionCalculator.getEmotionDescription(result);
        setEmotionResult(resultText);

        // 추천사항 생성
        const rec = EmotionCalculator.getRecommendation(result);
        setRecommendation(rec);

        addToHistory(expression, resultText);
    };

    const handleClear = () => {
        setExpression('');
        setEmotionResult('');
        setCurrentEmotions([]);
        setSelectedEmotion(null);
        setOperator('');
        setRecommendation('');
        setIntensity(5);
    };

    const handleBackspace = () => {
        if (currentEmotions.length > 0) {
            setCurrentEmotions(prev => prev.slice(0, -1));
            // 표현식도 업데이트
            const newExpression = currentEmotions
                .slice(0, -1)
                .map(
                    emotion =>
                        `${emotion.emoji}${emotion.type}(${emotion.intensity})`,
                )
                .join(' + ');
            setExpression(newExpression);
        }
    };

    return (
        <div className="space-y-6">
            {/* 감정 선택 영역 */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    감정 선택
                </h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {emotions.map(emotion => (
                        <Button
                            key={emotion}
                            onClick={() => handleEmotionSelect(emotion)}
                            variant={
                                selectedEmotion === emotion
                                    ? 'emotion'
                                    : 'default'
                            }
                            size="sm"
                            className="text-xs"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-lg">
                                    {EMOTION_CONFIG[emotion].emoji}
                                </span>
                                <span>{emotion}</span>
                            </div>
                        </Button>
                    ))}
                </div>

                {/* 강도 선택 */}
                {selectedEmotion && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                강도 선택:
                            </span>
                            <span className="font-medium">{intensity}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={intensity}
                            onChange={e =>
                                handleIntensityChange(Number(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>매우 약함</span>
                            <span>보통</span>
                            <span>매우 강함</span>
                        </div>
                        <Button
                            onClick={handleAddEmotion}
                            variant="emotion"
                            className="w-full"
                            disabled={!selectedEmotion}
                        >
                            감정 추가
                        </Button>
                    </div>
                )}
            </div>

            {/* 연산자 버튼 */}
            <div className="grid grid-cols-4 gap-3">
                <Button
                    variant="operator"
                    onClick={() => handleOperatorClick('+')}
                    disabled={currentEmotions.length === 0 || operator !== ''}
                >
                    + 더하기
                </Button>
                <Button
                    variant="operator"
                    onClick={() => handleOperatorClick('-')}
                    disabled={currentEmotions.length === 0 || operator !== ''}
                >
                    - 빼기
                </Button>
                <Button
                    variant="equal"
                    onClick={handleCalculate}
                    disabled={currentEmotions.length === 0}
                >
                    = 계산
                </Button>
                <Button variant="clear" onClick={handleClear}>
                    AC
                </Button>
            </div>

            {/* 백스페이스 버튼 */}
            <Button
                onClick={handleBackspace}
                className="w-full"
                disabled={currentEmotions.length === 0}
            >
                ← 마지막 감정 제거
            </Button>

            {/* 추천사항 표시 */}
            {recommendation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                        💡 추천사항
                    </h4>
                    <p className="text-sm text-blue-700">{recommendation}</p>
                </div>
            )}
        </div>
    );
};
