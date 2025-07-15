'use client';

import Header from '../components/Header';
import TimeBox from '../components/TimeBox';
import WeatherBox from '../components/WeatherBox';
import TodoList from '../components/TodoList';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-100">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TimeBox />
                    <WeatherBox />
                    <div className="md:col-span-2">
                        <TodoList />
                    </div>
                </div>
            </div>
        </main>
    );
}
