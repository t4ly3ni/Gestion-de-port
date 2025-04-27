import Alerte from '../models/alerte.model.js';

export const createAlerte = async (req, res) => {
  try {
    const { type, message, niveau } = req.body;
    const alerte = new Alerte({ type, message, niveau });
    await alerte.save();
    res.status(201).json({ success: true, alerte });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllAlertes = async (req, res) => {
  try {
    const alertes = await Alerte.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, alertes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAlerte = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Alerte.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Alerte not found' });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
