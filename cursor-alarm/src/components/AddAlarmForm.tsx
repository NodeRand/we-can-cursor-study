'use client';

import { useState } from 'react';
import { Alarm } from '@/types/alarm';

interface AddAlarmFormProps {
    onAddAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
    userName: string;
}

export default function AddAlarmForm({
    onAddAlarm,
    userName,
}: AddAlarmFormProps) {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !time) return;

        setIsSubmitting(true);

        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        const alarmTime = new Date();
        alarmTime.setHours(hours, minutes, 0, 0);

        if (alarmTime <= now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }

        const alarm: Omit<Alarm, 'id' | 'createdAt'> = {
            title: title.trim(),
            time: alarmTime.toISOString(),
            isActive: true,
            createdBy: userName,
        };

        onAddAlarm(alarm);
        setTitle('');
        setTime('');
        setIsSubmitting(false);
    };

    const getCurrentTimeString = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                새 알람 추가
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-900 mb-1"
                    >
                        알람 제목
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="알람 제목을 입력하세요"
                        className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-900 mb-1"
                    >
                        알람 시간
                    </label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        min={getCurrentTimeString()}
                        className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <p className="text-xs text-gray-700 mt-1">
                        현재 시간보다 이전 시간을 설정하면 내일로 설정됩니다.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !time}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? '추가 중...' : '알람 추가'}
                </button>
            </form>
        </div>
    );
}
