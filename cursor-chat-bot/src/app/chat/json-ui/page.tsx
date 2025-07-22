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
    ui?: UIComponent;
};

type UIComponent = {
    type: 'faq' | 'list' | 'table';
    title: string;
    items?: Array<{ question: string; answer: string }> | string[];
    headers?: string[];
    rows?: string[][];
};

export default function JsonUiChat() {
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
            const response = await fetch('/api/chat/json-ui', {
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
                ui: data.ui,
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

    const renderUI = (ui: UIComponent) => {
        if (!ui) return null;

        switch (ui.type) {
            case 'faq':
                return (
                    <div className="bg-white rounded-lg p-4 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {ui.title}
                        </h3>
                        <div className="space-y-4">
                            {(
                                ui.items as Array<{
                                    question: string;
                                    answer: string;
                                }>
                            )?.map((item, index) => (
                                <div key={index} className="border-b pb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {item.question}
                                    </h4>
                                    <p className="text-gray-600">
                                        {item.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'list':
                return (
                    <div className="bg-white rounded-lg p-4 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {ui.title}
                        </h3>
                        <ul className="list-disc list-inside space-y-2">
                            {(ui.items as string[])?.map((item, index) => (
                                <li key={index} className="text-gray-600">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            case 'table':
                return (
                    <div className="bg-white rounded-lg p-4 mt-4 overflow-x-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {ui.title}
                        </h3>
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    {ui.headers?.map((header, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-2 text-left text-sm font-semibold text-gray-900 bg-gray-50"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ui.rows?.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className="border-t px-4 py-2 text-sm text-gray-600"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto max-w-4xl min-h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm z-10">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <BackButton />
                            <h1 className="text-2xl font-bold text-gray-900">
                                JSON UI 챗봇
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
                    <div key={index}>
                        <Message
                            role={message.role}
                            content={message.content}
                        />
                        {message.ui && renderUI(message.ui)}
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <MessageCircle className="w-16 h-16 mb-4 text-gray-400" />
                        <p className="text-gray-600">
                            FAQ, 리스트, 테이블 등의 UI 요소를 포함한 응답을
                            요청해보세요!
                        </p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
        </div>
    );
}
