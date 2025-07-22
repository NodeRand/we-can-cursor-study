import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const features = [
    {
        title: '기본 챗봇',
        description: '기본적인 GPT 대화 인터페이스를 제공합니다.',
        icon: '/globe.svg',
        href: '/chat/basic',
    },
    {
        title: '역할 기반 챗봇',
        description:
            '의사, 번역가, 코딩 도우미 등 특정 역할의 AI를 제공합니다.',
        icon: '/window.svg',
        href: '/chat/role',
    },
    {
        title: '블로그 글 생성',
        description: '키워드 기반으로 블로그 글을 자동으로 생성합니다.',
        icon: '/file.svg',
        href: '/generate/blog',
    },
    {
        title: 'JSON UI 챗봇',
        description:
            'OpenAI 응답을 JSON 포맷으로 받아 UI 컴포넌트로 렌더링합니다.',
        icon: '/window.svg',
        href: '/chat/json-ui',
    },
];

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
                AI 멀티 유틸리티 웹앱
            </h1>
            <p className="text-center text-gray-600 mb-12">
                OpenAI API를 활용한 다양한 AI 기능을 경험해보세요
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map(feature => (
                    <Link
                        key={feature.title}
                        href={feature.href}
                        className={cn(
                            'block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow',
                            'transform hover:-translate-y-1 transition-transform duration-200',
                            'cursor-pointer',
                        )}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <Image
                                src={feature.icon}
                                alt={feature.title}
                                width={40}
                                height={40}
                                className="text-primary-600"
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-center mb-2 text-gray-900">
                            {feature.title}
                        </h2>
                        <p className="text-gray-600 text-center">
                            {feature.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
