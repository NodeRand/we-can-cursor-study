'use client';
import { ReactNode } from 'react';

interface ProfileCardProps {
    children: ReactNode;
}

const ProfileCard = ({ children }: ProfileCardProps) => (
    <section className="bg-white border border-gray-300 rounded-2xl p-8 mb-8 shadow max-w-2xl mx-auto">
        {children}
    </section>
);

export default ProfileCard;
