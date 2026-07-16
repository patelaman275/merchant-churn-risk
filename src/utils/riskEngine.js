// src/utils/riskEngine.js - Scoring logic, overrides, playbooks mapping

export const PLAYBOOKS = {
  volume: {
    label: "Offer pricing review",
    why: "Due to a significant drop in month-over-month transaction volume.",
    steps: [
      "Audit transaction logs to check for payment processor error rates or API integration bugs.",
      "Check competitive pricing structures and prepare a customized volume-based pricing discount.",
      "Call the merchant's financial operator to ask about seasonal shifts or changes in their payment processing.",
      "Propose a temporary rate match or platform credit to retain processing volume."
    ]
  },
  inactivity: {
    label: "Schedule onboarding session",
    why: "Due to high login inactivity indicating platform abandonment.",
    steps: [
      "Send a personalized email offering a 1-on-1 portal walkthrough.",
      "Attempt a direct phone call to schedule a live demo/training refresher for their operations team.",
      "Review active feature usage and share training guides for unused modules.",
      "Offer a complimentary 30-minute workspace optimization audit with an integration specialist."
    ]
  },
  support: {
    label: "Escalate support case",
    why: "Due to unresolved support ticket backlog causing merchant frustration.",
    steps: [
      "Review all open support tickets and compile a summary of technical blockers.",
      "Contact the technical support director to expedite resolution on outstanding cases.",
      "Set up an internal Slack alert to track ticket updates from the developer team.",
      "Send an update email to the merchant with concrete ETAs for open support cases."
    ]
  },
  nps: {
    label: "Customer Success outreach",
    why: "Due to low NPS satisfaction scoring indicating customer friction.",
    steps: [
      "Review historical customer satisfaction scores and merchant feedback.",
      "Email the account sponsor to schedule a direct feedback/remedy call.",
      "Address the specific concerns and complaints mentioned in their NPS comments.",
      "Offer a goodwill service fee credit (e.g., 1 month free) as a resolution gesture."
    ]
  },
  healthy: {
    label: "Standard account maintenance",
    why: "Account health is stable and within normal parameters.",
    steps: [
      "Conduct quarterly performance review of account transaction volume.",
      "Verify that merchant contact information and active team members are up to date.",
      "Send periodic newsletter highlighting new platform features.",
      "Log standard wellness check in CRM."
    ]
  }
};

