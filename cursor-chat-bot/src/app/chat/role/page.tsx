'use client';

import { useState } from 'react';
import { Message } from '@/components/chat/message';
import { ChatInput } from '@/components/chat/chat-input';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ToggleButton } from '@/components/ui/toggle-button';
import { BackButton } from '@/components/ui/back-button';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type Role = {
    id: string;
    name: string;
    systemPrompt: string;
};

const roles: Role[] = [
    {
        id: 'doctor',
        name: '의사',
        systemPrompt:
            '당신은 경험이 풍부한 의사입니다. 의학적 조언과 건강 관련 정보를 제공해주세요.',
    },
    {
        id: 'developer',
        name: '개발자',
        systemPrompt:
            '당신은 시니어 소프트웨어 개발자입니다. 코딩과 기술적인 문제에 대해 도움을 주세요.',
    },
    {
        id: 'english_teacher',
        name: '영어 선생님',
        systemPrompt:
            '당신은 경험 많은 영어 교사입니다. 영어 학습과 관련된 도움을 주세요.',
    },
    {
        id: 'counselor',
        name: '심리 상담사',
        systemPrompt:
            '당신은 전문 심리 상담사입니다. 공감적 경청과 심리적 조언을 제공해주세요.',
    },
];

export default function RoleChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);

    const handleSubmit = async (content: string) => {
        try {
            setIsLoading(true);

            // 사용자 메시지 추가
            const userMessage: Message = { role: 'user', content };
            setMessages(prev => [...prev, userMessage]);

            // API 호출
            const response = await fetch('/api/chat/role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    systemPrompt: selectedRole.systemPrompt,
                }),
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

    const handleRoleChange = (newRole: Role) => {
        console.log('Role changed:', newRole.name); // 디버깅용 로그
        setSelectedRole(newRole);
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
                                역할 기반 챗봇
                            </h1>
                        </div>
                        <Button variant="secondary" onClick={handleReset}>
                            대화 초기화
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-20 relative z-10">
                <div className="sticky top-[5rem] bg-gray-50/50 p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {roles.map(role => (
                            <ToggleButton
                                key={role.id}
                                isSelected={selectedRole.id === role.id}
                                onClick={() => handleRoleChange(role)}
                            >
                                {role.name}
                            </ToggleButton>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-36">
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
                        <p className="text-gray-600">
                            {selectedRole.name}에게 질문해보세요!
                        </p>
                    </div>
                )}
            </div>

            <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
        </div>
    );
}
