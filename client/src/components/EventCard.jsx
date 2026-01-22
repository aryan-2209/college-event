import { Calendar, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onRegister, onDeregister, isRegistered }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/10 flex flex-col h-full group"
        >
            <div className="h-48 overflow-hidden relative">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000'}
                    alt={event.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-sm">
                    {event.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <Link to={`/events/${event._id}`}>
                    <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-indigo-400 transition-colors" title={event.title}>
                        {event.title}
                    </h3>
                </Link>

                <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                        {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    {event.tags && event.tags.length > 0 && (
                        <div className="flex items-center text-gray-400 text-sm mt-2">
                            <Tag className="h-4 w-4 mr-2 text-indigo-400" />
                            <div className="flex flex-wrap gap-1">
                                {event.tags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center">
                        {/* Organizer info removed */}
                    </div>

                    {isRegistered ? (
                        <Button
                            variant="ghost"
                            className="px-4 py-1.5 text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => onDeregister && onDeregister(event._id)}
                        >
                            Deregister
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            className="px-4 py-1.5 text-sm"
                            onClick={() => onRegister && onRegister(event._id)}
                        >
                            Register
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