export const STATIC_MERCHANT_SEEDS = [
  {
    id: "MCH-1001",
    name: "FreshMart",
    tier: "Gold",
    industry: "Retail",
    onboardingDate: "2024-01-10",
    monthlyVolume: 32000,
    revenueTrend30d: -38,
    lastLoginDays: 21,
    supportTickets: 4,
    nps: 3,
    volumeHistory: [51600, 48000, 45000, 41000, 38000, 32000]
  },
  {
    id: "MCH-1002",
    name: "ByteSize SaaS",
    tier: "Silver",
    industry: "SaaS",
    onboardingDate: "2025-03-22",
    monthlyVolume: 12500,
    revenueTrend30d: -2,
    lastLoginDays: 14,
    supportTickets: 1,
    nps: 8,
    volumeHistory: [12600, 12700, 12650, 12550, 12600, 12500]
  },
  {
    id: "MCH-1003",
    name: "Quantum Consulting",
    tier: "Platinum",
    industry: "Services",
    onboardingDate: "2023-11-05",
    monthlyVolume: 185000,
    revenueTrend30d: 12,
    lastLoginDays: 1,
    supportTickets: 0,
    nps: 10,
    volumeHistory: [165000, 169000, 172000, 175000, 180000, 185000]
  },
  {
    id: "MCH-1004",
    name: "Crimson Cafe",
    tier: "Basic",
    industry: "Food & Beverage",
    onboardingDate: "2024-08-14",
    monthlyVolume: 8400,
    revenueTrend30d: -8,
    lastLoginDays: 2,
    supportTickets: 5,
    nps: 2,
    volumeHistory: [9130, 9000, 9200, 9100, 8900, 8400]
  },
  {
    id: "MCH-1005",
    name: "Echo Wear",
    tier: "Gold",
    industry: "E-Commerce",
    onboardingDate: "2024-06-19",
    monthlyVolume: 67000,
    revenueTrend30d: -22,
    lastLoginDays: 3,
    supportTickets: 2,
    nps: 7,
    volumeHistory: [86000, 83000, 79000, 75000, 72000, 67000]
  },
  {
    id: "MCH-1006",
    name: "Apex Logistics",
    tier: "Platinum",
    industry: "Services",
    onboardingDate: "2023-04-12",
    monthlyVolume: 245000,
    revenueTrend30d: 4,
    lastLoginDays: 0,
    supportTickets: 1,
    nps: 9,
    volumeHistory: [235000, 238000, 240000, 242000, 243000, 245000]
  },
  {
    id: "MCH-1007",
    name: "Retro Outfitters",
    tier: "Silver",
    industry: "E-Commerce",
    onboardingDate: "2024-11-30",
    monthlyVolume: 19800,
    revenueTrend30d: -30,
    lastLoginDays: 28,
    supportTickets: 3,
    nps: 4,
    volumeHistory: [28300, 26000, 24000, 22000, 21000, 19800]
  },
  {
    id: "MCH-1008",
    name: "Zenith Spa",
    tier: "Basic",
    industry: "Services",
    onboardingDate: "2025-01-05",
    monthlyVolume: 4900,
    revenueTrend30d: 1,
    lastLoginDays: 3,
    supportTickets: 0,
    nps: 9,
    volumeHistory: [4850, 4900, 4920, 4880, 4910, 4900]
  },
  {
    id: "MCH-1009",
    name: "Nebula Tech",
    tier: "Platinum",
    industry: "SaaS",
    onboardingDate: "2023-09-17",
    monthlyVolume: 120000,
    revenueTrend30d: -5,
    lastLoginDays: 4,
    supportTickets: 3,
    nps: 5,
    volumeHistory: [126000, 125000, 124000, 123000, 121000, 120000]
  },
  {
    id: "MCH-1010",
    name: "Alpha Grocer",
    tier: "Gold",
    industry: "Food & Beverage",
    onboardingDate: "2024-05-02",
    monthlyVolume: 56000,
    revenueTrend30d: 2,
    lastLoginDays: 1,
    supportTickets: 1,
    nps: 8,
    volumeHistory: [55000, 55200, 55800, 56000, 55700, 56000]
  },
  {
    id: "MCH-1011",
    name: "Hyperion Gym",
    tier: "Basic",
    industry: "Services",
    onboardingDate: "2024-07-28",
    monthlyVolume: 6200,
    revenueTrend30d: -18,
    lastLoginDays: 5,
    supportTickets: 2,
    nps: 6,
    volumeHistory: [7560, 7300, 7100, 6800, 6500, 6200]
  },
  {
    id: "MCH-1012",
    name: "Indigo Books",
    tier: "Silver",
    industry: "Retail",
    onboardingDate: "2024-03-14",
    monthlyVolume: 15400,
    revenueTrend30d: 0,
    lastLoginDays: 2,
    supportTickets: 0,
    nps: 10,
    volumeHistory: [15400, 15450, 15380, 15420, 15390, 15400]
  },
  {
    id: "MCH-1013",
    name: "Jolt Coffee",
    tier: "Basic",
    industry: "Food & Beverage",
    onboardingDate: "2025-02-18",
    monthlyVolume: 3500,
    revenueTrend30d: -15,
    lastLoginDays: 32,
    supportTickets: 2,
    nps: 5,
    volumeHistory: [4120, 4000, 3950, 3800, 3650, 3500]
  },
  {
    id: "MCH-1014",
    name: "Vanguard Law",
    tier: "Silver",
    industry: "Services",
    onboardingDate: "2023-08-01",
    monthlyVolume: 22000,
    revenueTrend30d: 5,
    lastLoginDays: 1,
    supportTickets: 0,
    nps: 9,
    volumeHistory: [21000, 21200, 21500, 21700, 21900, 22000]
  },
  {
    id: "MCH-1015",
    name: "Elevate SaaS",
    tier: "Gold",
    industry: "SaaS",
    onboardingDate: "2024-04-11",
    monthlyVolume: 84000,
    revenueTrend30d: -32,
    lastLoginDays: 7,
    supportTickets: 4,
    nps: 4,
    volumeHistory: [123500, 115000, 108000, 99000, 92000, 84000]
  },
  {
    id: "MCH-1016",
    name: "Oasis Flora",
    tier: "Basic",
    industry: "Retail",
    onboardingDate: "2024-10-09",
    monthlyVolume: 5100,
    revenueTrend30d: -3,
    lastLoginDays: 16,
    supportTickets: 1,
    nps: 7,
    volumeHistory: [5260, 5300, 5250, 5200, 5150, 5100]
  },
  {
    id: "MCH-1017",
    name: "Prism Gallery",
    tier: "Silver",
    industry: "Services",
    onboardingDate: "2023-12-15",
    monthlyVolume: 18200,
    revenueTrend30d: 3,
    lastLoginDays: 2,
    supportTickets: 0,
    nps: 9,
    volumeHistory: [17600, 17800, 17900, 18100, 18000, 18200]
  },
  {
    id: "MCH-1018",
    name: "Saffron Spices",
    tier: "Silver",
    industry: "Food & Beverage",
    onboardingDate: "2024-02-28",
    monthlyVolume: 16500,
    revenueTrend30d: -45,
    lastLoginDays: 6,
    supportTickets: 2,
    nps: 6,
    volumeHistory: [30000, 27500, 24000, 21000, 19000, 16500]
  },
  {
    id: "MCH-1019",
    name: "Beacon Tutoring",
    tier: "Basic",
    industry: "Services",
    onboardingDate: "2025-04-03",
    monthlyVolume: 7200,
    revenueTrend30d: 1,
    lastLoginDays: 1,
    supportTickets: 1,
    nps: 9,
    volumeHistory: [7100, 7150, 7200, 7180, 7220, 7200]
  },
  {
    id: "MCH-1020",
    name: "Driftwood Furniture",
    tier: "Gold",
    industry: "Retail",
    onboardingDate: "2024-09-20",
    monthlyVolume: 43000,
    revenueTrend30d: -6,
    lastLoginDays: 3,
    supportTickets: 4,
    nps: 5,
    volumeHistory: [45700, 45200, 44800, 44200, 43900, 43000]
  },
  {
    id: "MCH-1021",
    name: "Merchant A (Active Vol-Drop)",
    tier: "Gold",
    industry: "SaaS",
    onboardingDate: "2024-05-10",
    monthlyVolume: 50000,
    revenueTrend30d: -40,
    lastLoginDays: 0,
    supportTickets: 0,
    nps: 9,
    volumeHistory: [83300, 78000, 72000, 65000, 58000, 50000]
  },
  {
    id: "MCH-1022",
    name: "Merchant B (Silent Abandon)",
    tier: "Platinum",
    industry: "Retail",
    onboardingDate: "2023-12-01",
    monthlyVolume: 75000,
    revenueTrend30d: 5,
    lastLoginDays: 60,
    supportTickets: 0,
    nps: 8,
    volumeHistory: [71000, 72000, 71500, 73000, 74000, 75000]
  },
  {
    id: "MCH-1023",
    name: "Merchant C (New Joiner)",
    tier: "Basic",
    industry: "Services",
    onboardingDate: "2026-07-10",
    monthlyVolume: 1500,
    revenueTrend30d: 0,
    lastLoginDays: 1,
    supportTickets: 0,
    nps: null,
    volumeHistory: [1500, 1500, 1500, 1500, 1500, 1500]
  },
  {
    id: "MCH-1024",
    name: "Merchant D (Support Backlog)",
    tier: "Silver",
    industry: "E-Commerce",
    onboardingDate: "2024-02-15",
    monthlyVolume: 35000,
    revenueTrend30d: 2,
    lastLoginDays: 1,
    supportTickets: 5,
    nps: 9,
    volumeHistory: [34000, 34500, 34200, 34600, 34800, 35000]
  }
];

