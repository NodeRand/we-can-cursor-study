'use client';

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Alarm, AlarmRoom, User, AlarmNotification } from '@/types/alarm';

export const useAlarmRoom = (roomId: string, userName: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [room, setRoom] = useState<AlarmRoom | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
        null,
    );
    const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

    useEffect(() => {
        if (!roomId || !userName) return;

        const socketInstance = io(
            process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
        );

        socketInstance.on('connect', () => {
            console.log('Connected to server, joining room:', roomId, userName);
            setIsConnected(true);
            socketInstance.emit('join-room', { roomId, userName });
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        socketInstance.on('room-updated', (updatedRoom: AlarmRoom) => {
            console.log('Room updated:', updatedRoom);
            setRoom(updatedRoom);
        });

        socketInstance.on('room-full', () => {
            setError('방이 가득 찼습니다. (최대 5명)');
        });

        socketInstance.on(
            'alarm-notification',
            (notification: AlarmNotification) => {
                if (notification.type === 'trigger') {
                    new Notification(`알람: ${notification.title}`, {
                        body: `시간: ${notification.time}`,
                        icon: '/alarm-icon.png',
                    });

                    // 오디오 파일이 있다면 재생, 없다면 기본 알림음으로 대체
                    const audio = new Audio('/alarm-sound.mp3');
                    setCurrentAudio(audio);
                    setIsAlarmPlaying(true);

                    audio.onended = () => {
                        setIsAlarmPlaying(false);
                        setCurrentAudio(null);
                    };

                    audio.play().catch(error => {
                        console.log(
                            '알람 소리 파일을 재생할 수 없습니다:',
                            error,
                        );
                        // 브라우저 기본 알림음 대체
                        if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(
                                '알람입니다',
                            );
                            utterance.rate = 2;
                            utterance.pitch = 2;
                            speechSynthesis.speak(utterance);
                        }
                        setIsAlarmPlaying(false);
                        setCurrentAudio(null);
                    });
                }
            },
        );

        socketInstance.on('error', (errorMessage: string) => {
            setError(errorMessage);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [roomId, userName]);

    const addAlarm = useCallback(
        (alarm: Omit<Alarm, 'id' | 'createdAt'>) => {
            if (socket) {
                socket.emit('add-alarm', { roomId, alarm });
            }
        },
        [socket, roomId],
    );

    const removeAlarm = useCallback(
        (alarmId: string) => {
            if (socket) {
                socket.emit('remove-alarm', { roomId, alarmId });
            }
        },
        [socket, roomId],
    );

    const toggleAlarm = useCallback(
        (alarmId: string) => {
            if (socket) {
                socket.emit('toggle-alarm', { roomId, alarmId });
            }
        },
        [socket, roomId],
    );

    const stopAlarm = useCallback(() => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setCurrentAudio(null);
        }
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
        setIsAlarmPlaying(false);
    }, [currentAudio]);

    return {
        room,
        isConnected,
        error,
        addAlarm,
        removeAlarm,
        toggleAlarm,
        stopAlarm,
        isAlarmPlaying,
    };
};
