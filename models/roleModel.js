import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Role name is required"],
    unique: true,
  },
  permissions: [{ type: String }],
});

roleSchema.index({ name: 1 }, { unique: true });

const roleModel = mongoose.models.role || mongoose.model("role", roleSchema);

export default roleModel;
