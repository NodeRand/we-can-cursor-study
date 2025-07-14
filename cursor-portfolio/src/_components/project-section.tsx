'use client';
import ProjectCard from './project-card';

const ProjectSection = () => (
    <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 mb-10 animate-fade-in-up delay-200">
        <h2 className="text-xl font-semibold mb-4 text-left">프로젝트</h2>
        <div className="grid gap-6 sm:grid-cols-2 justify-start">
            <ProjectCard
                title="포트폴리오 웹사이트"
                description="Next.js와 Tailwind CSS로 만든 반응형 포트폴리오 사이트입니다."
                link="#"
            />
            <ProjectCard
                title="ToDo 앱"
                description="React와 TypeScript로 제작한 간단한 할 일 관리 앱입니다."
                link="#"
            />
        </div>
    </div>
);

export default ProjectSection;
