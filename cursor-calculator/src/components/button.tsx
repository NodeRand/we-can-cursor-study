'use client';

import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'default' | 'operator' | 'clear' | 'equal' | 'emotion';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className = '',
    variant = 'default',
    disabled = false,
    size = 'md',
}) => {
    const baseClasses =
        'font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = {
        sm: 'h-12 text-sm',
        md: 'h-14 text-lg',
        lg: 'h-16 text-xl',
    };

    const variantClasses = {
        default:
            'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300',
        operator:
            'bg-blue-500 hover:bg-blue-600 text-white border border-blue-600',
        clear: 'bg-red-500 hover:bg-red-600 text-white border border-red-600',
        equal: 'bg-green-500 hover:bg-green-600 text-white border border-green-600',
        emotion:
            'bg-purple-500 hover:bg-purple-600 text-white border border-purple-600',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
