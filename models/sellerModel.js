import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Seller name is required"],
  },
  dob: {
    type: Date,
  },
  employmentPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  location_id: { type: Number },
  telegram_id: { type: Number },
});

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel;
