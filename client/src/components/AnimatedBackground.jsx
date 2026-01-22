import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-90" />

            {/* Floating blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -60, 0],
                    x: [0, -30, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                }}
                className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 45, 0],
                    x: [0, 50, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5
                }}
                className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            />
        </div>
    );
};

export default AnimatedBackground;
