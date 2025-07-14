'use client';
import SocialLink from './social-link';

const FooterSection = () => (
    <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 mt-auto mb-4 animate-fade-in-up delay-300">
        <h2 className="text-lg font-semibold mb-2 text-left">Contact</h2>
        <div className="flex gap-4 justify-start">
            <SocialLink href="mailto:honggildong@email.com">
                honggildong@email.com
            </SocialLink>
            <SocialLink href="https://github.com/example">GitHub</SocialLink>
            <SocialLink href="https://linkedin.com/in/example">
                LinkedIn
            </SocialLink>
        </div>
    </div>
);

export default FooterSection;
