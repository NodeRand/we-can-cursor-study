'use client';
import { ReactNode } from 'react';

interface MainContainerProps {
    children: ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => (
    <section className="flex-1 max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 min-h-[80vh] mx-auto flex flex-col">
        {children}
    </section>
);

export default MainContainer;
