import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Admin name is required"],
  },
  dob: {
    type: Date,
  },
  employmentPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  location_id: { type: Number },
});

const adminModel =
  mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
