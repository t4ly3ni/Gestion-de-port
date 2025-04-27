import express from 'express';
import { createNavire, getAllNavires, updateNavire, deleteNavire } from '../controllers/navireController.js';

const router = express.Router();

router.post('/', createNavire);
router.get('/', getAllNavires);
router.put('/:id', updateNavire);
router.delete('/:id', deleteNavire);

export default router;
