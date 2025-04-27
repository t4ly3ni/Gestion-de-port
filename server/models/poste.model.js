import mongoose from "mongoose";

const PosteSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  etat: { type: String, required: true },
});

const Poste = mongoose.model("Poste", PosteSchema);
export default Poste;
