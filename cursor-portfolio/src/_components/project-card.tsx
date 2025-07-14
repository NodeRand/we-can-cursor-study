import React from 'react';

interface ProjectCardProps {
    title: string;
    description: string;
    link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    description,
    link,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:to-purple-100/60 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
                {description}
            </p>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-blue-600 dark:text-blue-400 text-sm font-semibold mt-auto group overflow-hidden"
            >
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    자세히 보기
                </span>
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
        </div>
    );
};

export default ProjectCard;
