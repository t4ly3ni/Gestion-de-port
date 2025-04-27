import mongoose from "mongoose";

const NavireSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  etat: { type: String, required: true },
  type: { type: String, required: true },
  heure_arrivee: { type: Date, required: true },
  heure_depart: { type: Date, required: true },
  poste: { type: mongoose.Schema.Types.ObjectId, ref: "Poste", required: true },
});

const Navire = mongoose.model("Navire", NavireSchema);
export default Navire;
