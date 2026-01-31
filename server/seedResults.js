const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const indianNames = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Aryan", "Nikhil", "Ishaan",
    "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Anika", "Navya", "Riya", "Myra", "Saira"
];

const getRandomName = () => indianNames[Math.floor(Math.random() * indianNames.length)];

const seedResults = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const events = await Event.find({});
        console.log(`Found ${events.length} events.`);

        let updatedCount = 0;

        for (const event of events) {
            // Randomly decide if an event has ended and has winners (e.g., 60% chance)
            if (Math.random() > 0.4) {
                // Ensure unique winners for an event
                const first = getRandomName();
                let second = getRandomName();
                while (second === first) second = getRandomName();
                let third = getRandomName();
                while (third === first || third === second) third = getRandomName();

                event.winners = {
                    first: first,
                    second: second,
                    third: third
                };
                await event.save();
                updatedCount++;
                console.log(`Updated winners for: ${event.title}`);
            }
        }

        console.log(`Updated ${updatedCount} events with winner results.`);
        process.exit(0);

    } catch (error) {
        console.error("Error seeding results:", error);
        process.exit(1);
    }
};

seedResults();
