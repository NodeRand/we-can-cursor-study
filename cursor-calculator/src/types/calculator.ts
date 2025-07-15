export type CalculatorMode = 'basic' | 'emotion';

export interface CalculationHistory {
    id: string;
    expression: string;
    result: string;
    timestamp: Date;
    mode: CalculatorMode;
}

export type EmotionType =
    | '기쁨'
    | '슬픔'
    | '화남'
    | '불안'
    | '스트레스'
    | '평온'
    | '설렘'
    | '피로';

export interface Emotion {
    type: EmotionType;
    intensity: number; // 1-10 척도
    timestamp: Date;
    note?: string;
    color: string;
    emoji: string;
}

export interface EmotionCalculation {
    emotions: Emotion[];
    result: Emotion;
    expression: string;
}

export const EMOTION_CONFIG: Record<
    EmotionType,
    { color: string; emoji: string }
> = {
    기쁨: { color: '#FFD700', emoji: '😊' },
    슬픔: { color: '#4682B4', emoji: '😢' },
    화남: { color: '#FF6347', emoji: '😡' },
    불안: { color: '#DDA0DD', emoji: '😰' },
    스트레스: { color: '#FF4500', emoji: '😵' },
    평온: { color: '#98FB98', emoji: '😌' },
    설렘: { color: '#FFB6C1', emoji: '🥰' },
    피로: { color: '#696969', emoji: '😴' },
};
