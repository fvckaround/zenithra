import mongoose from "mongoose";
import bcrypt from "bcryptjs";

await mongoose.connect("mongodb://127.0.0.1:27017/zenithra");

const User = mongoose.model("User", new mongoose.Schema({
  fullName: String,
  email: String,
  passwordHash: String,
  emailVerified: Boolean,
  balance: Number,
  totalInvested: Number,
  totalEarnings: Number,
  totalWithdrawn: Number,
}, { timestamps: true }));

const existing = await User.findOne({ email: "admin@zenithra.com" });
if (existing) {
  console.log("Admin already exists!");
} else {
  const passwordHash = await bcrypt.hash("Zenithra@Admin2024", 10);
  await User.create({
    fullName: "Admin",
    email: "admin@zenithra.com",
    passwordHash,
    emailVerified: true,
    balance: 0,
    totalInvested: 0,
    totalEarnings: 0,
    totalWithdrawn: 0,
  });
  console.log("✅ Admin created successfully!");
}

await mongoose.disconnect();