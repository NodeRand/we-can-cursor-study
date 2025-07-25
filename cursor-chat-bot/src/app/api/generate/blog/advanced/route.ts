import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 길이별 상세 가이드라인
const getLengthPrompt = (length: string) => {
    switch (length) {
        case 'short':
            return {
                wordCount: '500-800자',
                structure: '간결하고 핵심적인 내용으로 구성',
                sections: '도입 - 핵심 내용 - 결론 (3단계)',
                depth: '핵심 포인트를 명확하게 전달',
            };
        case 'medium':
            return {
                wordCount: '1200-2000자',
                structure: '체계적이고 균형잡힌 구성',
                sections: '도입 - 주요 내용 (2-3개 섹션) - 실용적 팁 - 결론',
                depth: '적절한 설명과 예시를 포함',
            };
        case 'long':
            return {
                wordCount: '2500자 이상',
                structure: '포괄적이고 상세한 가이드',
                sections:
                    '도입 - 배경 설명 - 상세 내용 (4-5개 섹션) - 실무 적용 - 결론',
                depth: '깊이 있는 분석과 다양한 관점 제시',
            };
        default:
            return getLengthPrompt('medium');
    }
};

// 톤앤매너별 가이드라인
const getTonePrompt = (tone: string) => {
    switch (tone) {
        case 'professional':
            return {
                style: '전문적이고 신뢰할 수 있는 어조',
                language: '정확한 전문 용어 사용, 객관적 서술',
                approach: '데이터와 사실 기반의 논리적 전개',
            };
        case 'friendly':
            return {
                style: '친근하고 따뜻한 어조',
                language: '쉬운 표현, 공감적 언어 사용',
                approach: '독자와의 공감대 형성, 개인적 경험 포함',
            };
        case 'conversational':
            return {
                style: '대화하듯 자연스러운 어조',
                language: '일상적 표현, 질문형 문장 활용',
                approach: '독자에게 직접 말하는 듯한 친밀한 접근',
            };
        case 'authoritative':
            return {
                style: '권위있고 확신에 찬 어조',
                language: '단정적 표현, 전문성 강조',
                approach: '명확한 주장과 근거 제시',
            };
        case 'casual':
            return {
                style: '편안하고 자유로운 어조',
                language: '구어체 표현, 유머 포함 가능',
                approach: '부담없는 정보 전달',
            };
        default:
            return getTonePrompt('professional');
    }
};

// 타겟 독자별 가이드라인
const getAudiencePrompt = (audience: string) => {
    switch (audience) {
        case 'beginners':
            return {
                level: '기초 수준',
                explanation: '전문 용어는 쉽게 설명, 단계별 가이드 제공',
                examples: '구체적이고 이해하기 쉬운 예시 활용',
            };
        case 'experts':
            return {
                level: '전문가 수준',
                explanation: '고급 개념과 심화 내용 포함',
                examples: '업계 사례와 최신 트렌드 반영',
            };
        case 'business':
            return {
                level: '비즈니스 관점',
                explanation: 'ROI, 비용효율성, 실용성 중심',
                examples: '비즈니스 성과와 연결된 사례',
            };
        case 'students':
            return {
                level: '학습자 수준',
                explanation: '교육적 접근, 이론과 실습 균형',
                examples: '학습에 도움되는 체계적 예시',
            };
        case 'general':
        default:
            return {
                level: '일반 대중',
                explanation: '누구나 이해할 수 있는 수준',
                examples: '일상생활과 연관된 친숙한 예시',
            };
    }
};

