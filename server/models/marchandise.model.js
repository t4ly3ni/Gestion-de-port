import mongoose from "mongoose";

const MarchandiseSchema = new mongoose.Schema({
  type: { type: String, required: true },
  nombre: { type: Number, required: true },
  poids: { type: Number, required: true },
  categories: [{ type: String, required: true }],
  navire: { type: mongoose.Schema.Types.ObjectId, ref: "Navire", required: true },
});

const Marchandise = mongoose.model("Marchandise", MarchandiseSchema);
export default Marchandise;
