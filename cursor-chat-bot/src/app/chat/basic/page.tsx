'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/components/chat/message';
import { ChatInput } from '@/components/chat/chat-input';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function BasicChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (content: string) => {
        try {
            setIsLoading(true);

            // 사용자 메시지 추가
            const userMessage: Message = { role: 'user', content };
            setMessages(prev => [...prev, userMessage]);

            // API 호출
            const response = await fetch('/api/chat/basic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: content }),
            });

            if (!response.ok) {
                throw new Error('API 요청에 실패했습니다.');
            }

            const data = await response.json();

            // AI 응답 추가
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.message,
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([]);
    };

    return (
        <div className="container mx-auto max-w-4xl min-h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm z-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <BackButton />
                            <h1 className="text-2xl font-bold text-gray-900">
                                기본 챗봇
                            </h1>
                        </div>
                        <Button variant="secondary" onClick={handleReset}>
                            대화 초기화
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-36 pt-20">
                {messages.map((message, index) => (
                    <Message
                        key={index}
                        role={message.role}
                        content={message.content}
                    />
                ))}
                {messages.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <MessageCircle className="w-16 h-16 mb-4 text-gray-400" />
                        <p className="text-gray-600">대화를 시작해보세요!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
        </div>
    );
}
