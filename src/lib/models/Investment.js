import mongoose from "mongoose";

const { Schema } = mongoose;

const InvestmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    principal: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    startDate: { type: Date, required: true },
    maturityDate: { type: Date, required: true },
    // Earnings credited to balance so far for this investment.
    earnedToDate: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Matured", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

InvestmentSchema.index({ user: 1, status: 1 });

export default mongoose.models.Investment ||
  mongoose.model("Investment", InvestmentSchema);
