import React from 'react';

interface TechBadgeProps {
    label: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ label }) => (
    <span className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:text-white hover:scale-110 cursor-pointer">
        {label}
    </span>
);

export default TechBadge;
