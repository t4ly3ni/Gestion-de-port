import Temps from '../models/temps.model.js';

export const createTemps = async (req, res) => {
  try {
    const { temps_de_chargement, temps_de_dechargement } = req.body;
    if (temps_de_chargement == null || temps_de_dechargement == null) {
      return res.status(400).json({ success: false, error: 'Tous les champs sont requis.' });
    }
    const temps = new Temps({ temps_de_chargement, temps_de_dechargement });
    await temps.save();
    res.status(201).json({ success: true, temps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllTemps = async (req, res) => {
  try {
    const temps = await Temps.find().sort({ temps_de_chargement: 1 });
    res.status(200).json({ success: true, temps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
