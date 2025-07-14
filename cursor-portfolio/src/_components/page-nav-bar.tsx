'use client';
import { usePathname, useRouter } from 'next/navigation';

const navs = [
    { label: 'Parking', path: '/parking' },
    { label: 'Well Made', path: '/well-made' },
    { label: 'route', path: '/' },
];

const PageNavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <nav className="fixed bottom-0 left-18 z-50 flex gap-4 mb-8">
            {navs.map(nav => (
                <button
                    key={nav.path}
                    onClick={() => router.push(nav.path)}
                    className={`px-4 py-2 rounded font-semibold text-sm border transition-all duration-200 cursor-pointer ${
                        pathname === nav.path
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    {nav.label}
                </button>
            ))}
        </nav>
    );
};

export default PageNavBar;
