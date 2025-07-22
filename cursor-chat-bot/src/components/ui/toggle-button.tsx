import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isSelected: boolean;
    children: React.ReactNode;
}

export function ToggleButton({
    isSelected,
    children,
    className,
    ...props
}: ToggleButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                'relative p-2 rounded-lg text-sm font-medium transition-all duration-150',
                'border shadow-sm hover:shadow-md',
                'active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] active:translate-y-[1px]',
                isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] translate-y-[1px]'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
