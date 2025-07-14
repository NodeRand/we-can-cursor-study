import React, { ReactNode } from 'react';

interface SocialLinkProps {
    href: string;
    children: ReactNode;
    icon?: ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, children, icon }) => (
    <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="relative flex items-center gap-1 px-2 py-1 rounded transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 group overflow-hidden"
    >
        {icon}
        <span className="relative z-10 font-medium group-hover:text-blue-700 dark:group-hover:text-purple-300 transition-colors duration-300">
            {children}
        </span>
        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
    </a>
);

export default SocialLink;
