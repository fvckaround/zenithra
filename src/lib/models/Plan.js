import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    minDeposit: { type: Number, required: true },
    maxDeposit: { type: Number, default: null },
    dailyRoi: { type: Number, required: true }, // percentage e.g. 2.6
    durationDays: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);