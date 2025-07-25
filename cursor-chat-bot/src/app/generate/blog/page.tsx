'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleButton } from '@/components/ui/toggle-button';
import { BackButton } from '@/components/ui/back-button';
import {
    ChevronRight,
    ChevronLeft,
    FileText,
    Eye,
    Download,
    Copy,
    Sparkles,
    Target,
    Palette,
    Globe,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type BlogOptions = {
    length: 'short' | 'medium' | 'long';
    tone:
        | 'friendly'
        | 'professional'
        | 'casual'
        | 'authoritative'
        | 'conversational';
    audience: 'general' | 'beginners' | 'experts' | 'business' | 'students';
    contentType:
        | 'tutorial'
        | 'listicle'
        | 'guide'
        | 'review'
        | 'news'
        | 'opinion';
    seoFocus: boolean;
    includeImages: boolean;
};

type BlogResult = {
    title: string;
    content: string;
    metaDescription: string;
    tags: string[];
    keywords: string[];
    readingTime: number;
    seoScore: number;
};

type Step = 'topic' | 'options' | 'seo' | 'generate' | 'result';

export default function AdvancedBlogGenerator() {
    const [currentStep, setCurrentStep] = useState<Step>('topic');
    const [keyword, setKeyword] = useState('');
    const [targetKeywords, setTargetKeywords] = useState('');
    const [blogResult, setBlogResult] = useState<BlogResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [options, setOptions] = useState<BlogOptions>({
        length: 'medium',
        tone: 'professional',
        audience: 'general',
        contentType: 'guide',
        seoFocus: true,
        includeImages: false,
    });

    const steps = [
        { id: 'topic', title: '주제 설정', icon: FileText },
        { id: 'options', title: '콘텐츠 옵션', icon: Palette },
        { id: 'seo', title: 'SEO 설정', icon: Globe },
        { id: 'generate', title: '생성', icon: Sparkles },
        { id: 'result', title: '결과', icon: Eye },
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    // 로딩 진행률 시뮬레이션
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 95) return 95;
                    return Math.min(prev + Math.random() * 8, 95);
                });
            }, 500);
            return () => clearInterval(interval);
        } else {
            setLoadingProgress(0); // 로딩이 끝나면 진행률 초기화
        }
    }, [isLoading]);

    const handleNext = () => {
        const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
        setCurrentStep(steps[nextIndex].id as Step);
    };

    const handlePrev = () => {
        const prevIndex = Math.max(currentStepIndex - 1, 0);
        setCurrentStep(steps[prevIndex].id as Step);
    };

    const handleGenerate = async () => {
        if (!keyword.trim()) {
            alert('주제를 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            setLoadingProgress(0);
            setCurrentStep('generate');

            const response = await fetch('/api/generate/blog/advanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keyword,
                    targetKeywords,
                    options,
                }),
            });

            if (!response.ok) {
                throw new Error('API 요청에 실패했습니다.');
            }

            const data = await response.json();
            setLoadingProgress(100);
            setBlogResult(data);

            setTimeout(() => {
                setCurrentStep('result');
                setIsLoading(false);
                setLoadingProgress(0); // 완료 후 진행률 초기화
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            setIsLoading(false);
            setLoadingProgress(0); // 에러 시에도 진행률 초기화
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('클립보드에 복사되었습니다.');
    };

    const handleExport = (format: 'html' | 'markdown') => {
        if (!blogResult) return;

        let content = '';
        if (format === 'html') {
            content = `<!DOCTYPE html>
<html>
<head>
  <title>${blogResult.title}</title>
  <meta name="description" content="${blogResult.metaDescription}">
  <meta name="keywords" content="${blogResult.keywords.join(', ')}">
</head>
<body>
  <h1>${blogResult.title}</h1>
  ${blogResult.content.replace(/\n/g, '<br>')}
</body>
</html>`;
        } else {
            content = `# ${blogResult.title}

${blogResult.content}

---
**Tags:** ${blogResult.tags.join(', ')}
**Keywords:** ${blogResult.keywords.join(', ')}
**Reading Time:** ${blogResult.readingTime}분`;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-post.${format === 'html' ? 'html' : 'md'}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto max-w-6xl p-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pt-4">
                    <BackButton />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            고급 블로그 생성기
                        </h1>
                        <p className="text-gray-600">
                            프롬프트 엔지니어링과 SEO 최적화된 완성형 블로그
                            글을 생성하세요
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div
                                    key={step.id}
                                    className="flex items-center"
                                >
                                    <div
                                        className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                      ${
                          isActive
                              ? 'bg-primary-600 border-primary-600 text-white shadow-lg'
                              : isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                      }
                    `}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <div className="ml-3">
                                        <p
                                            className={`text-sm font-medium ${
                                                isActive
                                                    ? 'text-primary-600'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <ChevronRight
                                            className="mx-4 text-gray-300"
                                            size={20}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    {currentStep === 'topic' && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <FileText
                                    className="mx-auto mb-4 text-primary-600"
                                    size={48}
                                />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    블로그 주제를 설정하세요
                                </h2>
                                <p className="text-gray-600">
                                    어떤 주제의 블로그 글을 작성하고 싶으신가요?
                                </p>
                            </div>

                            <div className="max-w-2xl mx-auto space-y-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        주요 주제 또는 키워드
                                    </label>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={e =>
                                            setKeyword(e.target.value)
                                        }
                                        placeholder="예: 인공지능, 디지털 마케팅, 웹 개발 등"
                                        className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors text-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        타겟 키워드 (선택사항)
                                    </label>
                                    <input
                                        type="text"
                                        value={targetKeywords}
                                        onChange={e =>
                                            setTargetKeywords(e.target.value)
                                        }
                                        placeholder="예: SEO, 검색엔진최적화, 키워드 분석 (쉼표로 구분)"
                                        className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors text-gray-700"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        SEO 최적화를 위한 추가 키워드를
                                        입력하세요
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 'options' && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <Palette
                                    className="mx-auto mb-4 text-primary-600"
                                    size={48}
                                />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    콘텐츠 옵션을 선택하세요
                                </h2>
                                <p className="text-gray-600">
                                    원하는 글의 스타일과 형태를 설정해주세요
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-3">
                                            글 길이
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(
                                                [
                                                    'short',
                                                    'medium',
                                                    'long',
                                                ] as const
                                            ).map(length => (
                                                <ToggleButton
                                                    key={length}
                                                    isSelected={
                                                        options.length ===
                                                        length
                                                    }
                                                    onClick={() =>
                                                        setOptions(prev => ({
                                                            ...prev,
                                                            length,
                                                        }))
                                                    }
                                                    className="p-4"
                                                >
                                                    <div className="text-center">
                                                        <div className="font-medium">
                                                            {length ===
                                                                'short' &&
                                                                '짧게'}
                                                            {length ===
                                                                'medium' &&
                                                                '보통'}
                                                            {length ===
                                                                'long' &&
                                                                '길게'}
                                                        </div>
                                                        <div className="text-xs mt-1 opacity-75">
                                                            {length ===
                                                                'short' &&
                                                                '500-800자'}
                                                            {length ===
                                                                'medium' &&
                                                                '1200-2000자'}
                                                            {length ===
                                                                'long' &&
                                                                '2500자 이상'}
                                                        </div>
                                                    </div>
                                                </ToggleButton>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-3">
                                            글의 톤앤매너
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(
                                                [
                                                    'professional',
                                                    'friendly',
                                                    'conversational',
                                                    'authoritative',
                                                    'casual',
                                                ] as const
                                            ).map(tone => (
                                                <ToggleButton
                                                    key={tone}
                                                    isSelected={
                                                        options.tone === tone
                                                    }
                                                    onClick={() =>
                                                        setOptions(prev => ({
                                                            ...prev,
                                                            tone,
                                                        }))
                                                    }
                                                    className="p-3 text-sm"
                                                >
                                                    {tone === 'professional' &&
                                                        '전문적'}
                                                    {tone === 'friendly' &&
                                                        '친근함'}
                                                    {tone ===
                                                        'conversational' &&
                                                        '대화체'}
                                                    {tone === 'authoritative' &&
                                                        '권위있게'}
                                                    {tone === 'casual' &&
                                                        '캐주얼'}
                                                </ToggleButton>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-3">
                                            타겟 독자
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(
                                                [
                                                    'general',
                                                    'beginners',
                                                    'experts',
                                                    'business',
                                                    'students',
                                                ] as const
                                            ).map(audience => (
                                                <ToggleButton
                                                    key={audience}
                                                    isSelected={
                                                        options.audience ===
                                                        audience
                                                    }
                                                    onClick={() =>
                                                        setOptions(prev => ({
                                                            ...prev,
                                                            audience,
                                                        }))
                                                    }
                                                    className="p-3 text-sm"
                                                >
                                                    {audience === 'general' &&
                                                        '일반인'}
                                                    {audience === 'beginners' &&
                                                        '초보자'}
                                                    {audience === 'experts' &&
                                                        '전문가'}
                                                    {audience === 'business' &&
                                                        '비즈니스'}
                                                    {audience === 'students' &&
                                                        '학생'}
                                                </ToggleButton>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-3">
                                            콘텐츠 형태
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(
                                                [
                                                    'guide',
                                                    'tutorial',
                                                    'listicle',
                                                    'review',
                                                    'news',
                                                    'opinion',
                                                ] as const
                                            ).map(type => (
                                                <ToggleButton
                                                    key={type}
                                                    isSelected={
                                                        options.contentType ===
                                                        type
                                                    }
                                                    onClick={() =>
                                                        setOptions(prev => ({
                                                            ...prev,
                                                            contentType: type,
                                                        }))
                                                    }
                                                    className="p-3 text-sm"
                                                >
                                                    {type === 'guide' &&
                                                        '가이드'}
                                                    {type === 'tutorial' &&
                                                        '튜토리얼'}
                                                    {type === 'listicle' &&
                                                        '리스트형'}
                                                    {type === 'review' &&
                                                        '리뷰'}
                                                    {type === 'news' && '뉴스'}
                                                    {type === 'opinion' &&
                                                        '의견'}
                                                </ToggleButton>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    SEO 최적화
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    검색엔진 최적화 적용
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setOptions(prev => ({
                                                        ...prev,
                                                        seoFocus:
                                                            !prev.seoFocus,
                                                    }))
                                                }
                                                className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${options.seoFocus ? 'bg-primary-600' : 'bg-gray-300'}
                        `}
                                            >
                                                <span
                                                    className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${
                                options.seoFocus
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                            }
                          `}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    이미지 제안
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    이미지 설명 포함
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setOptions(prev => ({
                                                        ...prev,
                                                        includeImages:
                                                            !prev.includeImages,
                                                    }))
                                                }
                                                className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${
                              options.includeImages
                                  ? 'bg-primary-600'
                                  : 'bg-gray-300'
                          }
                        `}
                                            >
                                                <span
                                                    className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${
                                options.includeImages
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                            }
                          `}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 'seo' && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <Globe
                                    className="mx-auto mb-4 text-primary-600"
                                    size={48}
                                />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    SEO 설정을 확인하세요
                                </h2>
                                <p className="text-gray-600">
                                    검색엔진 최적화를 위한 설정을 검토해주세요
                                </p>
                            </div>

                            <div className="max-w-3xl mx-auto">
                                <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-xl mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        SEO 미리보기
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                주요 키워드
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {keyword ||
                                                    '키워드를 입력해주세요'}
                                            </p>
                                        </div>
                                        {targetKeywords && (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    타겟 키워드
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {targetKeywords
                                                        .split(',')
                                                        .map((kw, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                                            >
                                                                {kw.trim()}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                콘텐츠 타입
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {options.contentType ===
                                                    'guide' && '가이드'}
                                                {options.contentType ===
                                                    'tutorial' && '튜토리얼'}
                                                {options.contentType ===
                                                    'listicle' && '리스트형 글'}
                                                {options.contentType ===
                                                    'review' && '리뷰'}
                                                {options.contentType ===
                                                    'news' && '뉴스'}
                                                {options.contentType ===
                                                    'opinion' && '의견글'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 border-2 border-gray-200 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            포함될 SEO 요소
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                메타 제목 및 설명
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                키워드 최적화
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                구조화된 헤딩
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                읽기 시간 계산
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                태그 자동 생성
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-6 border-2 border-gray-200 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            예상 결과
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary-600" />
                                                검색 친화적 제목
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary-600" />
                                                최적화된 메타 설명
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary-600" />
                                                관련 키워드 자연스럽게 배치
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary-600" />
                                                적절한 글 구조
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary-600" />
                                                SEO 점수 제공
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 'generate' && (
                        <div className="text-center py-16">
                            <Sparkles
                                className="mx-auto mb-6 text-primary-600 animate-pulse"
                                size={64}
                            />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {isLoading
                                    ? '고품질 블로그 글을 생성 중입니다...'
                                    : '생성 준비 완료'}
                            </h2>
                            <p className="text-gray-600 mb-8">
                                {isLoading
                                    ? '프롬프트 엔지니어링과 SEO 최적화를 적용하고 있습니다'
                                    : '모든 설정이 완료되었습니다. 생성을 시작하세요!'}
                            </p>

                            {isLoading && (
                                <div className="max-w-md mx-auto mb-8">
                                    <div className="bg-gray-200 rounded-full h-3 mb-2">
                                        <div
                                            className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${loadingProgress}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {Math.round(loadingProgress)}% 완료
                                    </p>
                                </div>
                            )}

                            {!isLoading && (
                                <Button
                                    onClick={handleGenerate}
                                    size="lg"
                                    className="px-12 py-4 text-lg bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
                                >
                                    <Sparkles className="mr-2" size={20} />
                                    고급 블로그 글 생성하기
                                </Button>
                            )}
                        </div>
                    )}

                    {currentStep === 'result' && blogResult && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <Eye
                                    className="mx-auto mb-4 text-green-600"
                                    size={48}
                                />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    생성 완료!
                                </h2>
                                <p className="text-gray-600">
                                    SEO 최적화된 완성형 블로그 글이
                                    준비되었습니다
                                </p>
                            </div>

                            {/* SEO 정보 */}
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                        {blogResult.seoScore}%
                                    </div>
                                    <div className="text-sm text-green-700">
                                        SEO 점수
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                        {blogResult.readingTime}분
                                    </div>
                                    <div className="text-sm text-blue-700">
                                        예상 읽기 시간
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">
                                        {blogResult.keywords.length}
                                    </div>
                                    <div className="text-sm text-purple-700">
                                        최적화 키워드
                                    </div>
                                </div>
                            </div>

                            {/* 제목 */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        제목
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleCopy(blogResult.title)
                                        }
                                    >
                                        <Copy size={16} className="mr-1" />
                                        복사
                                    </Button>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {blogResult.title}
                                </h1>
                            </div>

                            {/* 메타 설명 */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        메타 설명
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleCopy(
                                                blogResult.metaDescription,
                                            )
                                        }
                                    >
                                        <Copy size={16} className="mr-1" />
                                        복사
                                    </Button>
                                </div>
                                <p className="text-gray-700">
                                    {blogResult.metaDescription}
                                </p>
                            </div>

                            {/* 키워드 & 태그 */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        최적화 키워드
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {blogResult.keywords.map(
                                            (keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                                >
                                                    {keyword}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        태그
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {blogResult.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 본문 */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        본문
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleCopy(blogResult.content)
                                            }
                                        >
                                            <Copy size={16} className="mr-1" />
                                            복사
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleExport('markdown')
                                            }
                                        >
                                            <Download
                                                size={16}
                                                className="mr-1"
                                            />
                                            MD
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleExport('html')}
                                        >
                                            <Download
                                                size={16}
                                                className="mr-1"
                                            />
                                            HTML
                                        </Button>
                                    </div>
                                </div>
                                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-table:text-sm">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // 체크박스 스타일링
                                            input: ({ ...props }) => (
                                                <input
                                                    {...props}
                                                    className="mr-2 accent-primary-600"
                                                />
                                            ),
                                            // 테이블 스타일링
                                            table: ({ ...props }) => (
                                                <div className="overflow-x-auto">
                                                    <table
                                                        {...props}
                                                        className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg"
                                                    />
                                                </div>
                                            ),
                                            th: ({ ...props }) => (
                                                <th
                                                    {...props}
                                                    className="px-4 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900 border-b border-gray-200"
                                                />
                                            ),
                                            td: ({ ...props }) => (
                                                <td
                                                    {...props}
                                                    className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100"
                                                />
                                            ),
                                            // 코드 블록 스타일링
                                            pre: ({ ...props }) => (
                                                <pre
                                                    {...props}
                                                    className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"
                                                />
                                            ),
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            code: (props: any) => (
                                                <code
                                                    {...props}
                                                    className={
                                                        props.inline
                                                            ? 'bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded text-sm font-mono'
                                                            : 'text-gray-100'
                                                    }
                                                />
                                            ),
                                            // 인용구 스타일링
                                            blockquote: ({ ...props }) => (
                                                <blockquote
                                                    {...props}
                                                    className="border-l-4 border-primary-500 bg-primary-50 pl-4 py-2 my-4 italic text-gray-700"
                                                />
                                            ),
                                            // 링크 스타일링
                                            a: ({ ...props }) => (
                                                <a
                                                    {...props}
                                                    className="text-primary-600 hover:text-primary-700 underline"
                                                />
                                            ),
                                            // 리스트 스타일링
                                            ul: ({ ...props }) => (
                                                <ul
                                                    {...props}
                                                    className="space-y-2"
                                                />
                                            ),
                                            ol: ({ ...props }) => (
                                                <ol
                                                    {...props}
                                                    className="space-y-2"
                                                />
                                            ),
                                            li: ({ ...props }) => (
                                                <li
                                                    {...props}
                                                    className="text-gray-700"
                                                />
                                            ),
                                        }}
                                    >
                                        {blogResult.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                {currentStep !== 'generate' && (
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentStepIndex === 0}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft size={20} />
                            이전
                        </Button>

                        <div className="flex gap-4">
                            {currentStep === 'seo' && (
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!keyword.trim()}
                                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
                                >
                                    <Sparkles size={20} />
                                    생성하기
                                </Button>
                            )}

                            {currentStep !== 'result' &&
                                currentStep !== 'seo' && (
                                    <Button
                                        onClick={handleNext}
                                        disabled={
                                            currentStep === 'topic' &&
                                            !keyword.trim()
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        다음
                                        <ChevronRight size={20} />
                                    </Button>
                                )}

                            {currentStep === 'result' && (
                                <Button
                                    onClick={() => {
                                        setCurrentStep('topic');
                                        setBlogResult(null);
                                        setKeyword('');
                                        setTargetKeywords('');
                                        setLoadingProgress(0); // 새 글 작성 시 진행률 초기화
                                    }}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    새 글 작성
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
