import express from 'express';
import { createZoneStockage, getAllZonesStockage, updateZoneStockage, deleteZoneStockage } from '../controllers/zoneStockageController.js';

const router = express.Router();

router.post('/', createZoneStockage);
router.get('/', getAllZonesStockage);
router.put('/:id', updateZoneStockage);
router.delete('/:id', deleteZoneStockage);

export default router;
