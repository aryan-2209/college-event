import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const Home = () => {
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
