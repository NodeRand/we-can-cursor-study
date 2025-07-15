'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorMode, CalculationHistory } from '@/types/calculator';
import { ModeSwitch } from '@/components/mode-switch';
import { Display } from '@/components/display';
import { BasicCalculatorComponent } from '@/components/basic-calculator';
import { BasicCalculator } from '@/utils/basic-calculator';
import { EmotionCalculatorComponent } from '@/components/emotion-calculator';
import { History } from '@/components/history';

export const Calculator: React.FC = () => {
    const [mode, setMode] = useState<CalculatorMode>('basic');
    const [expression, setExpression] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [emotionResult, setEmotionResult] = useState<string>('');
    const [history, setHistory] = useState<CalculationHistory[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);

    // 키보드 이벤트 핸들러
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode !== 'basic') return;

            // 숫자 키 (0-9)
            if (/^[0-9]$/.test(e.key)) {
                setExpression(prev => prev + e.key);
            }
            // 연산자
            else if (['+', '-', '*', '/', '(', ')'].includes(e.key)) {
                if (e.key === '/' || e.key === '*') {
                    e.preventDefault(); // 브라우저 기본 동작 방지
                }
                if (expression === '' && e.key === '-') {
                    setExpression('-');
                } else if (expression !== '') {
                    const lastChar = expression.slice(-1);
                    if (['+', '-', '*', '/'].includes(lastChar)) {
                        setExpression(prev => prev.slice(0, -1) + e.key);
                    } else {
                        setExpression(prev => prev + e.key);
                    }
                }
            }
            // 소수점
            else if (e.key === '.') {
                if (BasicCalculator.canAddDecimal(expression)) {
                    if (
                        expression === '' ||
                        ['+', '-', '*', '/'].includes(expression.slice(-1))
                    ) {
                        setExpression(prev => prev + '0.');
                    } else {
                        setExpression(prev => prev + '.');
                    }
                }
            }
            // Enter 키 (계산)
            else if (e.key === 'Enter') {
                e.preventDefault();
                try {
                    if (expression === '') return;
                    const calculatedResult =
                        BasicCalculator.evaluate(expression);
                    setResult(calculatedResult);
                    addToHistory(expression, calculatedResult);
                } catch {
                    setResult('오류');
                }
            }
            // Backspace 키
            else if (e.key === 'Backspace') {
                setExpression(prev => prev.slice(0, -1));
                if (result) {
                    setResult('');
                }
            }
            // Escape 키 (초기화)
            else if (e.key === 'Escape') {
                setExpression('');
                setResult('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, expression, result]);

    // 로컬 스토리지에서 기록 불러오기
    useEffect(() => {
        const savedHistory = localStorage.getItem('calculator-history');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                // Date 객체로 변환
                const historyWithDates = parsed.map(
                    (item: CalculationHistory) => ({
                        ...item,
                        timestamp: new Date(item.timestamp),
                    }),
                );
                setHistory(historyWithDates);
            } catch (error) {
                console.error(
                    'Failed to parse history from localStorage:',
                    error,
                );
            }
        }
    }, []);

    // 기록이 변경될 때마다 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem('calculator-history', JSON.stringify(history));
    }, [history]);

    const handleModeChange = (newMode: CalculatorMode) => {
        setMode(newMode);
        setExpression('');
        setResult('');
        setEmotionResult('');
    };

    const addToHistory = (expr: string, res: string) => {
        const newHistoryItem: CalculationHistory = {
            id: Date.now().toString(),
            expression: expr,
            result: res,
            timestamp: new Date(),
            mode: mode,
        };

        setHistory(prev => [...prev, newHistoryItem].slice(-20)); // 최대 20개 기록 유지
    };

    const handleClearHistory = () => {
        setHistory([]);
        localStorage.removeItem('calculator-history');
    };

    const handleUseHistoryItem = (item: CalculationHistory) => {
        if (item.mode === mode) {
            setExpression(item.expression);
            if (mode === 'basic') {
                setResult(item.result);
            } else {
                setEmotionResult(item.result);
            }
        }
        setShowHistory(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto">
                {/* 헤더 */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🧮 스마트 계산기
                    </h1>
                    <p className="text-gray-600">
                        기본 계산과 감정 계산을 한번에!
                    </p>
                </div>

                {/* 메인 계산기 */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                    <ModeSwitch
                        currentMode={mode}
                        onModeChange={handleModeChange}
                    />

                    <Display
                        expression={expression}
                        result={result}
                        mode={mode}
                        emotionResult={emotionResult}
                    />

                    {mode === 'basic' ? (
                        <BasicCalculatorComponent
                            expression={expression}
                            setExpression={setExpression}
                            result={result}
                            setResult={setResult}
                            addToHistory={addToHistory}
                        />
                    ) : (
                        <EmotionCalculatorComponent
                            expression={expression}
                            setExpression={setExpression}
                            emotionResult={emotionResult}
                            setEmotionResult={setEmotionResult}
                            addToHistory={addToHistory}
                        />
                    )}
                </div>

                {/* 기록 토글 버튼 */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="bg-white rounded-lg shadow-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <span>📝</span>
                        <span>
                            {showHistory ? '기록 숨기기' : '계산 기록 보기'}
                        </span>
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {history.length}
                        </span>
                    </button>
                </div>

                {/* 계산 기록 */}
                {showHistory && (
                    <div className="mb-4">
                        <History
                            history={history}
                            onClearHistory={handleClearHistory}
                            onUseHistoryItem={handleUseHistoryItem}
                        />
                    </div>
                )}

                {/* 푸터 */}
                <div className="text-center text-sm text-gray-500">
                    <p>💡 감정 계산기로 오늘의 마음을 계산해보세요!</p>
                </div>
            </div>
        </div>
    );
};
