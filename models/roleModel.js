import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, "Role name is required"],
  },
});

roleSchema.index({ role: 1 }, { unique: true });

const roleModel = mongoose.models.role || mongoose.model("role", roleSchema);

export default roleModel;
