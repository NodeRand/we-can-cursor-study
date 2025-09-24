import { SplineSceneBasic } from '@/components/ui/demo';
import { MagicButton } from '@/components/ui/magic-button';
import { RainbowButton } from '@/components/ui/rainbow-button';

export default function Home() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <RainbowButton>안녕하세요</RainbowButton>
            <SplineSceneBasic />
            <MagicButton as="a" href="/quiz">
                Cursor 퀴즈 시작
            </MagicButton>
        </div>
    );
}
