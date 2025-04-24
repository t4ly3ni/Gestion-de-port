import bcrypt from 'bcrypt';
import User from './models/user.js';
import connectDB from './db/connection.js';

const register = async () => {
    try {
        await connectDB(); // Await the DB connection
        const hashPassword = await bcrypt.hash('admin', 10);
        const newUser = new User({
            name: 'admin',
            password: hashPassword,
            role: 'admin',
        });
        await newUser.save();
        console.log('Admin user created successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }   
}
register();
