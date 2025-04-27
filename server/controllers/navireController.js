import Navire from '../models/navire.model.js';

export const createNavire = async (req, res) => {
  try {
    const { nom, etat, type, heure_arrivee, heure_depart, poste } = req.body;
    if (!nom || !etat || !type || !heure_arrivee || !heure_depart || !poste) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    const navire = new Navire({ nom, etat, type, heure_arrivee, heure_depart, poste });
    await navire.save();
    res.status(201).json({ success: true, navire });
  } catch (error) {
    console.error('Navire creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllNavires = async (req, res) => {
  try {
    const navires = await Navire.find().sort({ nom: 1 });
    res.status(200).json({ success: true, navires });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateNavire = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, etat, type, heure_arrivee, heure_depart, poste } = req.body;
    const navire = await Navire.findByIdAndUpdate(id, { nom, etat, type, heure_arrivee, heure_depart, poste }, { new: true });
    if (!navire) return res.status(404).json({ success: false, error: 'Navire not found' });
    res.status(200).json({ success: true, navire });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNavire = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Navire.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Navire not found' });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
