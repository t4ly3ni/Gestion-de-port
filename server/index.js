import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);


app.listen(process.env.port, () => {
    connectDB();
    console.log('Connected to MongoDB');
    console.log('Server is running on http://localhost:3000');
}
);
