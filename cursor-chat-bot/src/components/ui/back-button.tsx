import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
    href?: string;
}

export function BackButton({ href = '/' }: BackButtonProps) {
    return (
        <Link href={href}>
            <Button
                variant="outline"
                size="sm"
                className="text-gray-900 font-medium"
            >
                뒤로가기
            </Button>
        </Link>
    );
}
