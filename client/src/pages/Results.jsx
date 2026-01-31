import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Trophy } from 'lucide-react';

const Results = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events');
                setEvents(res.data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const eventsWithWinners = events.filter(e => e.winners && e.winners.first);

    return (
        <div className="min-h-screen pb-20 bg-gray-900 text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-yellow-500/20 p-3 rounded-lg">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                            Hall of Fame
                        </h1>
                        <p className="text-gray-400 mt-1">Celebrating our champions</p>
                    </div>
                </div>

                {eventsWithWinners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventsWithWinners.map(event => (
                            <div key={event._id} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-yellow-500/10">
                                {/* Header with Image Background effect could be cool, but keeping simple for now */}
                                <div className="p-6 border-b border-white/5">
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-sm text-gray-400 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative flex items-center p-3 rounded-lg bg-gray-900/90 border border-yellow-500/30">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-yellow-500/20">
                                                1st
                                            </div>
                                            <span className="ml-4 text-gray-200 font-medium text-lg">{event.winners.first}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 rounded-lg bg-gray-800/50 border border-white/5">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-black font-bold text-sm">
                                            2nd
                                        </div>
                                        <span className="ml-4 text-gray-300 font-medium">{event.winners.second}</span>
                                    </div>

                                    <div className="flex items-center p-3 rounded-lg bg-gray-800/50 border border-white/5">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                            3rd
                                        </div>
                                        <span className="ml-4 text-gray-300 font-medium">{event.winners.third}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-white/5">
                        <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-300">No results announced yet</h3>
                        <p className="text-gray-500 mt-2">Check back after events conclude!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
