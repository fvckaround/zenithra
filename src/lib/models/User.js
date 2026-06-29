import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },

    emailVerified: { type: Boolean, default: false },

    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpPurpose: { type: String, enum: ["verify", "reset", null], default: null },

    balance: { type: Number, default: 0 },
    totalInvested: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },

    referralCode: { type: String, unique: true, sparse: true, index: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    kycFrontImage: { type: String, default: null },
    kycBackImage: { type: String, default: null },
    kycRejectedReason: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);