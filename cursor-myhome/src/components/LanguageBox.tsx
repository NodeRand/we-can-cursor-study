'use client';

import { useState } from 'react';
import OpenAI from 'openai';
import Image from 'next/image';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const systemMessage = `Generate a sentence in both English and Korean to facilitate language study.
When a request is made, provide a single sentence with its translation: first present the English sentence, then its accurate Korean equivalent.
Choose sentences that are useful for general language learners and are straightforward for study.
Ensure the two versions express the same meaning and are grammatically correct in both languages.
Do not provide any explanations or additional output; only the two sentences.
Maintain the following output format, using line breaks for clarity:

English: [English sentence]
Korean: [Korean sentence]`;

export default function LanguageBox() {
    const [englishSentence, setEnglishSentence] = useState<string>('');
    const [koreanSentence, setKoreanSentence] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPlayingEnglish, setIsPlayingEnglish] = useState<boolean>(false);
    const [isPlayingKorean, setIsPlayingKorean] = useState<boolean>(false);

    const generateSentence = async () => {
        setIsLoading(true);
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: 'Generate a new sentence pair' },
                ],
                model: 'gpt-3.5-turbo',
            });

            const response = completion.choices[0]?.message?.content || '';
            console.log('completion', completion);
            console.log('response', response);
            const [english, korean] = response
                .split('\n')
                .filter((line: string) => line.trim());

            if (english && korean) {
                setEnglishSentence(english.replace('English: ', ''));
                setKoreanSentence(korean.replace('Korean: ', ''));
            }
        } catch (error) {
            console.error('Error generating sentence:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const playTTS = async (text: string, isEnglish: boolean) => {
        try {
            if (isEnglish) {
                setIsPlayingEnglish(true);
            } else {
                setIsPlayingKorean(true);
            }

            const response = await openai.audio.speech.create({
                model: 'tts-1',
                voice: isEnglish ? 'nova' : 'alloy',
                input: text,
            });

            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            audio.onended = () => {
                URL.revokeObjectURL(url);
                if (isEnglish) {
                    setIsPlayingEnglish(false);
                } else {
                    setIsPlayingKorean(false);
                }
            };

            await audio.play();
        } catch (error) {
            console.error('Error playing TTS:', error);
            setIsPlayingEnglish(false);
            setIsPlayingKorean(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl text-gray-800 font-bold mb-4">
                오늘의 영어학습
            </h2>
            <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-700">English:</p>
                        {englishSentence && (
                            <button
                                onClick={() => playTTS(englishSentence, true)}
                                disabled={isPlayingEnglish}
                                className={`text-blue-500 hover:text-blue-600 transition-colors ${
                                    isPlayingEnglish ? 'animate-pulse' : ''
                                }`}
                                title="Play English audio"
                            >
                                <Image
                                    src="/speaker.svg"
                                    alt="Play audio"
                                    width={24}
                                    height={24}
                                    className="text-current"
                                />
                            </button>
                        )}
                    </div>
                    <p className="text-lg">
                        {englishSentence ||
                            'Click the button to generate a sentence'}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-700">Korean:</p>
                        {koreanSentence && (
                            <button
                                onClick={() => playTTS(koreanSentence, false)}
                                disabled={isPlayingKorean}
                                className={`text-blue-500 hover:text-blue-600 transition-colors ${
                                    isPlayingKorean ? 'animate-pulse' : ''
                                }`}
                                title="Play Korean audio"
                            >
                                <Image
                                    src="/speaker.svg"
                                    alt="Play audio"
                                    width={24}
                                    height={24}
                                    className="text-current"
                                />
                            </button>
                        )}
                    </div>
                    <p className="text-lg">
                        {koreanSentence || '버튼을 클릭하여 문장을 생성하세요'}
                    </p>
                </div>
            </div>
            <button
                onClick={generateSentence}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
                {isLoading ? '생성 중...' : '오늘의 문장 생성하기'}
            </button>
        </div>
    );
}
