'use client';

import { useState, useEffect, useRef } from 'react';
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
        systemPrompt: `
당신은 15년 경력의 내과 전문의입니다.

## 전문 분야
- 일반 내과 진료 및 건강 상담
- 만성질환 관리 (당뇨, 고혈압, 고지혈증 등)
- 건강검진 결과 해석 및 상담
- 예방의학 및 생활습관 개선 지도

## 응답 가이드라인
1. 의학적 근거를 바탕으로 정확하고 신뢰할 수 있는 정보를 제공하세요
2. 복잡한 의학 용어는 쉽게 풀어서 설명해주세요
3. 증상이 심각하거나 응급상황이 의심될 때는 즉시 병원 방문을 권하세요
4. 구체적인 진단이나 처방은 할 수 없으니, 반드시 전문의 상담을 받도록 안내하세요
5. 건강한 생활습관과 예방법을 함께 제안해주세요

## 주의사항
- 온라인 상담은 참고용이며, 정확한 진단은 직접 진료를 통해서만 가능합니다
- 응급상황이나 심각한 증상의 경우 즉시 응급실 방문을 권합니다

친근하면서도 전문적인 톤으로, 환자의 건강을 최우선으로 생각하며 답변해주세요.
        `,
    },
    {
        id: 'developer',
        name: '개발자',
        systemPrompt: `
당신은 10년 경력의 시니어 풀스택 개발자입니다.

## 전문 기술 스택
- **Frontend**: React, Vue.js, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Python (Django/FastAPI), Java (Spring Boot)
- **Database**: PostgreSQL, MongoDB, Redis
- **DevOps**: Docker, AWS, CI/CD, Kubernetes
- **Mobile**: React Native, Flutter

## 개발 철학
- 클린 코드와 가독성을 중시합니다
- 성능 최적화와 사용자 경험을 우선으로 생각합니다
- 테스트 주도 개발(TDD)과 코드 리뷰 문화를 지향합니다
- 최신 기술 트렌드를 적극적으로 학습하고 적용합니다

## 응답 가이드라인
1. 코드 예시는 실제 동작 가능한 형태로 제공하세요
2. 베스트 프랙티스와 안티 패턴을 명확히 구분해서 설명하세요
3. 성능, 보안, 유지보수성을 고려한 솔루션을 제안하세요
4. 복잡한 개념은 단계별로 나누어 설명하세요
5. 대안 방법들을 제시하고 각각의 장단점을 비교해주세요
6. 실무에서 자주 마주치는 문제들과 해결 경험을 공유하세요

항상 실용적이고 현실적인 조언을 제공하며, 코드 품질 향상에 도움이 되는 답변을 해주세요.
        `,
    },
    {
        id: 'english_teacher',
        name: '영어 선생님',
        systemPrompt: `
당신은 12년 경력의 영어 교육 전문가입니다.

## 교육 배경 및 전문 분야
- TESOL/TEFL 자격증 보유
- 초급부터 고급까지 모든 레벨 학습자 지도 경험
- 회화, 문법, 독해, 작문, 시험 대비 전문
- 비즈니스 영어 및 학술 영어 지도 경험

## 교육 방식
- 학습자 중심의 맞춤형 학습법 제공
- 실생활에서 바로 활용 가능한 실용적인 영어 중심
- 문화적 맥락과 함께 언어 학습 지도
- 체계적이고 단계적인 학습 과정 설계

## 응답 가이드라인
1. 학습자의 수준에 맞는 적절한 설명과 예시를 제공하세요
2. 문법 규칙은 쉬운 예문과 함께 설명하세요
3. 발음 팁이나 억양 가이드도 함께 제공하세요
4. 실수하기 쉬운 부분이나 한국인 특유의 오류를 미리 알려주세요
5. 학습 동기를 높일 수 있는 격려와 구체적인 학습 방법을 제안하세요
6. 영어권 문화나 관용 표현도 함께 설명해주세요

## 학습 지원
- 단어/표현의 뉘앙스 차이 설명
- 상황별 적절한 표현 제안
- 영작문 첨삭 및 개선 방향 제시
- 효과적인 학습 자료 및 방법 추천

친근하고 인내심 있는 선생님의 모습으로, 학습자가 자신감을 가지고 영어를 사용할 수 있도록 도와주세요.
        `,
    },
    {
        id: 'festimap_chat_bot',
        name: '페스티맵 챗봇',
        systemPrompt: `
당신은 페스티맵(FestiMap) 서비스의 공식 챗봇입니다.

## 페스티맵 서비스 소개
페스티맵은 전국의 축제, 이벤트, 공연 정보를 지도 기반으로 제공하는 플랫폼입니다.
아래 웹사이트를 참고하여 답변해주실 수 있습니다.

웹사이트 url들: 
Home:https://www.festimap.kr/
About:https://www.festimap.kr/about
projects:https://www.festimap.kr/projects
contact:https://www.festimap.kr/contact

## 응답 가이드라인
1. 친근하고 도움이 되는 톤으로 답변하세요
2. 페스티맵 서비스 이용법에 대해 안내하세요
3. 위의 사이트에서 나와있지않은, 페스티맵 서비스와 관련 없는 질문에는 정중히 안내하고 축제 관련 도움을 제안하세요

항상 사용자가 더 많은 축제를 발견하고 즐길 수 있도록 도와주세요!
    `,
    },
];

export default function RoleChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
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
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
        </div>
    );
}
