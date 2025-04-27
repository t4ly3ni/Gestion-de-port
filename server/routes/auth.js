import express from 'express';
import { login } from '../controllers/authcontroller.js';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/login', login);

// Stateless JWT logout endpoint (for frontend to call)
router.post('/logout', (req, res) => {
    // For JWT, logout is handled on the client by deleting the token.
    // Optionally, you can implement token blacklisting here.
    res.status(200).json({ success: true, message: 'Logged out' });
});

export default router;
