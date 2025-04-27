import Poste from '../models/poste.model.js';

export const createPoste = async (req, res) => {
  try {
    const { nom, etat } = req.body;
    const poste = new Poste({ nom, etat });
    await poste.save();
    res.status(201).json({ success: true, poste });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPostes = async (req, res) => {
  try {
    const postes = await Poste.find().sort({ nom: 1 });
    res.status(200).json({ success: true, postes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePoste = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, etat } = req.body;
    const poste = await Poste.findByIdAndUpdate(id, { nom, etat }, { new: true });
    if (!poste) return res.status(404).json({ success: false, error: 'Quai not found' });
    res.status(200).json({ success: true, poste });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePoste = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Poste.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Quai not found' });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
