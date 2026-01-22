import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [recentEvents, setRecentEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Determine if we are in dev or prod, assuming local for now based on context
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();

                const sorted = data.reverse().slice(0, 3);
                setRecentEvents(sorted);

                // Fetch registrations if needed for "isRegistered" check
                const token = localStorage.getItem('token');
                if (token) {
                    const regRes = await axios.get('http://localhost:5000/api/registrations/my-registrations', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRegistrations(regRes.data.filter(r => r.status === 'registered').map(r => r.event._id));
                }

            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`http://localhost:5000/api/events/${eventId}`, config);
            setRecentEvents(prev => prev.filter(e => e._id !== eventId));
            alert("Event deleted successfully");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete event");
        }
    };

    const handleRegisterClick = (eventId) => {
        // Simplification: Redirect to /events for registration flows to avoid duplicating modal logic in Home
        // OR, assume user handles it in /events. 
        // For better UX, let's just link to /events or show a simple alert "Please go to Explore Events to register".
        // But wait, EventCard calls `onRegister(eventId)`.
        window.location.href = `/events`; // Simple redirect for now
    };


    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 opacity-30 transform translate-x-1/2 -translate-y-1/4">
                    <svg viewBox="0 0 1000 1000" className="w-[800px] h-[800px] text-indigo-200 fill-current animate-spin-slow">
                        <path d="M500,0 C776.142375,0 1000,223.857625 1000,500 C1000,776.142375 776.142375,1000 500,1000 C223.857625,1000 0,776.142375 0,500 C0,223.857625 223.857625,0 500,0 Z" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8"
                        >
                            Don't Miss the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                Campus Buzz
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed"
                        >
                            The ultimate platform for college events. Join clubs, attend workshops, and get placed at top companies.
                            <br className="hidden md:block" /> All in one place.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/register">
                                <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
                                    Join Now <ArrowRight className="inline-block ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/events">
                                <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                                    Browse Events
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Upcoming/Recent Events Section */}
            <section className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Latest Events</h2>
                        <p className="text-gray-400">Check out what's new on campus</p>
                    </div>

                    {loading ? (
                        <div className="text-center text-white">Loading events...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {recentEvents.map(event => (
                                <Link to={`/events`} key={event._id} className="block group">
                                    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform transform group-hover:-translate-y-2 group-hover:shadow-2xl border border-gray-700">
                                        <div className="h-48 overflow-hidden">
                                            <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">{event.category}</span>
                                                <span className="text-gray-400 text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{event.title}</h3>
                                            <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/events">
                            <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                                View All Events <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Calendar className="h-8 w-8 text-indigo-600" />,
                                title: "Never Miss an Event",
                                description: "Stay updated with real-time notifications for all upcoming club activities and workshops."
                            },
                            {
                                icon: <Users className="h-8 w-8 text-purple-600" />,
                                title: "Connect with Societies",
                                description: "Explore various clubs, matching your interests from Music to Astronomy."
                            },
                            {
                                icon: <Star className="h-8 w-8 text-pink-600" />,
                                title: "Smart Recommendations",
                                description: "Our AI filters events based on your passions so you only see what matters."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-white/10"
                            >
                                <div className="bg-gray-700/50 rounded-xl p-4 w-fit shadow-sm mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats/Social Proof (Optional, keeping simple for now) */}

        </div>
    );
};

export default Home;
