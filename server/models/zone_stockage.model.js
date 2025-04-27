import mongoose from "mongoose";

const ZoneStockageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  capacite: { type: Number, required: true },
  marchandise: { type: mongoose.Schema.Types.ObjectId, ref: "Marchandise", required: true },
  temps: { type: mongoose.Schema.Types.ObjectId, ref: "Temps", required: true },
});

const ZoneStockage = mongoose.model("ZoneStockage", ZoneStockageSchema);
export default ZoneStockage;
