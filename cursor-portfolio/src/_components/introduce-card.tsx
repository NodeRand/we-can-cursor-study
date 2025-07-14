'use client';
import { ReactNode } from 'react';

interface IntroduceCardProps {
    children: ReactNode;
}

const IntroduceCard = ({ children }: IntroduceCardProps) => (
    <section className="bg-white border border-gray-300 rounded-2xl p-6 mb-8 shadow max-w-2xl mx-auto">
        {children}
    </section>
);

export default IntroduceCard;
