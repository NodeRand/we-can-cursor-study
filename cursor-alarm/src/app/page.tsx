'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const [roomId, setRoomId] = useState('');
    const router = useRouter();

    const handleCreateRoom = () => {
        const newRoomId = uuidv4();
        router.push(`/room/${newRoomId}`);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            router.push(`/room/${roomId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        공유 알람 타이머
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        최대 5명이 함께 사용할 수 있는 실시간 알람 공유
                        서비스입니다. 로그인 없이 바로 시작하세요!
                    </p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                    시작하기
                                </h2>
                            </div>

                            <button
                                onClick={handleCreateRoom}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                            >
                                새 알람방 만들기
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-700">
                                        또는
                                    </span>
                                </div>
                            </div>

                            <form
                                onSubmit={handleJoinRoom}
                                className="space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="roomId"
                                        className="block text-sm font-medium text-gray-900 mb-2"
                                    >
                                        알람방 ID로 참여하기
                                    </label>
                                    <input
                                        type="text"
                                        id="roomId"
                                        value={roomId}
                                        onChange={e =>
                                            setRoomId(e.target.value)
                                        }
                                        placeholder="알람방 ID를 입력하세요"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    알람방 참여하기
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            주요 기능
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-green-500 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                최대 5명 동시 사용
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-green-500 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                실시간 알람 공유
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-green-500 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                로그인 불필요
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-green-500 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                브라우저 알림 지원
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
