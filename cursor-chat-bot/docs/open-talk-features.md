물론입니다!
다음은 Next.js 15 기반으로 OpenAI API를 활용한 웹앱 제작을 위한 **기능 상세 명세서**입니다. 각 단계별 기능을 분리하여, 홈 화면과 각 개별 기능 페이지로 구성하며 점차 기능을 확장하는 구조입니다.

---

# 📘 기능 상세 명세서 – AI 멀티 유틸리티 웹앱

## 🏗️ 전체 아키텍처 개요

-   **기반 프레임워크**: Next.js 15 (App Router 기반)
-   **언어/기술**: TypeScript, Tailwind CSS, OpenAI API
-   **인증**: (필요 시) 기본 사용자 인증 추가 예정
-   **환경 구성**:

    -   `.env` 파일에 OpenAI API Key 저장
    -   Edge 또는 App Route 기반 API 핸들러 구성

---

## 🖥️ 공통 기능

### 1. 홈 화면 (기능 진입 카드 UI)

-   경로: `/`
-   설명: 사용 가능한 기능 목록을 카드 형태로 나열
-   구성 요소:

    -   각 기능에 대한 설명과 미리보기 이미지 또는 아이콘
    -   클릭 시 해당 기능 페이지로 이동

-   UI 요소:

    -   `<Card>` 컴포넌트
    -   Tailwind 기반 그리드 레이아웃

---

## 💬 기능 1: 챗봇 만들기 기본

### 경로: `/chat/basic`

### 설명: 기본적인 GPT 대화 인터페이스 제공

#### 🔧 기능 명세

-   사용자 입력 필드
-   GPT 응답 출력창
-   입력 후 자동 스크롤
-   대화 기록 로컬 스토리지 저장 (선택)
-   리셋 버튼

#### 📡 기술 명세

-   POST `/api/chat/basic`
-   OpenAI Chat API (`gpt-3.5-turbo`)
-   System Prompt: 없음 또는 "You are a helpful assistant."

---

## 🧑‍🚀 기능 2: 역할 기반 챗봇 (특정 역할의 AI)

### 경로: `/chat/role`

### 설명: 의사, 번역가, 코딩 도우미 등 특정 역할의 AI 제공

#### 🔧 기능 명세

-   역할 선택 드롭다운

    -   예: 의사, 개발자, 영어 선생님, 심리 상담사

-   선택된 역할에 따른 프롬프트 커스터마이징
-   사용자 입력 → 역할 기반 응답 출력
-   역할 별 system prompt 세팅

#### 📡 기술 명세

-   POST `/api/chat/role`
-   OpenAI Chat API 사용
-   System Prompt: 선택된 역할에 맞는 프롬프트 세팅

---

## 📝 기능 3: 블로그 글 써주는 AI

### 경로: `/generate/blog`

### 설명: 키워드 기반 블로그 글 자동 생성

#### 🔧 기능 명세

-   사용자 입력:

    -   키워드 입력
    -   글 길이 선택 (짧게, 보통, 길게)
    -   말투 선택 (친근하게, 전문가답게 등)

-   결과:

    -   제목 + 본문 출력
    -   복사 버튼

-   향후 기능:

    -   Markdown으로 변환
    -   블로그 플랫폼 내보내기 (예: Velog, Tistory API 연동)

#### 📡 기술 명세

-   POST `/api/generate/blog`
-   Prompt Template 구성: `${keyword}에 대해 ${tone} 말투로 ${length} 정도의 블로그 글`

---

## 📦 기능 4: JSON 응답 기반 UI 챗봇

### 경로: `/chat/json-ui`

### 설명: OpenAI 응답을 JSON 포맷으로 받아 UI 컴포넌트로 렌더링

#### 🔧 기능 명세

-   입력: 사용자가 원하는 정보 요청
-   출력: OpenAI 응답을 미리 정의된 JSON 포맷으로 수신
-   프론트엔드에서 JSON을 파싱하여 구성 요소로 렌더링

#### 예시

```json
{
  "type": "faq",
  "title": "AI 서비스 관련 FAQ",
  "items": [
    {
      "question": "이 서비스는 무엇인가요?",
      "answer": "OpenAI API를 기반으로 대화형 AI 기능을 제공합니다."
    },
    ...
  ]
}
```

#### 📡 기술 명세

-   POST `/api/chat/json-ui`
-   GPT 응답에 대해 JSON schema 강제 프롬프트 사용 (e.g., "You must respond in the following JSON format...")

---

## 🔐 (옵션) 사용자 인증 기능

### 경로: `/login`, `/signup`, `/dashboard`

### 설명: 기능 보호를 위한 로그인/회원가입 기능

#### 🔧 기능 명세

-   이메일/비밀번호 기반 인증
-   로그인 후 JWT 세션 유지
-   보호된 라우트 접근 제한

---

## 🧪 테스트 및 QA 항목

| 기능         | 테스트 항목                                | 상태 |
| ------------ | ------------------------------------------ | ---- |
| 홈 화면      | 각 카드 클릭 시 기능 진입 여부 확인        | ✅   |
| 챗봇         | 질문/응답 정상 출력 여부                   | ✅   |
| 역할 기반 AI | 역할 선택에 따라 응답 다르게 나오는지 확인 | ⬜   |
| 블로그 생성  | 키워드에 맞는 글 생성 여부                 | ⬜   |
| JSON → UI    | JSON 파싱 후 컴포넌트 렌더링 확인          | ⬜   |

---

## 📁 폴더 구조 예시

```bash
app/
  ├─ page.tsx              # 홈화면
  ├─ chat/
  │   ├─ basic/page.tsx
  │   ├─ role/page.tsx
  │   └─ json-ui/page.tsx
  ├─ generate/
  │   └─ blog/page.tsx
  └─ api/
      ├─ chat/
      │   ├─ basic/route.ts
      │   ├─ role/route.ts
      │   └─ json-ui/route.ts
      └─ generate/
          └─ blog/route.ts
```

---

## 🚀 향후 확장 아이디어

-   음성 입력/출력 기능 추가 (Web Speech API)
-   이미지 기반 프롬프트 (DALL·E)
-   사용자 저장 공간 및 기록 보기
-   템플릿 저장 기능 (글 생성 템플릿, 상담 템플릿 등)

---

필요하시면 위 명세서를 Notion용 마크다운, PDF 문서용으로 변환하거나, GitHub README 구조에 맞춰 정리해드릴 수도 있습니다.
다음으로 구현하고 싶은 단계나 기술 스택 세부 설정이 있다면 말씀해주세요! 😊
