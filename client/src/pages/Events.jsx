import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import RegistrationModal from '../components/RegistrationModal';
import { Search, Filter, Sparkles, Code, Music, Trophy, BookOpen, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



const CATEGORIES = [
    { id: 'All', label: 'All Events', icon: Sparkles },
    { id: 'Coding Club', label: 'Coding', icon: Code },
    { id: 'Music Club', label: 'Music', icon: Music },
    { id: 'Dance Club', label: 'Dance', icon: Music },
    { id: 'Sports Club', label: 'Sports', icon: Trophy },
    { id: 'E-Cell', label: 'E-Cell', icon: Briefcase },
    { id: 'Astronomy Club', label: 'Astronomy', icon: Sparkles }
];

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const eventsRes = await axios.get('http://localhost:5000/api/events');
            setEvents(eventsRes.data);

            // Fetch user registrations if logged in
            const token = localStorage.getItem('token');
            if (token) {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const regRes = await axios.get('http://localhost:5000/api/registrations/my-registrations', config);
                setRegistrations(regRes.data.filter(r => r.status === 'registered').map(r => r.event._id));
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = events;

        // Filter by Category
        if (category !== 'All') {
            result = result.filter(e => e.category === category);
        }

        // Filter by Search
        if (searchTerm) {
            result = result.filter(e =>
                e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredEvents(result);
    }, [searchTerm, category, events]);

    const handleRegisterClick = (eventId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to register for events.");
            navigate('/login');
            return;
        }

        const event = events.find(e => e._id === eventId);
        if (event) {
            setSelectedEvent(event);
            setModalOpen(true);
        }
    };

    const handleConfirmRegistration = async (eventId, details) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('http://localhost:5000/api/registrations', { eventId }, config);

            // Add to registrations array
            setRegistrations(prev => [...prev, eventId]);

            // Don't close modal here - let the modal show success screen
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const handleDeregister = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Find the registration ID for this event
            const regRes = await axios.get('http://localhost:5000/api/registrations/my-registrations', config);
            const registration = regRes.data.find(r => r.event._id === eventId);

            if (!registration) {
                alert("Registration not found");
                return;
            }

            // Cancel the registration
            await axios.patch(`http://localhost:5000/api/registrations/${registration._id}/cancel`, {}, config);

            // Remove from registrations array
            setRegistrations(prev => prev.filter(id => id !== eventId));

            alert("Successfully deregistered!");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Deregistration failed");
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`http://localhost:5000/api/events/${eventId}`, config);
            setEvents(prev => prev.filter(e => e._id !== eventId));
            setFilteredEvents(prev => prev.filter(e => e._id !== eventId));
            alert("Event deleted successfully");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete event");
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Explore Campus Events
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Discover workshops, cultural fests, competitions and placement drives happening around you.
                    </motion.p>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-gray-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 mb-12 space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search for events, tags or categories..."
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-800 rounded-xl overflow-x-auto scrollbar-hide w-full md:w-auto border border-gray-700">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${category === cat.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Events Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredEvents.length > 0 ? filteredEvents.map(event => (
                            <motion.div
                                layout
                                key={event._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <EventCard
                                    event={event}
                                    onRegister={handleRegisterClick}
                                    onDeregister={handleDeregister}
                                    onDelete={handleDeleteEvent}
                                    isRegistered={registrations.includes(event._id)}
                                />
                            </motion.div>
                        )) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
                                    <Filter className="h-10 w-10 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                                <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
                                <button
                                    onClick={() => { setCategory('All'); setSearchTerm('') }}
                                    className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <RegistrationModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    event={selectedEvent}
                    onConfirm={handleConfirmRegistration}
                />
            </div>
        </div>
    );
};

export default Events;
