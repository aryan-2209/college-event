import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            CampusEvent
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/events" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Explore Events
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Contact
                        </Link>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                        Home Page
                                    </Link>
                                    <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                        Profile
                                    </Link>
                                    <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost">Log In</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link to="/events" className="block py-2 text-gray-600 hover:text-indigo-600 font-medium">
                                Explore Events
                            </Link>
                            <Link to="/contact" className="block py-2 text-gray-600 hover:text-indigo-600 font-medium">
                                Contact
                            </Link>
                            <div className="pt-4 space-y-2">
                                {user ? (
                                    <>
                                        <Link to="/dashboard" className="block w-full text-center py-2 text-gray-600 hover:text-indigo-600 font-medium">
                                            Home Page
                                        </Link>
                                        <Link to="/profile" className="block w-full text-center py-2 text-gray-600 hover:text-indigo-600 font-medium">
                                            Profile
                                        </Link>
                                        <Button variant="ghost" className="w-full justify-center" onClick={handleLogout}>Log Out</Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block w-full">
                                            <Button variant="ghost" className="w-full justify-center">Log In</Button>
                                        </Link>
                                        <Link to="/register" className="block w-full">
                                            <Button variant="primary" className="w-full justify-center">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
