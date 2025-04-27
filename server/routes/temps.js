import express from 'express';
import { createTemps, getAllTemps } from '../controllers/tempsController.js';

const router = express.Router();

router.post('/', createTemps);
router.get('/', getAllTemps);

export default router;
