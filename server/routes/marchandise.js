import express from 'express';
import { createMarchandise, getAllMarchandises, updateMarchandise, deleteMarchandise } from '../controllers/marchandiseController.js';

const router = express.Router();

router.post('/', createMarchandise);
router.get('/', getAllMarchandises);
router.put('/:id', updateMarchandise);
router.delete('/:id', deleteMarchandise);

export default router;
