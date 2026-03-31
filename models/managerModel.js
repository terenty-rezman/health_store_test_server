import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Manager name is required"],
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

const managerModel =
  mongoose.models.manager || mongoose.model("manager", managerSchema);

export default managerModel;