// 콘텐츠 타입별 구조
const getContentTypePrompt = (contentType: string) => {
    switch (contentType) {
        case 'tutorial':
            return {
                structure: '단계별 튜토리얼 형식',
                format: '1단계, 2단계... 순서대로 진행',
                elements: '준비물, 과정, 결과 확인, 문제해결 팁',
            };
        case 'listicle':
            return {
                structure: '번호가 있는 리스트 형식',
                format: '1. 첫 번째 항목, 2. 두 번째 항목...',
                elements: '각 항목별 상세 설명과 실용적 팁',
            };
        case 'guide':
            return {
                structure: '포괄적 가이드 형식',
                format: '개요 - 상세 내용 - 실무 적용',
                elements: '배경 지식, 핵심 내용, 실행 방법, 주의사항',
            };
        case 'review':
            return {
                structure: '분석적 리뷰 형식',
                format: '개요 - 장단점 분석 - 총평',
                elements: '객관적 평가, 비교 분석, 추천 여부',
            };
        case 'news':
            return {
                structure: '뉴스 기사 형식',
                format: '요약 - 상세 내용 - 영향 분석',
                elements: '최신 정보, 배경 설명, 전망',
            };
        case 'opinion':
            return {
                structure: '의견 제시 형식',
                format: '문제 제기 - 논증 - 결론',
                elements: '개인적 견해, 근거 제시, 반박 예상 답변',
            };
        default:
            return getContentTypePrompt('guide');
    }
};

// SEO 키워드 밀도 계산
const calculateKeywordDensity = (
    content: string,
    keywords: string[],
): number => {
    const totalWords = content.split(/\s+/).length;
    let keywordCount = 0;

    keywords.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = content.toLowerCase().match(regex);
        keywordCount += matches ? matches.length : 0;
    });

    return Math.round((keywordCount / totalWords) * 100 * 10) / 10;
};

// 읽기 시간 계산 (한국어 기준: 분당 200-250자)
const calculateReadingTime = (content: string): number => {
    const charCount = content.length;
    return Math.ceil(charCount / 225); // 분당 225자 기준
};

