import Marchandise from '../models/marchandise.model.js';

export const createMarchandise = async (req, res) => {
  try {
    console.log('REQ BODY:', req.body); // DEBUG: affiche le body reçu
    const { type, nombre, poids, categories, navire } = req.body;
    if (!type || !nombre || !poids || !categories || !navire) {
      return res.status(400).json({ success: false, error: 'All fields are required (type, nombre, poids, categories, navire).' });
    }
    const marchandise = new Marchandise({ type, nombre, poids, categories, navire });
    await marchandise.save();
    res.status(201).json({ success: true, marchandise });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllMarchandises = async (req, res) => {
  try {
    const marchandises = await Marchandise.find().sort({ type: 1 });
    res.status(200).json({ success: true, marchandises });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateMarchandise = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, nombre, poids, categories } = req.body;
    const marchandise = await Marchandise.findByIdAndUpdate(id, { type, nombre, poids, categories }, { new: true });
    if (!marchandise) return res.status(404).json({ success: false, error: 'Marchandise not found' });
    res.status(200).json({ success: true, marchandise });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteMarchandise = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Marchandise.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Marchandise not found' });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
