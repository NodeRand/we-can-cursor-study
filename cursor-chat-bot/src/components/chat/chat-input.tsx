import { FormEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
    onSubmit: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const message = inputRef.current?.value.trim();
        if (!message) return;

        onSubmit(message);
        inputRef.current.value = '';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 shadow-lg">
            <div className="container mx-auto max-w-4xl">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 p-4"
                >
                    <textarea
                        ref={inputRef}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-600 shadow-sm h-12 py-3 overflow-hidden"
                        rows={1}
                        disabled={disabled}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        type="submit"
                        disabled={disabled}
                        className="rounded-xl px-6 h-12 min-w-[80px] text-base"
                    >
                        전송
                    </Button>
                </form>
            </div>
        </div>
    );
}
