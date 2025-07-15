export class BasicCalculator {
    static evaluate(expression: string): string {
        try {
            // 안전한 계산을 위해 허용된 문자만 포함되어 있는지 확인
            if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
                throw new Error('Invalid characters in expression');
            }

            // 연속된 연산자 방지
            if (/[+\-*/]{2,}/.test(expression)) {
                throw new Error('Invalid operator sequence');
            }

            // 괄호 매칭 확인
            const openBrackets = (expression.match(/\(/g) || []).length;
            const closeBrackets = (expression.match(/\)/g) || []).length;
            if (openBrackets !== closeBrackets) {
                throw new Error('Mismatched parentheses');
            }

            // 표현식이 연산자로 끝나는 경우 처리
            if (/[+\-*/]$/.test(expression.trim())) {
                expression = expression.trim().slice(0, -1);
            }

            // 빈 표현식 처리
            if (!expression.trim()) {
                return '0';
            }

            // Function constructor를 사용한 안전한 계산
            const result = Function(`"use strict"; return (${expression})`)();

            if (!isFinite(result)) {
                throw new Error('Result is not finite');
            }

            // 결과를 적절한 형식으로 포맷팅
            return this.formatResult(result);
        } catch {
            throw new Error('계산 오류');
        }
    }

    private static formatResult(result: number): string {
        // 매우 큰 수나 작은 수는 지수 표기법 사용
        if (
            Math.abs(result) >= 1e10 ||
            (Math.abs(result) < 1e-6 && result !== 0)
        ) {
            return result.toExponential(6);
        }

        // 소수점 처리 (최대 10자리)
        const rounded = Math.round(result * 1e10) / 1e10;

        // 정수인 경우 소수점 제거
        if (rounded === Math.floor(rounded)) {
            return rounded.toString();
        }

        return rounded.toString();
    }

    static isOperator(char: string): boolean {
        return ['+', '-', '*', '/'].includes(char);
    }

    static isNumber(char: string): boolean {
        return /^[0-9.]$/.test(char);
    }

    static getLastNumber(expression: string): string {
        const match = expression.match(/(\d+\.?\d*)$/);
        return match ? match[1] : '';
    }

    static canAddDecimal(expression: string): boolean {
        const lastNumber = this.getLastNumber(expression);
        return !lastNumber.includes('.');
    }

    static validateExpression(expression: string): boolean {
        // 빈 문자열은 유효하지 않음
        if (!expression.trim()) return false;

        // 허용된 문자만 포함되어 있는지 확인
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) return false;

        // 연속된 연산자 방지 (단, 음수 부호는 허용)
        if (/[+*/]{2,}|[-]{3,}/.test(expression)) return false;

        // 괄호 매칭 확인
        const openBrackets = (expression.match(/\(/g) || []).length;
        const closeBrackets = (expression.match(/\)/g) || []).length;
        if (openBrackets !== closeBrackets) return false;

        return true;
    }
}
