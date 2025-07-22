import { cn } from '@/lib/utils';
import { UserCircle } from 'lucide-react';

interface MessageProps {
    role: 'user' | 'assistant';
    content: string;
}

export function Message({ role, content }: MessageProps) {
    return (
        <div className="px-4 py-1">
            <div
                className={cn(
                    'flex items-start gap-4 p-4 rounded-2xl border shadow-sm transition-shadow',
                    role === 'assistant'
                        ? 'bg-gray-50 border-gray-200 hover:shadow-md'
                        : 'bg-white border-gray-200 hover:shadow-md',
                )}
            >
                <div
                    className={cn(
                        'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full',
                        role === 'assistant'
                            ? 'bg-primary-600 text-white text-sm'
                            : 'text-gray-600',
                    )}
                >
                    {role === 'assistant' ? 'AI' : <UserCircle size={32} />}
                </div>
                <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-600">{content}</p>
                </div>
            </div>
        </div>
    );
}