export function calculateRisk(merchant) {
  let sVolume = 0;
  if (merchant.revenueTrend30d < 0) {
    sVolume = Math.min(100, Math.abs(merchant.revenueTrend30d) * 2.5);
  }

  let sInactivity = 0;
  if (merchant.lastLoginDays > 3) {
    sInactivity = Math.min(100, (merchant.lastLoginDays - 3) * 5);
  }

  const sTickets = Math.min(100, merchant.supportTickets * 25);
  
  let sNps = 0;
  if (merchant.nps !== null && merchant.nps !== undefined && merchant.nps >= 0) {
    sNps = (10 - merchant.nps) * 10;
  }
  
  const sFriction = (0.60 * sTickets) + (0.40 * sNps);

  let score = Math.round((0.40 * sVolume) + (0.30 * sInactivity) + (0.30 * sFriction));

  // Overrides
  if (merchant.lastLoginDays >= 30) {
    score = Math.max(50, score);
  }
  if (merchant.supportTickets >= 4) {
    score = Math.max(50, score);
  }
  if (merchant.revenueTrend30d <= -40) {
    score = Math.max(50, score);
  }

  let level = "Low";
  if (score > 70) {
    level = "High";
  } else if (score > 35) {
    level = "Medium";
  }

  let primaryDriver = "healthy";
  let maxVal = 0;

  const triggerScores = {
    volume: sVolume,
    inactivity: sInactivity,
    support: sTickets,
    nps: sNps
  };

  for (const [key, val] of Object.entries(triggerScores)) {
    if (val > maxVal) {
      maxVal = val;
      primaryDriver = key;
    }
  }

  if (maxVal === 0) {
    primaryDriver = "healthy";
  }

  return {
    score,
    level,
    primaryDriver,
    breakdown: {
      volume: Math.round(sVolume),
      inactivity: Math.round(sInactivity),
      friction: Math.round(sFriction)
    }
  };
}

export function getInitialMerchants() {
  return STATIC_MERCHANT_SEEDS.map((m, index) => {
    const risk = calculateRisk(m);
    return {
      ...m,
      actionStatus: index % 6 === 0 ? "In Progress" : index % 9 === 0 ? "Resolved" : "Needs Outreach",
      notes: "",
      checkedPlaybookItems: [],
      riskScore: risk.score,
      riskLevel: risk.level,
      primaryDriver: risk.primaryDriver,
      riskBreakdown: risk.breakdown
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}
