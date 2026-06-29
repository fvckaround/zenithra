import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    coin: { type: String, required: true }, // e.g. "Bitcoin", "Ethereum", "USDT"
    symbol: { type: String, required: true }, // e.g. "BTC", "ETH", "USDT"
    address: { type: String, required: true },
    network: { type: String, default: "" }, // e.g. "TRC20", "ERC20"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);