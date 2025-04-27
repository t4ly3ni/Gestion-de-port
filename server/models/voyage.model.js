import mongoose from "mongoose";

const VoyageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  date_depart: { type: Date, required: true },
  date_arrivee: { type: Date, required: true },
});

const Voyage = mongoose.model("Voyage", VoyageSchema);
export default Voyage;
