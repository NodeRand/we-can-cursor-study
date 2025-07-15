import { motion } from 'motion/react';

export default function Header() {
    return (
        <motion.header
            className="w-full py-6 bg-gray-800 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="text-3xl font-bold text-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                노준호의 대시보드
            </motion.h1>
        </motion.header>
    );
}
