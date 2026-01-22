const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

console.log('Script started...');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const adminEmail = 'admin@campusbuzz.com';
        const adminPassword = 'adminpassword';

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log("Admin user already exists.");
            console.log(`Email: ${adminEmail}`);
            // We can't know the password if it's hashed, so we won't print it unless we reset it.
            // Let's reset it to be sure.
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin.password = hashedPassword;
            admin.role = 'admin'; // Ensure role is admin
            await admin.save();
            console.log(`Admin password reset to: ${adminPassword}`);
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = new User({
                name: "System Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                interests: ["administration"],
                photo: ""
            });
            await admin.save();
            console.log("Admin user created successfully.");
        }

        console.log("-----------------------------------");
        console.log("ADMIN CREDENTIALS:");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log("-----------------------------------");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
