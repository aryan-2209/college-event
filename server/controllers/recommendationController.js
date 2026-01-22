const Event = require('../models/Event');
const User = require('../models/User');

exports.getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const interests = user.interests || [];

        // Simple content-based filtering: Match event tags with user interests
        // Also include events from categories matching interests

        // Convert interests to regex for case-insensitive matching
        const interestRegexs = interests.map(interest => new RegExp(interest, 'i'));

        const recommendations = await Event.find({
            $or: [
                { tags: { $in: interestRegexs } },
                { category: { $in: interestRegexs } },
                { title: { $in: interestRegexs } } // broad match
            ],
            date: { $gte: new Date() } // Only future events
        }).limit(10);

        // If no recommendations found, return some popular/upcoming events
        if (recommendations.length === 0) {
            const fallbackEvents = await Event.find({ date: { $gte: new Date() } })
                .sort({ date: 1 })
                .limit(5);
            return res.status(200).json(fallbackEvents);
        }

        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
