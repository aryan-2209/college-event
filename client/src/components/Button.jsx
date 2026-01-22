import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-2.5 rounded-full font-bold transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:to-purple-500 focus:ring-indigo-500 border border-transparent",
        secondary: "bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 shadow-sm hover:shadow-md focus:ring-indigo-500",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white/10 focus:ring-white shadow-black/5",
        ghost: "bg-transparent text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 focus:ring-indigo-500",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm focus:ring-red-500"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
