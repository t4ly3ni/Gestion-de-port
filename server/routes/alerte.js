import express from 'express';
import { createAlerte, getAllAlertes, deleteAlerte } from '../controllers/alerteController.js';

const router = express.Router();

// POST /api/alerte
router.post('/', createAlerte);
// GET /api/alerte
router.get('/', getAllAlertes);
// DELETE /api/alerte/:id
router.delete('/:id', deleteAlerte);

export default router;
