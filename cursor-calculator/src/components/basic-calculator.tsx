'use client';

import React from 'react';
import { BasicCalculator } from '@/utils/basic-calculator';
import { Button } from '@/components/button';

interface BasicCalculatorProps {
    expression: string;
    setExpression: React.Dispatch<React.SetStateAction<string>>;
    result: string;
    setResult: React.Dispatch<React.SetStateAction<string>>;
    addToHistory: (expression: string, result: string) => void;
}

export const BasicCalculatorComponent: React.FC<BasicCalculatorProps> = ({
    expression,
    setExpression,
    result,
    setResult,
    addToHistory,
}) => {
    const handleNumberClick = (num: string) => {
        setExpression(prev => prev + num);
    };

    const handleOperatorClick = (operator: string) => {
        if (expression === '' && operator === '-') {
            // 음수 시작 허용
            setExpression('-');
            return;
        }

        if (expression === '') return;

        const lastChar = expression.slice(-1);
        if (BasicCalculator.isOperator(lastChar)) {
            // 마지막이 연산자인 경우 교체
            setExpression(prev => prev.slice(0, -1) + operator);
        } else {
            setExpression(prev => prev + operator);
        }
    };

    const handleDecimalClick = () => {
        if (BasicCalculator.canAddDecimal(expression)) {
            if (
                expression === '' ||
                BasicCalculator.isOperator(expression.slice(-1))
            ) {
                setExpression(prev => prev + '0.');
            } else {
                setExpression(prev => prev + '.');
            }
        }
    };

    const handleClear = () => {
        setExpression('');
        setResult('');
    };

    const handleBackspace = () => {
        setExpression(prev => prev.slice(0, -1));
        if (result) {
            setResult('');
        }
    };

    const handleCalculate = () => {
        try {
            if (expression === '') return;

            const calculatedResult = BasicCalculator.evaluate(expression);
            setResult(calculatedResult);
            addToHistory(expression, calculatedResult);
        } catch {
            setResult('오류');
        }
    };

    const handleParentheses = (type: 'open' | 'close') => {
        if (type === 'open') {
            setExpression(prev => prev + '(');
        } else {
            setExpression(prev => prev + ')');
        }
    };

    return (
        <div className="grid grid-cols-4 gap-3">
            {/* 첫 번째 행 */}
            <Button variant="clear" onClick={handleClear}>
                AC
            </Button>
            <Button onClick={() => handleParentheses('open')}>(</Button>
            <Button onClick={() => handleParentheses('close')}>)</Button>
            <Button variant="operator" onClick={() => handleOperatorClick('/')}>
                ÷
            </Button>

            {/* 두 번째 행 */}
            <Button onClick={() => handleNumberClick('7')}>7</Button>
            <Button onClick={() => handleNumberClick('8')}>8</Button>
            <Button onClick={() => handleNumberClick('9')}>9</Button>
            <Button variant="operator" onClick={() => handleOperatorClick('*')}>
                ×
            </Button>

            {/* 세 번째 행 */}
            <Button onClick={() => handleNumberClick('4')}>4</Button>
            <Button onClick={() => handleNumberClick('5')}>5</Button>
            <Button onClick={() => handleNumberClick('6')}>6</Button>
            <Button variant="operator" onClick={() => handleOperatorClick('-')}>
                -
            </Button>

            {/* 네 번째 행 */}
            <Button onClick={() => handleNumberClick('1')}>1</Button>
            <Button onClick={() => handleNumberClick('2')}>2</Button>
            <Button onClick={() => handleNumberClick('3')}>3</Button>
            <Button variant="operator" onClick={() => handleOperatorClick('+')}>
                +
            </Button>

            {/* 다섯 번째 행 */}
            <Button
                onClick={() => handleNumberClick('0')}
                className="col-span-2"
            >
                0
            </Button>
            <Button onClick={handleDecimalClick}>.</Button>
            <Button variant="equal" onClick={handleCalculate}>
                =
            </Button>

            {/* 백스페이스 버튼 */}
            <Button onClick={handleBackspace} className="col-span-4 mt-2">
                ← 지우기
            </Button>
        </div>
    );
};
