const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, tags } = req.body;
        const image = req.file ? req.file.path : '';

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organizer: req.user.id,
            image,
            category,
            tags: tags ? tags.split(',') : []
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name photo');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name photo');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
