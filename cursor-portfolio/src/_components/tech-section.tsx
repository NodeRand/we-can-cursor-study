'use client';
import TechBadge from './tech-badge';

const TechSection = () => (
    <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 mb-10 animate-fade-in-up delay-100">
        <h2 className="text-xl font-semibold mb-4 text-left">기술 스택</h2>
        <div className="flex flex-wrap gap-4 justify-start">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS'].map(
                tech => (
                    <TechBadge key={tech} label={tech} />
                ),
            )}
        </div>
    </div>
);

export default TechSection;
