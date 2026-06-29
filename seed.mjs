import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/zenithra");

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    minDeposit: { type: Number, required: true },
    maxDeposit: { type: Number, default: null },
    dailyRoi: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);

// Clear existing plans first
await Plan.deleteMany({});

await Plan.insertMany([
  {
    name: "Starter",
    tagline: "For first-time investors",
    minDeposit: 500,
    maxDeposit: 4999,
    dailyRoi: 1.8,
    durationDays: 30,
    isActive: true,
    features: [
      "Daily payouts",
      "Real-time portfolio tracking",
      "Standard email support",
      "Instant withdrawal requests",
    ],
  },
  {
    name: "Growth",
    tagline: "For serious, hands-on investors",
    minDeposit: 5000,
    maxDeposit: 24999,
    dailyRoi: 2.6,
    durationDays: 45,
    isActive: true,
    features: [
      "Everything in Starter",
      "Automated daily compounding",
      "Dedicated account manager",
      "Priority withdrawal processing",
      "Quarterly strategy review",
    ],
  },
  {
    name: "Elite",
    tagline: "For institutional-grade capital",
    minDeposit: 25000,
    maxDeposit: null,
    dailyRoi: 3.4,
    durationDays: 60,
    isActive: true,
    features: [
      "Everything in Growth",
      "Private wallet allocation",
      "24/7 direct line to portfolio team",
      "Custom investment structuring",
      "Early access to new asset pools",
    ],
  },
]);

console.log("✅ Plans seeded successfully!");
await mongoose.disconnect();