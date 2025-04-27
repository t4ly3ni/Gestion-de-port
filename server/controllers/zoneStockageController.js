import ZoneStockage from '../models/zone_stockage.model.js';

export const createZoneStockage = async (req, res) => {
  try {
    console.log('REQ BODY:', req.body); // DEBUG: affiche le body reçu
    const { nom, capacite, marchandise, temps } = req.body;
    // Correction de la condition de validation
    if (!nom || capacite == null || !marchandise || !temps) {
      return res.status(400).json({ success: false, error: 'All fields are required (nom, capacite, marchandise, temps).' });
    }
    const zone = new ZoneStockage({ nom, capacite, marchandise, temps });
    await zone.save();
    res.status(201).json({ success: true, zone });
  } catch (error) {
    console.error('Erreur lors de la création de la zone de stockage:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllZonesStockage = async (req, res) => {
  try {
    const zones = await ZoneStockage.find().sort({ nom: 1 });
    res.status(200).json({ success: true, zones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateZoneStockage = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, capacite, marchandise, temps } = req.body;
    const zone = await ZoneStockage.findByIdAndUpdate(id, { nom, capacite, marchandise, temps }, { new: true });
    if (!zone) return res.status(404).json({ success: false, error: 'Zone not found' });
    res.status(200).json({ success: true, zone });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteZoneStockage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ZoneStockage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Zone not found' });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
