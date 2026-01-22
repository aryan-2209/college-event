import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { Calendar, MapPin, Tag, User, Clock, ArrowLeft } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                const [eventRes, regRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/events/${id}`, config),
                    token ? axios.get('http://localhost:5000/api/registrations/my-registrations', config) : Promise.resolve({ data: [] })
                ]);

                setEvent(eventRes.data);

                // Check registration status
                if (token) {
                    const myReg = regRes.data.find(r => r.event._id === id);
                    if (myReg && myReg.status === 'registered') {
                        setIsRegistered(true);
                        setRegistrationId(myReg._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleRegister = async () => {
        try {
            setRegistering(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('http://localhost:5000/api/registrations', { eventId: id }, config);

            setIsRegistered(true);
            setRegistrationId(res.data._id);
            alert('Registered successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    const handleCancel = async () => {
        try {
            setRegistering(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`http://localhost:5000/api/registrations/${registrationId}/cancel`, {}, config);

            setIsRegistered(false);
            setRegistrationId(null);
            alert('Registration cancelled.');
        } catch (error) {
            alert(error.response?.data?.message || 'Cancellation failed');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!event) return <div>Event not found</div>;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="relative h-96 w-full">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white mb-4 flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-2" /> Back
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
                    <div className="flex flex-wrap gap-4 text-white/90">
                        <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                            <Calendar className="h-4 w-4 mr-2" /> {formatDate(event.date)}
                        </span>
                        <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                            <MapPin className="h-4 w-4 mr-2" /> {event.location}
                        </span>
                        <span className="flex items-center bg-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {event.category}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </section>

                        {event.tags && event.tags.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                                            <Tag className="h-3 w-3 mr-1" /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
                            <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                                {event.organizer?.photo ? (
                                    <img src={event.organizer.photo} alt={event.organizer.name} className="h-12 w-12 rounded-full mr-4" />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 text-lg font-bold text-indigo-600">
                                        {event.organizer?.name?.[0] || 'O'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">Organized by</p>
                                    <p className="font-semibold text-gray-900">{event.organizer?.name || 'Unknown'}</p>
                                </div>
                            </div>

                            {isRegistered ? (
                                <div className="space-y-4">
                                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-center font-medium border border-green-200">
                                        You are registered!
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                        onClick={handleCancel}
                                        disabled={registering}
                                    >
                                        {registering ? 'Processing...' : 'Cancel Registration'}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="primary"
                                    className="w-full text-lg py-3"
                                    onClick={handleRegister}
                                    disabled={registering}
                                >
                                    {registering ? 'Registering...' : 'Register for Event'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
