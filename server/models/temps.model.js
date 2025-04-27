import mongoose from "mongoose";

const TempsSchema = new mongoose.Schema({
  temps_de_chargement: { type: Number, required: true },
  temps_de_dechargement: { type: Number, required: true },
});

const Temps = mongoose.model("Temps", TempsSchema);
export default Temps;
