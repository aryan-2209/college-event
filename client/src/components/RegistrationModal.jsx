import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, Mail, Phone, CheckCircle } from 'lucide-react';
import Button from './Button';

const RegistrationModal = ({ isOpen, onClose, event, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        await onConfirm(event._id, formData);
        setLoading(false);
        setStep(2);
    };

    const handleClose = () => {
        setStep(1);
        setFormData({ name: '', email: '', studentId: '', phone: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-end">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div>
                            <span className="inline-block px-2 py-1 bg-black/30 backdrop-blur-md rounded-md text-xs font-medium text-white mb-2 border border-white/10">
                                {event?.category || 'Event'}
                            </span>
                            <h2 className="text-2xl font-bold text-white leading-tight">{event?.title}</h2>
                        </div>
                    </div>

                    <div className="p-6">
                        {step === 1 ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6 bg-gray-800/50 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                                        {new Date(event?.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
                                        {event?.location}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Student ID</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="e.g. 2023001"
                                                value={formData.studentId}
                                                onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                                <input
                                                    required
                                                    type="tel"
                                                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="Phone number"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="college@email.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full justify-center py-3 text-lg font-semibold shadow-lg shadow-indigo-600/20"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Confirming...
                                            </span>
                                        ) : 'Confirm Registration'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="h-10 w-10 text-green-500" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">You're All Set!</h3>
                                <p className="text-gray-400 mb-8">
                                    You have successfully registered for <span className="text-indigo-400">{event?.title}</span>.
                                    We've sent a confirmation email to {formData.email}.
                                </p>
                                <Button onClick={handleClose} variant="secondary" className="w-full justify-center">
                                    Close
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RegistrationModal;
