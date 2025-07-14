'use client';
import { ReactNode } from 'react';

interface SidebarSectionProps {
    children: ReactNode;
}

const SidebarSection = ({ children }: SidebarSectionProps) => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4">
        {children}
    </div>
);

export default SidebarSection;
