'use client';

import { useWeather } from '@/hooks/useWeather';

export default function WeatherBox() {
    const { weather, loading, error } = useWeather();

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl text-gray-800 font-bold mb-4">날씨</h2>
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl text-gray-800 font-bold mb-4">날씨</h2>
                <div className="text-center text-red-500">
                    Failed to load weather data
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl text-gray-800 font-bold mb-4">날씨</h2>
            <div className="text-center">
                <div className="text-4xl text-gray-400 font-semibold mb-2">
                    {weather?.main?.temp}°C
                </div>
                <div className="text-lg text-gray-900">
                    {weather?.name}, {weather?.sys?.country}
                </div>
                <div className="text-gray-900 mt-2">
                    {weather?.weather?.[0]?.description}
                </div>
            </div>
        </div>
    );
}
