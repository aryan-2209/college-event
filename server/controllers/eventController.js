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

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Authorization check is already done by middleware, but if we wanted to restrict to "owner or admin" we would check here.
        // Since the requirement is "only admin", the route middleware handles it. 
        // But wait, the route middleware allows 'club', 'tnp', 'admin' to create.
        // The user said "this option should be on;y visible to admin".
        // So I will restrict the route to 'admin' ONLY. 

        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
