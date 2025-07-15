import { Emotion, EmotionType, EMOTION_CONFIG } from '@/types/calculator';

export class EmotionCalculator {
    // 감정 연산 규칙 정의
    private static emotionRules: Record<
        string,
        { result: EmotionType; intensity: number }
    > = {
        '기쁨+기쁨': { result: '기쁨', intensity: 1.5 },
        '기쁨+슬픔': { result: '평온', intensity: 0.8 },
        '기쁨+화남': { result: '불안', intensity: 0.9 },
        '기쁨+불안': { result: '평온', intensity: 0.7 },
        '기쁨+스트레스': { result: '피로', intensity: 0.8 },
        '기쁨+평온': { result: '기쁨', intensity: 1.2 },
        '기쁨+설렘': { result: '기쁨', intensity: 1.4 },
        '기쁨+피로': { result: '평온', intensity: 0.6 },

        '슬픔+슬픔': { result: '슬픔', intensity: 1.3 },
        '슬픔+화남': { result: '스트레스', intensity: 1.1 },
        '슬픔+불안': { result: '슬픔', intensity: 1.2 },
        '슬픔+스트레스': { result: '피로', intensity: 1.1 },
        '슬픔+평온': { result: '평온', intensity: 0.8 },
        '슬픔+설렘': { result: '불안', intensity: 0.9 },
        '슬픔+피로': { result: '피로', intensity: 1.3 },

        '화남+화남': { result: '화남', intensity: 1.4 },
        '화남+불안': { result: '스트레스', intensity: 1.2 },
        '화남+스트레스': { result: '화남', intensity: 1.3 },
        '화남+평온': { result: '불안', intensity: 0.7 },
        '화남+설렘': { result: '불안', intensity: 1.0 },
        '화남+피로': { result: '스트레스', intensity: 1.1 },

        '불안+불안': { result: '스트레스', intensity: 1.2 },
        '불안+스트레스': { result: '피로', intensity: 1.2 },
        '불안+평온': { result: '평온', intensity: 0.8 },
        '불안+설렘': { result: '불안', intensity: 1.1 },
        '불안+피로': { result: '피로', intensity: 1.2 },

        '스트레스+스트레스': { result: '피로', intensity: 1.3 },
        '스트레스+평온': { result: '피로', intensity: 0.9 },
        '스트레스+설렘': { result: '불안', intensity: 1.0 },
        '스트레스+피로': { result: '피로', intensity: 1.4 },

        '평온+평온': { result: '평온', intensity: 1.2 },
        '평온+설렘': { result: '기쁨', intensity: 1.1 },
        '평온+피로': { result: '평온', intensity: 0.9 },

        '설렘+설렘': { result: '기쁨', intensity: 1.3 },
        '설렘+피로': { result: '평온', intensity: 0.8 },

        '피로+피로': { result: '피로', intensity: 1.3 },
    };

    static add(emotion1: Emotion, emotion2: Emotion): Emotion {
        const key1 = `${emotion1.type}+${emotion2.type}`;
        const key2 = `${emotion2.type}+${emotion1.type}`;

        const rule = this.emotionRules[key1] || this.emotionRules[key2];

        if (rule) {
            const resultIntensity = Math.min(
                10,
                Math.max(
                    1,
                    Math.round(
                        ((emotion1.intensity + emotion2.intensity) *
                            rule.intensity) /
                            2,
                    ),
                ),
            );

            return this.createEmotion(rule.result, resultIntensity);
        }

        // 기본 규칙: 평균 계산
        const avgIntensity = Math.round(
            (emotion1.intensity + emotion2.intensity) / 2,
        );
        const resultType =
            emotion1.intensity >= emotion2.intensity
                ? emotion1.type
                : emotion2.type;

        return this.createEmotion(resultType, avgIntensity);
    }

    static subtract(emotion1: Emotion, emotion2: Emotion): Emotion {
        let resultIntensity = emotion1.intensity - emotion2.intensity;

        if (resultIntensity <= 0) {
            return this.createEmotion('평온', 1);
        }

        resultIntensity = Math.min(10, Math.max(1, resultIntensity));
        return this.createEmotion(emotion1.type, resultIntensity);
    }

    static multiply(emotion: Emotion, factor: number): Emotion {
        const resultIntensity = Math.min(
            10,
            Math.max(1, Math.round(emotion.intensity * factor)),
        );
        return this.createEmotion(emotion.type, resultIntensity);
    }

    static divide(emotion: Emotion, divisor: number): Emotion {
        if (divisor === 0) {
            return this.createEmotion('불안', 10);
        }

        const resultIntensity = Math.min(
            10,
            Math.max(1, Math.round(emotion.intensity / divisor)),
        );
        return this.createEmotion(emotion.type, resultIntensity);
    }

    private static createEmotion(
        type: EmotionType,
        intensity: number,
    ): Emotion {
        const config = EMOTION_CONFIG[type];
        return {
            type,
            intensity,
            timestamp: new Date(),
            color: config.color,
            emoji: config.emoji,
        };
    }

    static getEmotionDescription(emotion: Emotion): string {
        const intensityDesc = this.getIntensityDescription(emotion.intensity);
        return `${emotion.emoji} ${emotion.type} (${intensityDesc})`;
    }

    private static getIntensityDescription(intensity: number): string {
        if (intensity >= 9) return '매우 강함';
        if (intensity >= 7) return '강함';
        if (intensity >= 5) return '보통';
        if (intensity >= 3) return '약함';
        return '매우 약함';
    }

    static getRecommendation(emotion: Emotion): string {
        const recommendations: Record<EmotionType, string[]> = {
            기쁨: [
                '이 기분을 친구들과 나눠보세요!',
                '좋아하는 음악을 들어보세요',
                '산책을 해보는 건 어떨까요?',
            ],
            슬픔: [
                '따뜻한 차 한 잔 어때요?',
                '좋은 친구와 대화해보세요',
                '좋아하는 영화를 보세요',
            ],
            화남: [
                '심호흡을 10번 해보세요',
                '산책으로 머리를 식혀보세요',
                '운동으로 스트레스를 풀어보세요',
            ],
            불안: [
                '명상이나 요가를 해보세요',
                '좋아하는 음악을 들어보세요',
                '신뢰하는 사람과 이야기해보세요',
            ],
            스트레스: [
                '잠시 휴식을 취해보세요',
                '스트레칭을 해보세요',
                '자연 소리를 들어보세요',
            ],
            평온: [
                '이 상태를 유지해보세요',
                '감사 일기를 써보세요',
                '좋은 책을 읽어보세요',
            ],
            설렘: [
                '이 에너지를 창조적인 일에 사용해보세요!',
                '새로운 취미를 시작해보세요',
                '친구들과 즐거운 시간을 보내세요',
            ],
            피로: [
                '충분한 휴식을 취하세요',
                '가벼운 스트레칭을 해보세요',
                '따뜻한 목욕을 해보세요',
            ],
        };

        const emotionRecommendations = recommendations[emotion.type] || [];
        return (
            emotionRecommendations[
                Math.floor(Math.random() * emotionRecommendations.length)
            ] || '자신을 돌보는 시간을 가져보세요.'
        );
    }
}
