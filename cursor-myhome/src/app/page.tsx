'use client';

import TodoList from '@/components/TodoList';
import WeatherBox from '@/components/WeatherBox';
import TimeBox from '@/components/TimeBox';
import LanguageBox from '@/components/LanguageBox';

export default function Home() {
    return (
        <main className="min-h-screen bg-white p-8">
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <TimeBox />
                    <WeatherBox />
                </div>
                <div className="mb-8">
                    <LanguageBox />
                </div>
                <div>
                    <TodoList />
                </div>
            </div>
        </main>
    );
}