// SEO 점수 계산
const calculateSEOScore = (
    title: string,
    content: string,
    metaDescription: string,
    keywords: string[],
): number => {
    let score = 0;

    // 제목 길이 (30-60자 권장)
    if (title.length >= 30 && title.length <= 60) score += 15;
    else if (title.length >= 20 && title.length <= 70) score += 10;
    else score += 5;

    // 메타 설명 길이 (120-160자 권장)
    if (metaDescription.length >= 120 && metaDescription.length <= 160)
        score += 15;
    else if (metaDescription.length >= 100 && metaDescription.length <= 180)
        score += 10;
    else score += 5;

    // 키워드 밀도 (1-3% 권장)
    const keywordDensity = calculateKeywordDensity(content, keywords);
    if (keywordDensity >= 1 && keywordDensity <= 3) score += 20;
    else if (keywordDensity >= 0.5 && keywordDensity <= 4) score += 15;
    else score += 5;

    // 콘텐츠 길이 (300자 이상 권장)
    if (content.length >= 1000) score += 15;
    else if (content.length >= 500) score += 10;
    else score += 5;

    // 헤딩 구조 (H1, H2, H3 등 사용)
    const headingCount = (content.match(/^#{1,6}\s/gm) || []).length;
    if (headingCount >= 3) score += 15;
    else if (headingCount >= 2) score += 10;
    else score += 5;

    // 키워드가 제목에 포함되어 있는지
    const titleContainsKeyword = keywords.some(keyword =>
        title.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (titleContainsKeyword) score += 20;
    else score += 10;

    return Math.min(score, 100); // 최대 100점
};

// 관련 태그 생성
const generateTags = (
    keyword: string,
    targetKeywords: string[],
    contentType: string,
): string[] => {
    const tags = [keyword];

    // 타겟 키워드 추가
    if (targetKeywords.length > 0) {
        targetKeywords.forEach(kw => tags.push(kw.trim()));
    }

    // 콘텐츠 타입별 태그 추가
    const typeBasedTags: { [key: string]: string[] } = {
        tutorial: ['튜토리얼', '가이드', '방법'],
        listicle: ['리스트', '정리', '추천'],
        guide: ['가이드', '완벽가이드', '종합'],
        review: ['리뷰', '분석', '평가'],
        news: ['뉴스', '최신', '동향'],
        opinion: ['의견', '생각', '관점'],
    };

    if (typeBasedTags[contentType]) {
        tags.push(...typeBasedTags[contentType]);
    }

    // 중복 제거 및 최대 8개까지
    return [...new Set(tags)].slice(0, 8);
};

export async function POST(request: Request) {
    try {
        const { keyword, targetKeywords, options } = await request.json();

        if (!keyword) {
            return NextResponse.json(
                { error: '키워드가 필요합니다.' },
                { status: 400 },
            );
        }

        // 옵션별 가이드라인 생성
        const lengthGuide = getLengthPrompt(options.length);
        const toneGuide = getTonePrompt(options.tone);
        const audienceGuide = getAudiencePrompt(options.audience);
        const contentTypeGuide = getContentTypePrompt(options.contentType);

        // 타겟 키워드 처리
        const targetKeywordsList = targetKeywords
            ? targetKeywords
                  .split(',')
                  .map((kw: string) => kw.trim())
                  .filter((kw: string) => kw)
            : [];

        const allKeywords = [keyword, ...targetKeywordsList];

        // 고급 프롬프트 엔지니어링 적용
        const systemPrompt = `당신은 SEO 전문가이자 프로페셔널 콘텐츠 작가입니다. 
다음 조건에 맞는 완성형 블로그 글을 **마크다운 형식**으로 작성해주세요.

## 📊 콘텐츠 사양
- **길이**: ${lengthGuide.wordCount} (${lengthGuide.structure})
- **구조**: ${lengthGuide.sections}
- **깊이**: ${lengthGuide.depth}

## 🎯 톤앤매너
- **스타일**: ${toneGuide.style}
- **언어**: ${toneGuide.language}
- **접근법**: ${toneGuide.approach}

## 👥 타겟 독자
- **수준**: ${audienceGuide.level}
- **설명 방식**: ${audienceGuide.explanation}
- **예시 스타일**: ${audienceGuide.examples}

## 📝 콘텐츠 형태
- **구조**: ${contentTypeGuide.structure}
- **형식**: ${contentTypeGuide.format}
- **포함 요소**: ${contentTypeGuide.elements}

## 🔍 SEO 최적화 요구사항
${
    options.seoFocus
        ? `
- 주요 키워드 "${keyword}"를 자연스럽게 1-3% 밀도로 배치
- 타겟 키워드들 (${targetKeywordsList.join(', ')})을 적절히 활용
- 검색 친화적인 제목 작성 (30-60자)
- 메타 설명용 요약문 작성 (120-160자)
- H1, H2, H3 헤딩 구조 활용
- 롱테일 키워드 자연스럽게 포함
`
        : ''
}

## 📷 이미지 가이드
${
    options.includeImages
        ? `
- 적절한 위치에 [이미지: 설명] 형태로 이미지 제안
- 이미지 alt 텍스트 SEO 최적화
`
        : ''
}

## 📝 **마크다운 형식 필수 요구사항**
본문 content는 반드시 다음 마크다운 요소들을 적극 활용하여 작성해주세요:

### 1. **헤딩 구조** (필수)
- # 메인 제목 (H1) - 1개
- ## 주요 섹션 (H2) - 3-5개
- ### 하위 섹션 (H3) - 필요시 사용

### 2. **텍스트 강조** (적극 활용)
- **굵은 글씨**: 중요한 키워드나 핵심 내용
- *기울임체*: 강조하고 싶은 부분
- \`인라인 코드\`: 기술 용어나 특별한 단어
- ~~취소선~~: 잘못된 정보나 대비 효과

### 3. **리스트** (필수 포함)
- 순서 있는 리스트 (1. 2. 3...)
- 순서 없는 리스트 (- 또는 *)
- 체크리스트 (- [ ] 또는 - [x])

### 4. **인용구** (적절히 사용)
- > 중요한 인용문이나 핵심 메시지
- > 전문가 의견이나 통계 데이터

### 5. **테이블** (데이터가 있을 때 필수)
| 항목 | 설명 | 비고 |
|------|------|------|
| 예시 | 내용 | 참고 |

### 6. **코드 블록** (기술 내용시)
\`\`\`
예시 코드나 명령어
\`\`\`

### 7. **구분선** (섹션 구분시)
---

### 8. **링크와 이미지**
- [링크 텍스트](URL)
- ![이미지 설명](이미지URL)

## 📋 응답 형식
다음 JSON 형식으로 응답해주세요:

{
  "title": "SEO 최적화된 매력적인 제목",
  "content": "완성된 블로그 글 본문 (위 마크다운 요소들을 적극 활용한 형식)",
  "metaDescription": "검색 결과에 표시될 요약 설명",
  "keywords": ["추출된", "주요", "키워드", "목록"],
  "tags": ["관련", "태그", "목록"],
  "readingTime": 예상_읽기_시간_분,
  "seoScore": SEO_점수_퍼센트
}

## ✅ 품질 기준
1. **마크다운 형식 완벽 적용** - 위의 8가지 요소 적극 활용
2. 독창적이고 가치있는 정보 제공
3. 실용적이고 실행 가능한 내용
4. 논리적이고 체계적인 구성
5. 독자의 관심을 끄는 매력적인 문체
6. 검색엔진 최적화 완벽 적용
7. 시각적으로 읽기 쉬운 구조

## 🎨 **콘텐츠 예시 구조**
\`\`\`markdown
# 메인 제목

> 핵심 메시지나 인용구

## 개요

**중요한 키워드**와 *강조할 내용*을 포함한 소개글...

## 주요 내용 1

### 세부 사항
- 항목 1
- 항목 2
- 항목 3

| 비교항목 | A | B |
|---------|---|---|
| 특징1   | 내용 | 내용 |

## 주요 내용 2

1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계

### 체크리스트
- [x] 완료된 항목
- [ ] 해야 할 항목

---

## 결론

> 마무리 메시지
\`\`\`

이제 "${keyword}" 주제로 위 마크다운 형식을 완벽히 적용한 완성형 블로그 글을 작성해주세요.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: `주제: "${keyword}"${
                        targetKeywordsList.length > 0
                            ? `\n타겟 키워드: ${targetKeywordsList.join(', ')}`
                            : ''
                    }`,
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 4000,
        });

        const responseText = completion.choices[0]?.message?.content || '{}';

        try {
            const parsedResponse = JSON.parse(responseText);

            // 응답 데이터 검증 및 보완
            const title =
                parsedResponse.title || `${keyword}에 대한 완벽 가이드`;
            const content =
                parsedResponse.content || '콘텐츠를 생성할 수 없습니다.';
            const metaDescription =
                parsedResponse.metaDescription ||
                `${keyword}에 대해 알아야 할 모든 것을 상세히 설명합니다. 전문가의 노하우와 실용적인 팁을 확인하세요.`;

            // 키워드 자동 추출 (응답에 없는 경우)
            let keywords = parsedResponse.keywords || [];
            if (keywords.length === 0) {
                keywords = allKeywords.slice(0, 5);
            }

            // 태그 생성 (응답에 없는 경우)
            let tags = parsedResponse.tags || [];
            if (tags.length === 0) {
                tags = generateTags(
                    keyword,
                    targetKeywordsList,
                    options.contentType,
                );
            }

            // 읽기 시간 계산
            const readingTime =
                parsedResponse.readingTime || calculateReadingTime(content);

            // SEO 점수 계산
            const seoScore =
                parsedResponse.seoScore ||
                calculateSEOScore(title, content, metaDescription, keywords);

            const result = {
                title,
                content,
                metaDescription,
                keywords: keywords.slice(0, 10), // 최대 10개
                tags: tags.slice(0, 8), // 최대 8개
                readingTime,
                seoScore,
            };

            return NextResponse.json(result);
        } catch (parseError) {
            console.error('JSON 파싱 오류:', parseError);

            // JSON 파싱 실패 시 폴백 응답
            const fallbackResult = {
                title: `${keyword}에 대한 완벽 가이드`,
                content: responseText, // 원본 텍스트 반환
                metaDescription: `${keyword}에 대해 알아야 할 모든 것을 상세히 설명합니다.`,
                keywords: allKeywords.slice(0, 5),
                tags: generateTags(
                    keyword,
                    targetKeywordsList,
                    options.contentType,
                ),
                readingTime: calculateReadingTime(responseText),
                seoScore: 75,
            };

            return NextResponse.json(fallbackResult);
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}
