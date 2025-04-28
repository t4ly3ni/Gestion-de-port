import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import alerteRoutes from './routes/alerte.js';
import posteRoutes from './routes/poste.js';
import navireRoutes from './routes/navire.js';
import userRoutes from './routes/user.js';
import marchandiseRoutes from './routes/marchandise.js';
import zoneStockageRoutes from './routes/zone_stockage.js';
import tempsRoutes from './routes/temps.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io); // Make io accessible in controllers

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/alerte', alerteRoutes);
app.use('/api/poste', posteRoutes);
app.use('/api/navire', navireRoutes);
app.use('/api/user', userRoutes);
app.use('/api/marchandise', marchandiseRoutes);
app.use('/api/zone_stockage', zoneStockageRoutes);
app.use('/api/temps', tempsRoutes);

server.listen(process.env.port, () => {
    connectDB();
    console.log('Connected to MongoDB');
    console.log('Server is running on http://localhost:3000');
});
