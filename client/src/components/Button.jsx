import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-2.5 rounded-full font-bold transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

    const variants = {
        primary: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/60 hover:shadow-2xl hover:from-teal-400 hover:to-cyan-400 focus:ring-teal-500 border border-transparent transition-all duration-300",
        secondary: "bg-white text-teal-600 hover:bg-teal-50 border border-teal-200 shadow-sm hover:shadow-md focus:ring-teal-500",
        outline: "bg-transparent border-2 border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:shadow-lg hover:shadow-teal-400/30 focus:ring-teal-400 shadow-black/5",
        ghost: "bg-transparent text-gray-400 hover:text-teal-400 hover:bg-teal-400/5 focus:ring-teal-500",
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
