import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    amount: { type: Number, required: true },
    coin: { type: String, required: true },
    walletAddress: { type: String, default: "" },
    txHash: { type: String, default: "" },
    proofImage: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema);