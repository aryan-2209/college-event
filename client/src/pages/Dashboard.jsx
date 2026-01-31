import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import RegistrationModal from '../components/RegistrationModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw, Sparkles, Zap, Calendar, Search, Trophy } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

// Mock Data for demonstration
// Mock data removed in favor of API
const MOCK_EVENTS = [];

const Dashboard = () => {

    const [recommendations, setRecommendations] = useState([]);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    const fetchData = async (isRefresh = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
            }
            const token = localStorage.getItem('token');
            if (!token) {
                // For demo purposes, we will not redirect if no token, just to show UI
                // But normally we would: navigate('/login');
                // return;
            }

            // Fetch Events
            const eventsRes = await axios.get('http://localhost:5000/api/events');
            const data = eventsRes.data;
            setEvents(data);

            // Interest-based recommendation logic
            if (user && user.interests && user.interests.length > 0) {
                const userInterests = Array.isArray(user.interests)
                    ? user.interests.map(i => i.toLowerCase())
                    : user.interests.split(',').map(i => i.trim().toLowerCase());

                // Filter events that match user interests
                const matchedEvents = data.filter(event => {
                    const categoryMatch = userInterests.some(interest =>
                        event.category.toLowerCase().includes(interest)
                    );
                    const tagMatch = event.tags && event.tags.some(tag =>
                        userInterests.some(interest => tag.toLowerCase().includes(interest))
                    );
                    return categoryMatch || tagMatch;
                });

                // Take up to 4 matched events, or fall back to first 4 if no matches
                setRecommendations(matchedEvents.length > 0 ? matchedEvents.slice(0, 4) : data.slice(0, 4));
            } else {
                // No interests, show first 4 events
                setRecommendations(data.slice(0, 4));
            }

            // Fetch user registrations if logged in
            if (token) {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const regRes = await axios.get('http://localhost:5000/api/registrations/my-registrations', config);
                setRegistrations(regRes.data.filter(r => r.status === 'registered' && r.event).map(r => r.event._id)); // Assuming backend returns populated event object or we just need ID
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            if (!isRefresh) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

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

            // Add to registrations array (storing just IDs for UI check)
            setRegistrations(prev => [...prev, eventId]);

            // Refresh data to ensure everything is in sync
            await fetchData(true);

            // Don't close modal here - let the modal show success screen
            // The modal will close itself when user clicks "Close" button
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
            throw error; // Re-throw so modal knows it failed
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredRecommendations = recommendations.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Student Council</h1>
                        <p className="text-gray-400">Welcome back, {user?.name || 'Student'}! Here's what's happening around you.</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="bg-gray-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                    <section>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="bg-indigo-500/20 p-2 rounded-lg">
                                <Sparkles className="h-6 w-6 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredRecommendations.map(event => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    onRegister={handleRegisterClick}
                                    onDeregister={handleDeregister}
                                    isRegistered={registrations.includes(event._id)}
                                />
                            ))}
                        </div>
                    </section>
                )}



                {/* All Events Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="bg-purple-500/20 p-2 rounded-lg">
                                <Zap className="h-6 w-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                        </div>
                        <button onClick={fetchData} className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm font-medium transition-colors">
                            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                        </button>
                    </div>

                    {/* Club Filter placeholder */}
                    <div className="flex space-x-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                        {['All', 'Music Club', 'Dance Club', 'E-Cell', 'Astronomy Club'].map(club => (
                            <button key={club} className="px-4 py-1.5 rounded-full bg-gray-800/50 border border-white/10 text-gray-300 text-sm hover:bg-gray-700 hover:text-white transition-colors whitespace-nowrap">
                                {club}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEvents.map(event => (
                            <EventCard
                                key={event._id}
                                event={event}
                                onRegister={handleRegisterClick}
                                onDeregister={handleDeregister}
                                isRegistered={registrations.includes(event._id)}
                            />
                        ))}
                    </div>
                </section>

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

export default Dashboard;
