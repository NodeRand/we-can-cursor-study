'use client';
import HeaderSection from '../_components/header-section';
import TechSection from '../_components/tech-section';
import ProjectSection from '../_components/project-section';
import FooterSection from '../_components/footer-section';
import PageNavBar from '@/_components/page-nav-bar';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-gray-100 dark:from-[#18181b] dark:to-[#23272f] p-6 sm:p-12">
            <PageNavBar />
            <HeaderSection />
            <TechSection />
            <ProjectSection />
            <FooterSection />
            {/* 애니메이션용 커스텀 스타일 */}
            <style jsx global>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-40px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes gradient-x {
                    0%,
                    100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                @keyframes spin-slow {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
                .animate-fade-in-down {
                    animation: fade-in-down 1s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 6s linear infinite;
                }
                .delay-100 {
                    animation-delay: 0.1s;
                }
                .delay-200 {
                    animation-delay: 0.2s;
                }
                .delay-300 {
                    animation-delay: 0.3s;
                }
            `}</style>
        </div>
    );
}
