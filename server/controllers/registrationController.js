const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const existingRegistration = await Registration.findOne({ event: eventId, student: userId });
        if (existingRegistration) {
            if (existingRegistration.status === 'cancelled') {
                existingRegistration.status = 'registered';
                await existingRegistration.save();
                return res.status(200).json(existingRegistration);
            }
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        const registration = new Registration({
            event: eventId,
            student: userId
        });

        await registration.save();
        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const registration = await Registration.findById(registrationId);

        if (!registration) return res.status(404).json({ message: 'Registration not found' });
        if (registration.student.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        registration.status = 'cancelled';
        await registration.save();
        res.status(200).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ student: req.user.id })
            .populate('event')
            .sort({ registeredAt: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        // Verify user is organizer or admin (can add middleware check here or rely on route protection)
        // For simplicity, just fetching for now. Ideally check if req.user.id === event.organizer

        const registrations = await Registration.find({ event: eventId }).populate('student', 'name email photo');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
