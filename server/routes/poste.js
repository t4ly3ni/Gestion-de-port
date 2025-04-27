import express from 'express';
import { createPoste, getAllPostes, updatePoste, deletePoste } from '../controllers/posteController.js';

const router = express.Router();

router.post('/', createPoste);
router.get('/', getAllPostes);
router.put('/:id', updatePoste);
router.delete('/:id', deletePoste);

export default router;
