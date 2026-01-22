import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, Calendar, Sparkles, Edit2, Camera, X, Check } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { user, loading, updateUser } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loadingReg, setLoadingReg] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhoto, setEditPhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    useEffect(() => {
        if (user) {
            setEditName(user.name);
        }
    }, [user]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditPhoto(file);
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editName);
            if (editPhoto) {
                formData.append('photo', editPhoto);
            }

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.put('http://localhost:5000/api/auth/profile', formData, config);

            updateUser(response.data.user);
            setIsEditing(false);
            setPreviewPhoto(null);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to save profile. Please try again. " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const response = await axios.get('http://localhost:5000/api/registrations/my-registrations', config);
                    setRegistrations(response.data.filter(r => r.status === 'registered'));
                } catch (error) {
                    console.error("Error fetching registrations:", error);
                } finally {
                    setLoadingReg(false);
                }
            }
        };

        fetchRegistrations();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Default profile image if user doesn't have one (though Cloudinary should provide one)
    // If user.photo is a File object (during register/mock), it might not work directly as src if not a URL.
    // However, our backend registration returns relative path or Cloudinary URL.
    // If it's a relative path from local upload, we might need to prepend server URL. 
    // For now assuming full URL or proper handling. 
    // In our register logic: mock implementation might treat it differently.
    // Let's assume user.photo is the URL string.

    const photoUrl = previewPhoto || (user.photo
        ? (user.photo.startsWith('http') ? user.photo : `http://localhost:5000${user.photo}`)
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200");

    // User.interests might be array or comma separated string depending on how it was saved earlier.
    // But since we updated backend to return array, we can handle both.
    const interestsList = Array.isArray(user.interests)
        ? user.interests
        : (user.interests ? user.interests.split(',').map(i => i.trim()).filter(i => i) : []);

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">

                    {/* Cover - just a gradient for now */}
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-700 relative">
                                    <img
                                        src={photoUrl}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
                                        }}
                                    />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity opacity-100">
                                            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center group/photo">
                                                <Camera className="h-8 w-8 text-white/90 group-hover/photo:text-indigo-400 transition-colors" />
                                                <span className="text-xs text-white/90 mt-1 font-medium group-hover/photo:text-indigo-400 transition-colors">Change Photo</span>
                                            </label>
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mb-2 flex flex-col items-end gap-2">
                                <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
                                    {user.role || 'Student'}
                                </span>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 hover:text-white rounded-lg text-indigo-400 transition-all duration-300 border border-white/5 hover:border-indigo-500/30"
                                        title="Edit Profile"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        <span className="text-sm font-medium">Edit Profile</span>
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105"
                                            title="Save Changes"
                                        >
                                            <Check className="h-4 w-4" />
                                            <span className="text-sm font-medium">Save</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditName(user.name);
                                                setPreviewPhoto(null);
                                                setEditPhoto(null);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
                                            title="Cancel"
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="text-sm font-medium">Cancel</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="text-3xl font-bold text-white bg-gray-700/50 border-2 border-indigo-500/50 focus:border-indigo-500 rounded-lg px-3 py-1 outline-none w-full max-w-md transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20"
                                        autoFocus
                                        placeholder="Enter your name"
                                    />
                                ) : (
                                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                                )}
                                <div className="flex items-center text-gray-400 mt-2">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                                    Interests
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {interestsList.length > 0 ? (
                                        interestsList.map((interest, index) => (
                                            <span key={index} className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-sm border border-gray-600">
                                                {interest}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No interests listed</span>
                                    )}
                                </div>
                            </div>

                            {/* Registered Events */}
                            <div className="border-t border-white/10 pt-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-indigo-400" />
                                    Registered Events
                                </h2>

                                {loadingReg ? (
                                    <p className="text-gray-400">Loading registrations...</p>
                                ) : registrations.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {registrations.map(reg => (
                                            <div key={reg._id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 flex items-start space-x-4">
                                                <div className="bg-indigo-500/20 p-2 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">{reg.event ? reg.event.title : 'Unknown Event'}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        {reg.event ? new Date(reg.event.date).toLocaleDateString() : ''}
                                                    </p>
                                                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${reg.status === 'registered' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {reg.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        You haven't registered for any events yet. Check out the <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300">Dashboard</Link> to find some!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
