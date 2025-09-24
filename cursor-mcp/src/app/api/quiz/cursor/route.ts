import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Choice = {
    id: string;
    text: string;
};

type Question = {
    id: string;
    type: 'single';
    question: string;
    choices: Choice[];
    answer: string; // correct choice id
    source?: string;
};

const questions: Question[] = [
    {
        id: 'q1',
        type: 'single',
        question:
            'Cursor에서 코드 라인에 바로 수정 지시를 내리는 인라인 편집 단축키는?',
        choices: [
            { id: 'a', text: 'Cmd/Ctrl + I' },
            { id: 'b', text: 'Cmd/Ctrl + K' },
            { id: 'c', text: 'Cmd/Ctrl + P' },
            { id: 'd', text: 'Cmd/Ctrl + Shift + F' },
        ],
        answer: 'a',
        source: 'Cursor 공식 단축키 안내 및 사용자 문서',
    },
    {
        id: 'q2',
        type: 'single',
        question:
            '여러 파일에 걸친 대규모 리팩터링/생성을 계획하고 실행하는 Cursor 기능은?',
        choices: [
            { id: 'a', text: 'Composer' },
            { id: 'b', text: 'Inline Edit' },
            { id: 'c', text: 'Code Tour' },
            { id: 'd', text: 'Snippets' },
        ],
        answer: 'a',
        source: 'Cursor 소개 자료 (Composer)',
    },
    {
        id: 'q3',
        type: 'single',
        question: 'Cursor에서 빠르게 AI에게 질문/요청을 여는 기본 명령은?',
        choices: [
            { id: 'a', text: 'Cmd/Ctrl + B' },
            { id: 'b', text: 'Cmd/Ctrl + K' },
            { id: 'c', text: 'Cmd/Ctrl + D' },
            { id: 'd', text: 'Cmd/Ctrl + E' },
        ],
        answer: 'b',
        source: 'Cursor 기본 사용 가이드',
    },
    {
        id: 'q4',
        type: 'single',
        question:
            'Cursor가 특정 리포/폴더/파일에 대한 규칙을 적용하도록 하는 구성 파일 이름은?',
        choices: [
            { id: 'a', text: '.cursorconfig' },
            { id: 'b', text: '.cursorrules' },
            { id: 'c', text: '.cursorrc' },
            { id: 'd', text: 'cursor.config.json' },
        ],
        answer: 'b',
        source: '커뮤니티 베스트 프랙티스 (.cursorrules)',
    },
    {
        id: 'q5',
        type: 'single',
        question:
            '선택 영역(Selection)에 대해 바로 수정 지시를 내릴 때 가장 적합한 기능은?',
        choices: [
            { id: 'a', text: 'Inline Edit' },
            { id: 'b', text: 'Composer' },
            { id: 'c', text: 'Terminal' },
            { id: 'd', text: 'Search' },
        ],
        answer: 'a',
    },
    {
        id: 'q6',
        type: 'single',
        question:
            'Cursor의 에이전트가 테스트 실패 등 피드백을 기반으로 자동 수정/재시도를 수행하는 흐름은?',
        choices: [
            { id: 'a', text: 'Agent run & fix' },
            { id: 'b', text: 'Smart Compile' },
            { id: 'c', text: 'Auto Merge' },
            { id: 'd', text: 'Stage Preview' },
        ],
        answer: 'a',
    },
    {
        id: 'q7',
        type: 'single',
        question:
            'Git 커밋 메시지를 자연어 지시로 생성하도록 돕는 Cursor 기능은?',
        choices: [
            { id: 'a', text: 'AI Commit' },
            { id: 'b', text: 'AI Branch' },
            { id: 'c', text: 'AI Diff' },
            { id: 'd', text: 'AI PR' },
        ],
        answer: 'a',
    },
    {
        id: 'q8',
        type: 'single',
        question:
            '코드 자동완성 품질 향상을 위해 Cursor가 사용하는 핵심 기술은?',
        choices: [
            { id: 'a', text: '정적 규칙 기반 파서' },
            { id: 'b', text: 'LLM 기반 시맨틱 컴플리션' },
            { id: 'c', text: 'AST 전용 자동화 툴' },
            { id: 'd', text: '전통 N-gram 모델' },
        ],
        answer: 'b',
    },
];

export async function GET() {
    return NextResponse.json({
        topic: 'Cursor Quiz',
        total: questions.length,
        questions: questions.map(({ answer, ...rest }) => rest),
    });
}
