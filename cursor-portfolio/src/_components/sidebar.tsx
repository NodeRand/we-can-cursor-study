'use client';
import SidebarSection from './sidebar-section';
import SidebarMenuItem from './sidebar-menu-item';

const Sidebar = () => (
    <aside className="w-64 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4 overflow-y-auto">
        {/* 사용자 정보 */}
        <SidebarSection>
            <div className="text-xs text-gray-500 mb-1">사용자 정보</div>
            <div className="font-semibold text-sm">홍길동</div>
            <div className="text-xs text-gray-400">(이름, 직책, 권한 등)</div>
        </SidebarSection>
        {/* 축제 정보 */}
        <SidebarSection>
            <div className="text-xs text-gray-500 mb-1">축제 정보</div>
            <div className="font-semibold text-sm">예시 축제</div>
            <div className="text-xs text-gray-400">
                (축제 이름, 축제 변경 등)
            </div>
        </SidebarSection>
        {/* 주차장 관리 메뉴 */}
        <SidebarSection>
            <div className="text-xs text-gray-500 mb-2">주차장 관리</div>
            <SidebarMenuItem label="주차장 리스트" active />
            <SidebarMenuItem label="환경설정" />
            <SidebarMenuItem label="권한 관리" />
        </SidebarSection>
        {/* 기타 메뉴 예시 */}
        <SidebarSection>
            <SidebarMenuItem label="돌아가기" />
        </SidebarSection>
    </aside>
);

export default Sidebar;
