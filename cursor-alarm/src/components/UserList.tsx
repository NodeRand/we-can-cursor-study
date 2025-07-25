'use client';

import { User } from '@/types/alarm';

interface UserListProps {
    users: User[];
    maxUsers: number;
}

export default function UserList({ users, maxUsers }: UserListProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">참여자</h2>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {users.length}/{maxUsers}
                </span>
            </div>

            <div className="space-y-3">
                {users.map(user => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="font-medium text-gray-900">
                                {user.name}
                            </span>
                        </div>
                        <span className="text-sm text-gray-700">
                            {new Date(user.joinedAt).toLocaleTimeString(
                                'ko-KR',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                },
                            )}
                        </span>
                    </div>
                ))}

                {users.length === 0 && (
                    <p className="text-gray-700 text-center py-4">
                        참여자가 없습니다.
                    </p>
                )}
            </div>

            {users.length === maxUsers && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                        최대 인원에 도달했습니다. 더 이상 참여자가 들어올 수
                        없습니다.
                    </p>
                </div>
            )}
        </div>
    );
}
