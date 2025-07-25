'use client';

import { Alarm } from '@/types/alarm';
import { useState } from 'react';

interface AlarmCardProps {
    alarm: Alarm;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    isOwner: boolean;
}

export default function AlarmCard({
    alarm,
    onToggle,
    onRemove,
    isOwner,
}: AlarmCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const getTimeRemaining = () => {
        const now = new Date();
        const alarmTime = new Date(alarm.time);
        const diff = alarmTime.getTime() - now.getTime();

        if (diff <= 0) return '시간 지남';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}시간 ${minutes}분 후`;
        }
        return `${minutes}분 후`;
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                alarm.isActive ? 'border-blue-500' : 'border-gray-300'
            }`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                        {alarm.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {formatTime(alarm.time)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        {alarm.isActive ? getTimeRemaining() : '비활성'}
                    </p>
                    <p className="text-xs text-gray-700 mt-2">
                        등록자: {alarm.createdBy}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggle(alarm.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            alarm.isActive
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        {alarm.isActive ? '활성' : '비활성'}
                    </button>

                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-700"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg border z-10">
                                    <button
                                        onClick={() => {
                                            onRemove(alarm.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
