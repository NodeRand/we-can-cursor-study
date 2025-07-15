import { motion } from 'motion/react';
import { useCurrentTime } from '../hooks/useCurrentTime';

export default function TimeBox() {
    const time = useCurrentTime();

    return (
        <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2
                className="text-xl font-semibold mb-2 text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                현재 시각
            </motion.h2>
            <motion.p
                className="text-3xl font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
                {time.toLocaleTimeString('ko-KR')}
            </motion.p>
            <motion.p
                className="text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                {time.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                })}
            </motion.p>
        </motion.div>
    );
}
