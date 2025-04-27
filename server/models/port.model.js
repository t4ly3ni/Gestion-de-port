import mongoose from "mongoose";

const PortSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  localisation: { type: String, required: true },
  capacite: { type: Number, required: true },
  navires: [{ type: mongoose.Schema.Types.ObjectId, ref: "Navire", required: true }],
  marchandises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Marchandise", required: true }],
  postes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poste", required: true }],
});

const Port = mongoose.model("Port", PortSchema);
export default Port;
