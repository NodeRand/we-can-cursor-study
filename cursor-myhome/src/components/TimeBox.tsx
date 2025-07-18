'use client';

import { useCurrentTime } from '@/hooks/useCurrentTime';

export default function TimeBox() {
    const time = useCurrentTime();

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl text-gray-800 font-bold mb-4">현재 시각</h2>
            <div className="text-4xl text-gray-500 font-semibold text-center">
                {time.toLocaleTimeString('ko-KR')}
            </div>
            <div className="text-lg text-gray-900 text-center mt-2">
                {time.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                })}
            </div>
        </div>
    );
}
