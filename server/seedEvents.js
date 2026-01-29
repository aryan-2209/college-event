const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');
const Registration = require('./models/Registration');

dotenv.config();

const MOCK_EVENTS = [
    // Music Club
    {
        title: "Symphony Night",
        date: "2024-03-15T18:00:00",
        location: "Main Auditorium",
        category: "Music Club",
        tags: ["Live", "Classical", "Orchestra"],
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
        description: "A night of classical symphony.",
        registrationFee: 100
    },
    {
        title: "Acoustic Jam Session",
        date: "2024-03-18T16:00:00",
        location: "Amphitheater",
        category: "Music Club",
        tags: ["Unplugged", "Jam", "Casual"],
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000",
        description: "Unplugged jam session for everyone."
    },
    {
        title: "Rock Band Battle",
        date: "2024-03-25T19:00:00",
        location: "College Ground",
        category: "Music Club",
        tags: ["Rock", "Competition", "High Energy"],
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000",
        description: "Battle of the best rock bands.",
        registrationFee: 50
    },
    {
        title: "Jazz & Blues Evening",
        date: "2024-03-10T19:30:00",
        location: "Cafeteria Roof",
        category: "Music Club",
        tags: ["Jazz", "Smooth", "Relaxing"],
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=1000",
        description: "Relaxing jazz and blues night."
    },

    // Dance Club
    {
        title: "Groove Gala 2024",
        date: "2024-03-20T17:00:00",
        location: "Student Center Hall",
        category: "Dance Club",
        tags: ["Dance", "Party", "Social"],
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=1000",
        description: "The biggest dance gala of the year.",
        registrationFee: 300
    },
    {
        title: "Hip Hop Faceoff",
        date: "2024-03-22T16:00:00",
        location: "Open Air Theater",
        category: "Dance Club",
        tags: ["Competition", "HipHop", "Street"],
        image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80&w=1000",
        description: "Street dance battle."
    },
    {
        title: "Salsa Workshop",
        date: "2024-03-12T17:00:00",
        location: "Dance Studio",
        category: "Dance Club",
        tags: ["Workshop", "Beginner", "Latin"],
        image: "https://images.unsplash.com/photo-1546215364-12f3fff5d578?auto=format&fit=crop&q=80&w=1000",
        description: "Learn salsa from the experts."
    },
    {
        title: "Contemporary Showcase",
        date: "2024-03-28T18:30:00",
        location: "Main Auditorium",
        category: "Dance Club",
        tags: ["Art", "Performance", "Contemporary"],
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=1000",
        description: "A showcase of contemporary dance arts."
    },

    // E-Cell
    {
        title: "Startup Summit",
        date: "2024-04-05T09:00:00",
        location: "Conference Hall A",
        category: "E-Cell",
        tags: ["Business", "Networking", "Startup"],
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000",
        description: "Network with startup founders.",
        registrationFee: 100
    },
    {
        title: "Idea Pitchathon",
        date: "2024-04-10T14:00:00",
        location: "Innovation Hub",
        category: "E-Cell",
        tags: ["Pitch", "Competition", "Ideas"],
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
        description: "Pitch your ideas to investors."
    },
    {
        title: "Entrepreneurship 101",
        date: "2024-03-14T15:00:00",
        location: "Lecture Hall 4",
        category: "E-Cell",
        tags: ["Workshop", "Learning", "Business"],
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
        description: "Basics of entrepreneurship."
    },
    {
        title: "Unicorn Founder Talk",
        date: "2024-04-15T11:00:00",
        location: "Main Auditorium",
        category: "E-Cell",
        tags: ["Guest Lecture", "Inspiration", "Tech"],
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000",
        description: "Talk by a unicorn founder."
    },

    // Astronomy Club
    {
        title: "Stargazing Night",
        date: "2024-03-09T22:00:00",
        location: "College Rooftop",
        category: "Astronomy Club",
        tags: ["Night", "Stars", "Telescope"],
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=1000",
        description: "Observe the night sky."
    },
    {
        title: "Cosmic Watch Party",
        date: "2024-03-30T20:00:00",
        location: "Physics Lawn",
        category: "Astronomy Club",
        tags: ["Documentary", "Space", "Chill"],
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000",
        description: "Watch space documentaries."
    },
    {
        title: "Planetarium Visit",
        date: "2024-04-02T10:00:00",
        location: "City Planetarium",
        category: "Astronomy Club",
        tags: ["Field Trip", "Learning", "Space"],
        image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&q=80&w=1000",
        description: "Visit to the city planetarium."
    },

    // Coding Club
    {
        title: "HackOverflow 2024",
        date: "2024-04-20T09:00:00",
        location: "Computer Lab 3",
        category: "Coding Club",
        tags: ["Hackathon", "Coding", "Competition"],
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000",
        description: "24-hour coding hackathon with amazing prizes.",
        registrationFee: 50
    },
    {
        title: "Web Development Workshop",
        date: "2024-03-16T14:00:00",
        location: "Innovation Lab",
        category: "Coding Club",
        tags: ["Workshop", "Web Dev", "Learning"],
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000",
        description: "Learn modern web development with React and Node.js.",
        registrationFee: 50
    },
    {
        title: "AI/ML Bootcamp",
        date: "2024-04-08T10:00:00",
        location: "Seminar Hall",
        category: "Coding Club",
        tags: ["AI", "Machine Learning", "Python"],
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1000",
        description: "Introduction to Artificial Intelligence and Machine Learning."
    },
    {
        title: "Code Sprint Challenge",
        date: "2024-03-27T15:00:00",
        location: "Computer Lab 1",
        category: "Coding Club",
        tags: ["Competition", "Algorithms", "Coding"],
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000",
        description: "Competitive programming challenge for all skill levels."
    },
    {
        title: "Open Source Contribution Day",
        date: "2024-04-12T11:00:00",
        location: "Tech Hub",
        category: "Coding Club",
        tags: ["Open Source", "GitHub", "Collaboration"],
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=1000",
        description: "Contribute to open source projects and learn collaborative coding."
    },

    // Sports Club
    {
        title: "Badminton Championship",
        date: "2024-03-23T08:00:00",
        location: "Sports Complex",
        category: "Sports Club",
        tags: ["Badminton", "Tournament", "Competition"],
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000",
        description: "Annual inter-college badminton championship.",
        registrationFee: 100
    },
    {
        title: "Football League Finals",
        date: "2024-04-06T16:00:00",
        location: "Main Ground",
        category: "Sports Club",
        tags: ["Football", "Finals", "Team Sport"],
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000",
        description: "Championship finals of the college football league."
    },
    {
        title: "Cricket Tournament",
        date: "2024-03-29T09:00:00",
        location: "Cricket Ground",
        category: "Sports Club",
        tags: ["Cricket", "Tournament", "Team"],
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000",
        description: "Inter-department cricket tournament.",
        registrationFee: 200
    },
    {
        title: "Marathon Run 2024",
        date: "2024-04-14T06:00:00",
        location: "Campus Circuit",
        category: "Sports Club",
        tags: ["Marathon", "Running", "Fitness"],
        image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=1000",
        description: "5K and 10K marathon for fitness enthusiasts."
    },
    {
        title: "Basketball 3v3 Showdown",
        date: "2024-03-31T15:00:00",
        location: "Basketball Court",
        category: "Sports Club",
        tags: ["Basketball", "3v3", "Competition"],
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1000",
        description: "Fast-paced 3v3 basketball tournament."
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Find a user to be the organizer
        let organizer = await User.findOne({ role: 'admin' });
        if (!organizer) {
            organizer = await User.findOne(); // Any user
        }

        if (!organizer) {
            console.log("No users found. Creating a dummy organizer.");
            // Create a dummy user if none exist (hashing password skipped for simplicity in seed, or irrelevant if just ID needed)
            // But we need to follow schema
            const newUser = new User({
                name: "Event Organizer",
                email: "organizer@example.com",
                password: "hashedpassword", // Only ID matters for relation
                role: "club",
                interests: ["management"]
            });
            organizer = await newUser.save();
        }

        if (count > 0) {
            console.log(`Clearing ${count} existing events...`);
            await Event.deleteMany({});
        }

        // Clear all registrations to ensure no orphaned data
        await Registration.deleteMany({});
        console.log("Cleared all existing registrations.");

        // Also clear registrations from users to avoid "Unknown Event"
        const users = await User.find();
        if (users.length > 0) {
            console.log("Clearing user registrations...");
            await User.updateMany({}, { $set: { registeredEvents: [] } });
        }

        const eventsToInsert = MOCK_EVENTS.map(event => ({
            ...event,
            organizer: organizer._id
        }));

        await Event.insertMany(eventsToInsert);
        console.log("Events seeded successfully!");
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
