import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Type, AlignLeft, Tag, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import axios from 'axios';
import Navbar from '../components/Navbar';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Cultural', // Default
        registrationFee: '',
        tags: '',
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (image) {
            data.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.post('http://localhost:5000/api/events', data, config);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-600 rounded-lg py-3 px-3 border bg-gray-700 text-white placeholder-gray-400 transition-all duration-200 hover:bg-gray-700/80";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
    const iconClasses = "h-5 w-5 text-gray-400";

    return (
        <div className="min-h-screen bg-gray-900 pb-12 text-white">
            <Navbar />
            <div className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
                >
                    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 px-8 py-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Create New Event</h1>
                            <p className="text-indigo-200 mt-2 text-lg">Share your event with the campus community</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-900/50 border-l-4 border-red-500 p-4 text-sm text-red-200 rounded-md"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <motion.div
                                className="col-span-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <label className={labelClasses}>Event Title</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Type className={iconClasses} />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        className={inputClasses}
                                        placeholder="Annual Tech Fest 2024"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className="col-span-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <label className={labelClasses}>Description</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                        <AlignLeft className={iconClasses} />
                                    </div>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        className={inputClasses}
                                        placeholder="Detailed description of the event..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                                <label className={labelClasses}>Date & Time</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className={iconClasses} />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        required
                                        className={inputClasses}
                                        value={formData.date}
                                        onChange={handleChange}
                                        style={{ colorScheme: "dark" }}
                                    />
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                                <label className={labelClasses}>Location</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className={iconClasses} />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        className={inputClasses}
                                        placeholder="Auditorium, Main Block"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                                <label className={labelClasses}>Category</label>
                                <div className="relative rounded-md shadow-sm">
                                    <select
                                        name="category"
                                        className={`${inputClasses} pl-3`}
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option>Cultural</option>
                                        <option>Technical</option>
                                        <option>Sports</option>
                                        <option>Workshop</option>
                                        <option>Placement</option>
                                    </select>
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                                <label className={labelClasses}>Tags (comma separated)</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag className={iconClasses} />
                                    </div>
                                    <input
                                        type="text"
                                        name="tags"
                                        className={inputClasses}
                                        placeholder="Music, Live, Concert"
                                        value={formData.tags}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                                <label className={labelClasses}>Registration Fee (₹)</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-bold">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="registrationFee"
                                        className={inputClasses}
                                        placeholder="0 for Free"
                                        value={formData.registrationFee}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className="col-span-2"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <label className={labelClasses}>Event Banner</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-purple-500 hover:bg-gray-700/50 transition-all duration-300 relative group">
                                    <div className="space-y-1 text-center">
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-500 group-hover:text-purple-400 transition-colors" />
                                        <div className="flex text-sm text-gray-400 justify-center">
                                            <label className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                                                <span>Upload a file</span>
                                                <input type="file" className="sr-only" onChange={handleImageChange} required />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                        {image && <p className="text-sm text-green-400 font-semibold mt-2">{image.name}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="pt-6 flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/dashboard')}
                                className="text-gray-300 hover:text-white hover:bg-gray-700 font-medium px-6 py-3"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3 shadow-lg transform transition hover:scale-105"
                            >
                                {loading ? 'Creating Event...' : 'Create Event'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateEvent;
