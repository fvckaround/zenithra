// Single source of truth for investment plans — used by the landing page,
// the dashboard, and the investment API so terms can never drift out of sync.

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For first-time investors",
    minDeposit: 500,
    maxDeposit: 4999,
    dailyRate: 0.018, // 1.8% daily
    durationDays: 30,
    popular: false,
    features: [
      "Daily payouts",
      "Real-time portfolio tracking",
      "Standard email support",
      "Instant withdrawal requests",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For serious, hands-on investors",
    minDeposit: 5000,
    maxDeposit: 24999,
    dailyRate: 0.026, // 2.6% daily
    durationDays: 45,
    popular: true,
    features: [
      "Everything in Starter",
      "Automated daily compounding",
      "Dedicated account manager",
      "Priority withdrawal processing",
      "Quarterly strategy review",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "For institutional-grade capital",
    minDeposit: 25000,
    maxDeposit: null, // no upper limit
    dailyRate: 0.034, // 3.4% daily
    durationDays: 60,
    popular: false,
    features: [
      "Everything in Growth",
      "Private wallet allocation",
      "24/7 direct line to portfolio team",
      "Custom investment structuring",
      "Early access to new asset pools",
    ],
  },
];

export function getPlan(id) {
  return PLANS.find((p) => p.id === id) || null;
}
