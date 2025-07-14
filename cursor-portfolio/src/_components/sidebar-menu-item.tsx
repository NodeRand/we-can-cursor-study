'use client';
interface SidebarMenuItemProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const SidebarMenuItem = ({ label, active, onClick }: SidebarMenuItemProps) => (
    <div
        className={`px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors select-none ${
            active
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={onClick}
    >
        {label}
    </div>
);

export default SidebarMenuItem;
