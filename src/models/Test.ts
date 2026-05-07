import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Test || mongoose.model("Test", TestSchema);
