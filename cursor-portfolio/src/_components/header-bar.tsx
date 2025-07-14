'use client';

const HeaderBar = () => (
    <header className="w-full h-14 bg-black flex items-center px-6 justify-between shadow z-20">
        {/* 좌측 로고(사각형) */}
        <div className="w-32 h-8 bg-white rounded-sm" />
        {/* 중앙 메뉴 */}
        <nav className="flex-1 flex justify-center gap-8">
            <span className="text-white font-semibold text-sm cursor-pointer hover:underline">
                대시보드
            </span>
            <span className="text-white font-semibold text-sm cursor-pointer hover:underline">
                웹사이트 관리
            </span>
            <span className="text-white font-semibold text-sm cursor-pointer hover:underline">
                현장 관리
            </span>
            <span className="text-white font-semibold text-sm cursor-pointer hover:underline">
                연락처
            </span>
        </nav>
        {/* 우측 검색창(모양만) */}
        <div className="w-32 h-8 bg-white rounded-sm" />
    </header>
);

export default HeaderBar;
