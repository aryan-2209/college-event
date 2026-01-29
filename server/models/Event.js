const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true }, // Cloudinary URL
    category: { type: String, required: true }, // e.g. Cultural, Technical, Placement
    registrationFee: { type: Number, default: 0 },
    tags: [{ type: String }], // For recommendation system
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
