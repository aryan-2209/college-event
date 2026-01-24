const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const scheduleEmailConfig = () => {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily event reminder check...');
        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
            const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

            // Find events happening tomorrow
            const events = await Event.find({
                date: {
                    $gte: startOfTomorrow,
                    $lte: endOfTomorrow
                }
            });

            if (events.length === 0) {
                console.log('No events found for tomorrow.');
                return;
            }

            // Find all students (or all users)
            const students = await User.find({ role: 'student' });

            if (students.length === 0) {
                console.log('No students found to send emails.');
                return;
            }

            console.log(`Found ${events.length} events and ${students.length} students.`);

            for (const event of events) {
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
                        console.error(`Failed to send email to ${student.email}:`, emailError);
                    }
                }
            }

        } catch (error) {
            console.error('Error in email scheduler:', error);
        }
    });

    console.log('Email scheduler initialized (Runs daily at 9:00 AM).');
};

module.exports = scheduleEmailConfig;
