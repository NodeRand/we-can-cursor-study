'use client';
import React from 'react';
import clsx from 'clsx';

type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    as?: 'button' | 'a';
    href?: string;
};

export function MagicButton({
    children,
    className,
    onClick,
    as = 'button',
    href,
}: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp: any = as;

    return (
        <Comp
            href={href}
            onClick={onClick}
            className={clsx(
                `
        relative inline-flex items-center justify-center
        px-8 py-3 rounded-2xl font-semibold tracking-wider
        text-white cursor-pointer select-none
        transition-all duration-300 will-change-transform
        [text-shadow:0_2px_14px_rgba(0,0,0,0.25)]
        hover:scale-[1.03] active:scale-[0.99] 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70

        // inner surface
        bg-gray-700
        shadow-[0_10px_30px_-8px_rgba(111,0,255,0.55),_0_6px_18px_-6px_rgba(0,224,255,0.45)]
        ring-1 ring-white/10

        // glass edge highlight
        before:content-[''] before:absolute before:inset-[1px] before:rounded-[1rem]
        before:bg-[linear-gradient(180deg,rgba(255,255,255,0.25),rgba(255,255,255,0.05))]
        before:pointer-events-none

        // animated outer aura (conic gradient)
        after:content-[''] after:absolute after:-inset-1 after:rounded-[1.25rem]
        after:bg-[conic-gradient(from_var(--ang),#6f00ff,transparent_30%,#00e0ff,transparent_60%,#00ff94,transparent_85%,#6f00ff)]
        after:blur-xl after:opacity-60 hover:after:opacity-90
        after:-z-10
      `,
                className,
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            {/* moving sparkle band */}
            <span
                className={`pointer-events-none absolute -inset-px rounded-[1.1rem] overflow-hidden`}
                aria-hidden="true"
            >
                <span
                    className={`absolute top-0 left-[-30%] h-[200%] w-[60%] rotate-12 bg-[radial-gradient(closest-side,rgba(255,255,255,0.55),transparent_70%)] mix-blend-screen opacity-40 animate-[slide_2.2s_linear_infinite]`}
                />
            </span>

            {/* subtle dots field */}
            <span
                className={`absolute inset-0 rounded-2xl bg-[radial-gradient(rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:10px_10px] opacity-20 pointer-events-none`}
                aria-hidden="true"
            />

            {/* content */}
            <span className="relative z-[1] flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                {children}
                <span className="inline-block h-2 w-2 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
            </span>

            <style jsx>{`
                :root {
                    --ang: 0deg;
                }
                @keyframes spinAng {
                    to {
                        --ang: 360deg;
                    }
                }
                @keyframes slide {
                    0% {
                        transform: translateX(0);
                        opacity: 0.1;
                    }
                    50% {
                        transform: translateX(160%);
                        opacity: 0.45;
                    }
                    100% {
                        transform: translateX(320%);
                        opacity: 0.1;
                    }
                }
                .after\\:bg-\\[conic-gradient\\(from_var\\(--ang\\),\\#6f00ff,transparent_30\\%,\\#00e0ff,transparent_60\\%,\\#00ff94,transparent_85\\%,\\#6f00ff\\)\\]::after {
                    animation: spinAng 6s linear infinite;
                }
            `}</style>
        </Comp>
    );
}
