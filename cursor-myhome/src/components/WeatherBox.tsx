import { motion } from 'motion/react';
import { useWeather } from '../hooks/useWeather';

export default function WeatherBox() {
    const { weather, loading, error } = useWeather();

    if (loading) {
        return (
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    날씨 정보
                </h2>
                <p>로딩 중...</p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    날씨 정보
                </h2>
                <p className="text-red-500">{error}</p>
            </motion.div>
        );
    }

    if (!weather) {
        return null;
    }

    return (
        <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2
                className="text-xl font-semibold mb-2 text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                날씨 정보
            </motion.h2>
            <motion.div
                className="flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <motion.img
                    src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-16 h-16"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                />
                <div className="ml-4">
                    <motion.p
                        className="text-3xl font-bold text-blue-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        {weather.temperature}°C
                    </motion.p>
                    <motion.p
                        className="text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        {weather.description}
                    </motion.p>
                </div>
            </motion.div>
        </motion.div>
    );
}
