import mongoose from "mongoose";

const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["Deposit", "Withdrawal", "Earning", "Investment"],
      required: true,
    },
    amount: { type: Number, required: true }, // positive number; sign implied by type
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

TransactionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
