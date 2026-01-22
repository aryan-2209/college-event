import React from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const CONTACTS = [
    // Council Secretary
    {
        id: 'sec',
        name: "Aryan Kumar Singh",
        role: "Council Secretary",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43210",
        email: "secretary@college.edu",
        linkedin: "linkedin.com/in/aryan",
        instagram: "aryankumarsingh693"
    },
    // Music Club
    {
        id: '1',
        name: "Prateek",
        role: "Head of Music Club",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43211",
        email: "music.head@college.edu",
        linkedin: "linkedin.com/in/rohan",
        instagram: "@music_rohan"
    },
    {
        id: '2',
        name: "Payal Singh ",
        role: "Co-Head of Music Club",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43212",
        email: "music.cohead@college.edu",
        linkedin: "linkedin.com/in/priya",
        instagram: "@priya_sings"
    },
    // Dance Club
    {
        id: '3',
        name: "Ishuman",
        role: "Head of Dance Club",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43213",
        email: "dance.head@college.edu",
        linkedin: "linkedin.com/in/vikram",
        instagram: "@dance_vikram"
    },
    {
        id: '4',
        name: "Srishti",
        role: "Co-Head of Dance Club",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43214",
        email: "dance.cohead@college.edu",
        linkedin: "linkedin.com/in/sneha",
        instagram: "@sneha_moves"
    },
    // E-Cell
    {
        id: '5',
        name: "Atul",
        role: "Head of E-Cell",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43215",
        email: "ecell.head@college.edu",
        linkedin: "linkedin.com/in/arjun",
        instagram: "@arjun_startup"
    },
    {
        id: '6',
        name: "Ayushi Srivastava",
        role: "Co-Head of E-Cell",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43216",
        email: "ecell.cohead@college.edu",
        linkedin: "linkedin.com/in/ananya",
        instagram: "@ananya_biz"
    },
    // Astronomy Club
    {
        id: '7',
        name: "Harshit Negi",
        role: "Head of Astronomy Club",
        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43217",
        email: "astro.head@college.edu",
        linkedin: "linkedin.com/in/kabir",
        instagram: "@kabir_stars"
    },
    {
        id: '8',
        name: "Himanshu",
        role: "Co-Head of Astronomy Club",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
        phone: "+91 98765 43218",
        email: "astro.cohead@college.edu",
        linkedin: "linkedin.com/in/riya",
        instagram: "@riya_space"
    }
];

const ContactCard = ({ contact, isSpecial }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`relative overflow-hidden rounded-xl border backdrop-blur-md p-6 flex flex-col items-center text-center transition-all duration-300 group
        ${isSpecial
                ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-purple-500/30 ring-1 ring-purple-500/20 shadow-lg shadow-purple-900/20'
                : 'bg-gray-800/40 border-white/10 hover:border-white/20 hover:bg-gray-800/60'}`}
    >
        <div className={`relative mb-4 ${isSpecial ? 'p-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full' : ''}`}>
            <img
                src={contact.image}
                alt={contact.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-transparent"
            />
            {isSpecial && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    SECRETARY
                </div>
            )}
        </div>

        <h3 className={`text-xl font-bold mb-1 ${isSpecial ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200' : 'text-white'}`}>
            {contact.name}
        </h3>
        <p className={`text-sm mb-4 ${isSpecial ? 'text-indigo-200' : 'text-indigo-400 font-medium'}`}>
            {contact.role}
        </p>

        <div className="w-full space-y-3 mt-auto">
            <a href={`tel:${contact.phone}`} className="flex items-center justify-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center justify-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                <Mail className="w-4 h-4" />
                <span>{contact.email}</span>
            </a>
            <div className="flex items-center justify-center space-x-4 pt-2 border-t border-white/10">
                <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Linkedin className="w-5 h-5" />
                </a>
                <a href={`https://${contact.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                    <Instagram className="w-5 h-5" />
                </a>
            </div>
        </div>
    </motion.div>
);

const Contact = () => {
    const secretary = CONTACTS[0];
    const otherContacts = CONTACTS.slice(1);

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Student Council Members
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Get to know the passionate individuals leading our student clubs and council.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-16"
                >
                    <div className="w-full max-w-sm">
                        <ContactCard contact={secretary} isSpecial={true} />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {otherContacts.map((contact, index) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index + 2) }}
                        >
                            <ContactCard contact={contact} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contact;
