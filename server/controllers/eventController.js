const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, tags, registrationFee } = req.body;
        const image = req.file ? req.file.path : '';

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organizer: req.user.id,
            image,
            category,
            registrationFee: registrationFee || 0,
            tags: tags ? tags.split(',') : []
        });

        await newEvent.save();

        // Check if event is within 24 hours and send immediate emails
        const now = new Date();
        const eventDate = new Date(date);
        const timeDiff = eventDate - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff > 0 && hoursDiff < 24) {
            console.log(`Event "${title}" is within 24 hours. Sending immediate notifications...`);

            // Get all students
            const students = await User.find({ role: 'student' });

            // Send emails asynchronously (don't wait for completion)
            students.forEach(async (student) => {
                const message = `
                    Hello ${student.name},

                    A new event "${title}" has been created and it's happening soon!

                    Event Details:
                    - Date: ${eventDate.toDateString()}
                    - Time: ${eventDate.toLocaleTimeString()}
                    - Venue: ${location}
                    - Category: ${category}

                    Don't miss it!
                    
                    -- Event Platform Team
                `;

                try {
                    await sendEmail({
                        email: student.email,
                        subject: `New Event Alert: ${title} is happening soon!`,
                        message: message,
                    });
                    console.log(`Immediate notification sent to ${student.email} for event ${title}`);
                } catch (emailError) {
                    console.error(`Failed to send email to ${student.email}:`, emailError.message);
                }
            });
        }

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
