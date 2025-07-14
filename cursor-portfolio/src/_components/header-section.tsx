'use client';
import Image from 'next/image';

const HeaderSection = () => (
    <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 mb-10 flex items-center gap-8 animate-fade-in-down">
        <Image
            src="/profile.png"
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-gray-300 dark:border-gray-700 shadow-lg animate-spin-slow hover:animate-none transition-all duration-700"
        />
        <div className="flex-1 text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                홍길동
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl animate-fade-in-up">
                안녕하세요! 프론트엔드와 백엔드를 모두 다루는 개발자
                홍길동입니다.
                <br />
                사용자 경험과 성능을 모두 고려한 멋진 웹 서비스를 만드는 것을
                좋아합니다.
            </p>
        </div>
    </div>
);

export default HeaderSection;
