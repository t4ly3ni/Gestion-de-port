import mongoose from "mongoose";

const AlerteSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  niveau: { type: String, required: true },
});

const Alerte = mongoose.model("Alerte", AlerteSchema);
export default Alerte;
