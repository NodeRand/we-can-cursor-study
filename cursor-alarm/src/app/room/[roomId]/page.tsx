'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAlarmRoom } from '@/hooks/useAlarmRoom';
import AlarmCard from '@/components/AlarmCard';
import AddAlarmForm from '@/components/AddAlarmForm';
import UserList from '@/components/UserList';

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    const [userName, setUserName] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('');

    const {
        room,
        isConnected,
        error,
        addAlarm,
        removeAlarm,
        toggleAlarm,
        stopAlarm,
        isAlarmPlaying,
    } = useAlarmRoom(hasJoined ? roomId : '', userName);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const permissions = Notification.requestPermission();
            console.log('Notification permission:', permissions);
        }
    }, []);

    useEffect(() => {
        if (room && userName) {
            const user = room.users.find(u => u.name === userName);
            if (user) {
                setCurrentUserId(user.id);
            }
        }
    }, [room, userName]);

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            setHasJoined(true);
        }
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('링크가 복사되었습니다!');
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        오류
                    </h1>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    if (!hasJoined) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        알람방 참여
                    </h1>
                    <form onSubmit={handleJoinRoom} className="space-y-4">
                        <div>
                            <label
                                htmlFor="userName"
                                className="block text-sm font-medium text-gray-900 mb-1"
                            >
                                사용자명
                            </label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                placeholder="사용자명을 입력하세요"
                                className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                maxLength={20}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            방 참여하기
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-900">방 ID: {roomId}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            공유 알람방
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    isConnected
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {isConnected ? '연결됨' : '연결 끊김'}
                            </span>
                            {isAlarmPlaying && (
                                <button
                                    onClick={stopAlarm}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium animate-pulse cursor-pointer"
                                >
                                    🔊 알람 정지
                                </button>
                            )}
                            <button
                                onClick={handleCopyLink}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                링크 복사
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-700">방 ID: {roomId}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <AddAlarmForm
                                onAddAlarm={addAlarm}
                                userName={userName}
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                활성 알람
                            </h2>
                            <div className="space-y-4">
                                {room?.alarms.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                        <p className="text-gray-700">
                                            등록된 알람이 없습니다.
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2">
                                            위의 폼을 사용하여 첫 번째 알람을
                                            추가해보세요.
                                        </p>
                                    </div>
                                ) : (
                                    room?.alarms.map(alarm => (
                                        <AlarmCard
                                            key={alarm.id}
                                            alarm={alarm}
                                            onToggle={toggleAlarm}
                                            onRemove={removeAlarm}
                                            isOwner={
                                                alarm.createdBy === userName
                                            }
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <UserList
                            users={room?.users || []}
                            maxUsers={room?.maxUsers || 5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
