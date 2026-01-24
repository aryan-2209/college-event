const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');

dotenv.config();

const triggerEmails = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Logic duplicated from emailScheduler.js for manual testing
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
        const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

        console.log(`Checking for events between ${startOfTomorrow} and ${endOfTomorrow}`);

        const events = await Event.find({
            date: {
                $gte: startOfTomorrow,
                $lte: endOfTomorrow
            }
        });

        if (events.length === 0) {
            console.log('No events found for tomorrow.');
        } else {
            console.log(`Found ${events.length} events for tomorrow.`);
            const students = await User.find({ role: 'student' });
            console.log(`Found ${students.length} students.`);

            for (const event of events) {
                console.log(`Processing event: ${event.title}`);
                for (const student of students) {
                    const message = `
                        Hello ${student.name},

                        This is a reminder that the event "${event.title}" is happening tomorrow!

                        Event Details:
                        - Date: ${event.date.toDateString()}
                        - Venue: ${event.location}
                        - Category: ${event.category}

                        Don't miss it!
                        
                        -- Event Platform Team
                    `;

                    try {
                        await sendEmail({
                            email: student.email,
                            subject: `Reminder: ${event.title} is tomorrow!`,
                            message: message,
                        });
                        console.log(`Email sent to ${student.email} for event ${event.title}`);
                    } catch (emailError) {
                        console.error(`Failed to send email to ${student.email}:`, emailError.message);
                    }
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

triggerEmails();
