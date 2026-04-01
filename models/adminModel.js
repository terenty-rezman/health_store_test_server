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
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  location_id: { type: Number },
  admin_id: { type: Number, required: true },
});

adminSchema.index({ admin_id: 1 }, { unique: true });

const adminModel =
  mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
