import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, Mail, Phone, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import Button from './Button';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Logic Steps:
// 1: Details Form
// 2: Payment (QR + Trx ID)
// 3: OTP Verification
// 4: Payment Success Animation
// 5: Final Check/Registration Success

const RegistrationModal = ({ isOpen, onClose, event, onConfirm }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        studentId: '',
        phone: '',
        transactionId: ''
    });

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOtp('');
            setFormData(prev => ({
                ...prev,
                name: user?.name || '',
                email: user?.email || '',
                transactionId: '' // ensure clear
            }));
        }
    }, [isOpen, user]);

    const isPaidEvent = event?.registrationFee && Number(event.registrationFee) > 0;

    const handleNextStep = (e) => {
        e.preventDefault();
        if (isPaidEvent) {
            setStep(2); // Go to Payment (QR) Step
        } else {
            submitRegistration(); // Free event, skip payment logic
        }
    };

    const handleVerifyTransaction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate verifying Transaction ID locally
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send Real OTP
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/auth/send-otp', {}, config);

            setStep(3); // Go to OTP Step
        } catch (error) {
            console.error("Failed to send OTP", error);
            alert("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Verify Real OTP
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/auth/verify-otp', { otp }, config);

            setStep(4); // Payment Success Step

            // Auto-advance to final registration after showing success animation
            setTimeout(() => {
                submitRegistration();
            }, 2000);
        } catch (error) {
            console.error("OTP Verification failed", error);
            alert(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const submitRegistration = async () => {
        setLoading(true);
        try {
            await onConfirm(event._id, formData);
            setStep(5); // Final Success Step
        } catch (error) {
            console.error("Registration failed", error);
            // In a real app, handle error UI here
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (step === 4) return; // Don't close during success animation
        onClose();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    if (!isOpen) return null;

    // QR Code URL (Realistic UPI QR)
    const adminUpi = "admin@college.edu"; // Mock UPI
    const qrData = `upi://pay?pa=${adminUpi}&pn=CollegeEventAdmin&am=${event?.registrationFee}&tn=EventRegistration`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

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
                    {/* Header: Hide during full success animation (Step 4) for impact */}
                    {step !== 4 && (
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
                    )}

                    <div className="p-6">
                        {/* STEP 1: Details */}
                        {step === 1 && (
                            <form onSubmit={handleNextStep} className="space-y-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6 bg-gray-800/50 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                                        {new Date(event?.date).toLocaleDateString()}
                                    </div>
                                    {isPaidEvent && (
                                        <div className="flex items-center font-bold text-indigo-400">
                                            Fee: ₹{event.registrationFee}
                                        </div>
                                    )}
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
                                            <input
                                                required
                                                type="tel"
                                                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="Phone number"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
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
                                    <Button type="submit" variant="primary" className="w-full justify-center py-3 text-lg font-semibold shadow-lg shadow-indigo-600/20">
                                        {isPaidEvent ? 'Proceed to Pay' : 'Confirm Registration'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* STEP 2: Payment (QR + Trx ID) */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyTransaction} className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">Payment Required</h3>
                                    <p className="text-gray-400 text-sm">Scan to pay <span className="text-indigo-400 font-bold">₹{event.registrationFee}</span></p>
                                </div>

                                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl mx-auto w-fit shadow-lg">
                                    <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 object-contain" />
                                    <p className="text-xs text-gray-500 mt-2 font-mono">UPI ID: {adminUpi}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Transaction ID / UTR</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter 12-digit UTR No."
                                        value={formData.transactionId}
                                        onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="button" variant="secondary" onClick={handleBack} className="flex-1 justify-center py-3">Back</Button>
                                    <Button type="submit" variant="primary" className="flex-1 justify-center py-3 text-lg font-semibold shadow-lg shadow-indigo-600/20">
                                        {loading ? 'Verifying...' : 'Verify Payment'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* STEP 3: OTP Verification */}
                        {step === 3 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="h-8 w-8 text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Security Verification</h3>
                                    <p className="text-gray-400 mt-2">Enter the OTP sent to your registered mobile number for final confirmation.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">One Time Password (OTP)</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                        <input
                                            required
                                            type="text"
                                            maxLength="6"
                                            className="w-full bg-gray-800 border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg tracking-widest"
                                            placeholder="123456"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                    <p className="text-xs text-right text-gray-500 mt-2 cursor-pointer hover:text-indigo-400">Resend OTP?</p>
                                </div>

                                <Button type="submit" variant="primary" className="w-full justify-center py-3 text-lg font-semibold shadow-lg shadow-indigo-600/20">
                                    {loading ? 'Confirming...' : 'Confirm & Register'}
                                </Button>
                            </form>
                        )}

                        {/* STEP 4: Payment Success Animation */}
                        {step === 4 && (
                            <div className="flex flex-col items-center justify-center py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-green-500/50 shadow-2xl"
                                >
                                    <CheckCircle className="h-12 w-12 text-white" />
                                </motion.div>
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold text-white mb-2"
                                >
                                    Payment Successful!
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-400"
                                >
                                    Redirecting...
                                </motion.p>
                            </div>
                        )}

                        {/* STEP 5: Final Success */}
                        {step === 5 && (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="h-10 w-10 text-green-500" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Registration Confirmed!</h3>
                                <p className="text-gray-400 mb-8">
                                    You have successfully registered for <span className="text-indigo-400">{event?.title}</span>.
                                    We've sent a ticket to {formData.email}.
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
