// app.js - Merchant Churn Risk Dashboard Core Logic (Static Synthetic Dataset)

// ==========================================
// 1. DATA TYPES & PLAYBOOKS CONFIGURATION
// ==========================================

const PLAYBOOKS = {
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

// ==========================================
// 2. HARDCODED SYNTHETIC PORTFOLIO (24 MERCHANTS)
// Includes the 20 standard merchants + 4 requested test edge cases
// ==========================================

const STATIC_MERCHANT_SEEDS = [
  // --- Standard Merchants ---
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

  // --- Test Edge Cases ---
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
    onboardingDate: "2026-07-10", // onboarded 6 days ago
    monthlyVolume: 1500,
    revenueTrend30d: 0,
    lastLoginDays: 1,
    supportTickets: 0,
    nps: null, // No NPS rating yet
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

// ==========================================
// 3. RISK ENGINE CALCULATIONS
// ==========================================

function calculateRisk(merchant) {
  // 1. Volume Drop Score (40% weight)
  let sVolume = 0;
  if (merchant.revenueTrend30d < 0) {
    sVolume = Math.min(100, Math.abs(merchant.revenueTrend30d) * 2.5);
  }

  // 2. Inactivity Score (30% weight)
  let sInactivity = 0;
  if (merchant.lastLoginDays > 3) {
    sInactivity = Math.min(100, (merchant.lastLoginDays - 3) * 5);
  }

  // 3. Friction Score (30% weight)
  const sTickets = Math.min(100, merchant.supportTickets * 25);
  
  // Safe NPS scoring: if null, undefined, or negative (not surveyed), NPS risk contribution is 0
  let sNps = 0;
  if (merchant.nps !== null && merchant.nps !== undefined && merchant.nps >= 0) {
    sNps = (10 - merchant.nps) * 10;
  }
  
  const sFriction = (0.60 * sTickets) + (0.40 * sNps);

  // Overall Weighted Score
  let score = Math.round((0.40 * sVolume) + (0.30 * sInactivity) + (0.30 * sFriction));

  // --- PRODUCT JUDGMENT OVERRIDES FOR EDGE CASES ---
  // Override 1: Extreme Inactivity (Silent Churn)
  // If a merchant hasn't logged in for 30+ days (sInactivity = 100), they must be at least Medium Risk (score >= 50)
  if (merchant.lastLoginDays >= 30) {
    score = Math.max(50, score);
  }

  // Override 2: Extreme Support Backlog
  // If a merchant has 4+ open support tickets (sTickets = 100), they must be at least Medium Risk (score >= 50)
  if (merchant.supportTickets >= 4) {
    score = Math.max(50, score);
  }

  // Override 3: Catastrophic Volume Decline
  // If a merchant has lost 40% or more of their transaction volume (sVolume = 100), they must be at least Medium Risk (score >= 50)
  if (merchant.revenueTrend30d <= -40) {
    score = Math.max(50, score);
  }

  // Risk Level Assignment
  let level = "Low";
  if (score > 70) {
    level = "High";
  } else if (score > 35) {
    level = "Medium";
  }

  // Determine Primary Churn Driver out of the 4 individual indicators
  // Tie-breaker order: volume > inactivity > support > nps
  let primaryDriver = "healthy";
  let maxVal = 0;

  const triggerScores = {
    volume: sVolume,
    inactivity: sInactivity,
    support: sTickets, // use ticket component directly
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

// Prepare fully calculated seed records
function getInitialMerchants() {
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

// ==========================================
// 4. APPLICATION STATE
// ==========================================

let merchants = [];
let selectedMerchantId = null;

// Initialize data from LocalStorage or retrieve static seed array
function initData() {
  const stored = localStorage.getItem("merchant_churn_dashboard_data");
  if (stored) {
    try {
      merchants = JSON.parse(stored);
      // Ensure risk details are recalculatable and keep structures intact
      merchants = merchants.map(m => {
        const risk = calculateRisk(m);
        return {
          ...m,
          riskScore: risk.score,
          riskLevel: risk.level,
          primaryDriver: risk.primaryDriver,
          riskBreakdown: risk.breakdown
        };
      });
    } catch (e) {
      console.error("Error parsing stored data. Resetting to mock data.", e);
      merchants = getInitialMerchants();
      saveData();
    }
  } else {
    merchants = getInitialMerchants();
    saveData();
  }
}

function saveData() {
  localStorage.setItem("merchant_churn_dashboard_data", JSON.stringify(merchants));
}

function resetData() {
  localStorage.removeItem("merchant_churn_dashboard_data");
  merchants = getInitialMerchants();
  saveData();
  selectedMerchantId = null;
  renderAll();
  closeSidebar();
}

// ==========================================
// 5. RENDERING PIPELINE
// ==========================================

function formatCurrency(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function renderKPIs() {
  let totalValueAtRisk = 0;
  let atRiskCount = 0;
  let totalScoreSum = 0;
  let totalOpenTickets = 0;

  merchants.forEach(m => {
    totalScoreSum += m.riskScore;
    totalOpenTickets += m.supportTickets;
    if (m.riskLevel === "High" || m.riskLevel === "Medium") {
      atRiskCount++;
      if (m.riskLevel === "High") {
        totalValueAtRisk += m.monthlyVolume;
      }
    }
  });

  const avgRiskScore = merchants.length ? Math.round(totalScoreSum / merchants.length) : 0;

  document.getElementById("kpi-value-at-risk").innerText = formatCurrency(totalValueAtRisk);
  document.getElementById("kpi-at-risk-count").innerText = atRiskCount;
  document.getElementById("kpi-avg-score").innerText = avgRiskScore + "/100";
  document.getElementById("kpi-open-tickets").innerText = totalOpenTickets;

  // Add status colors to KPIs if necessary
  const avgEl = document.getElementById("kpi-avg-score-container");
  if (avgRiskScore > 60) {
    avgEl.className = "kpi-card danger";
  } else if (avgRiskScore > 35) {
    avgEl.className = "kpi-card warning";
  } else {
    avgEl.className = "kpi-card success";
  }
}

// Helper to construct the HTML list of checkmarked reasons explaining why a merchant is risky
function getRiskReasonsHTML(m) {
  const reasons = [];

  // 1. Revenue Change
  if (m.revenueTrend30d < 0) {
    reasons.push(`<li class="reason-item text-danger">✓ Revenue down ${Math.abs(m.revenueTrend30d)}%</li>`);
  } else if (m.revenueTrend30d > 0) {
    reasons.push(`<li class="reason-item text-success">✓ Revenue up ${m.revenueTrend30d}%</li>`);
  } else {
    reasons.push(`<li class="reason-item text-success">✓ Revenue stable</li>`);
  }

  // 2. Login Inactivity
  if (m.lastLoginDays > 3) {
    reasons.push(`<li class="reason-item text-danger">✓ No login for ${m.lastLoginDays} days</li>`);
  } else {
    const text = m.lastLoginDays === 0 ? "Login today" : `Login ${m.lastLoginDays} day${m.lastLoginDays > 1 ? 's' : ''} ago`;
    reasons.push(`<li class="reason-item text-success">✓ ${text}</li>`);
  }

  // 3. Support Tickets
  if (m.supportTickets > 0) {
    reasons.push(`<li class="reason-item text-danger">✓ ${m.supportTickets} unresolved ticket${m.supportTickets > 1 ? 's' : ''}</li>`);
  } else {
    reasons.push(`<li class="reason-item text-success">✓ 0 unresolved tickets</li>`);
  }

  // 4. NPS Rating
  if (m.nps === null || m.nps === undefined || m.nps < 0) {
    reasons.push(`<li class="reason-item text-success">✓ No NPS score yet</li>`);
  } else if (m.nps < 7) {
    reasons.push(`<li class="reason-item text-danger">✓ NPS = ${m.nps}</li>`);
  } else {
    reasons.push(`<li class="reason-item text-success">✓ NPS = ${m.nps}</li>`);
  }

  return `
    <div class="reasons-box">
      <span class="reasons-heading">Reasons</span>
      <ul class="risk-reasons-list">${reasons.join('')}</ul>
    </div>
  `;
}

function renderTable() {
  const tbody = document.getElementById("merchant-table-body");
  tbody.innerHTML = "";

  const searchQuery = document.getElementById("search-input").value.toLowerCase();
  const filterRisk = document.getElementById("filter-risk").value;
  const filterTier = document.getElementById("filter-tier").value;
  const filterIndustry = document.getElementById("filter-industry").value;
  const sortBy = document.getElementById("sort-by").value;

  // Filter Data
  let filtered = merchants.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery) || m.id.toLowerCase().includes(searchQuery);
    const matchesRisk = filterRisk === "all" || m.riskLevel === filterRisk;
    const matchesTier = filterTier === "all" || m.tier === filterTier;
    const matchesIndustry = filterIndustry === "all" || m.industry === filterIndustry;
    return matchesSearch && matchesRisk && matchesTier && matchesIndustry;
  });

  // Sort Data
  filtered.sort((a, b) => {
    if (sortBy === "risk-desc") return b.riskScore - a.riskScore;
    if (sortBy === "risk-asc") return a.riskScore - b.riskScore;
    if (sortBy === "volume-desc") return b.monthlyVolume - a.monthlyVolume;
    if (sortBy === "volume-change-desc") return a.revenueTrend30d - b.revenueTrend30d; // most negative first
    if (sortBy === "inactivity-desc") return b.lastLoginDays - a.lastLoginDays;
    return 0;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No merchants match the selected filters.</td></tr>`;
    return;
  }

  filtered.forEach(m => {
    const tr = document.createElement("tr");
    if (m.id === selectedMerchantId) {
      tr.className = "selected-row";
    }

    const playbook = PLAYBOOKS[m.primaryDriver];
    
    // Map status classes
    let statusClass = "status-tag status-needs-outreach";
    if (m.actionStatus === "In Progress") statusClass = "status-tag status-in-progress";
    if (m.actionStatus === "Resolved") statusClass = "status-tag status-resolved";
    if (m.actionStatus === "Unassigned") statusClass = "status-tag status-unassigned";

    tr.innerHTML = `
      <td>
        <div class="merchant-name-cell">
          <span class="merchant-name">${m.name}</span>
          <span class="merchant-id">${m.id}</span>
        </div>
      </td>
      <td>
        <div class="risk-cell-container">
          <span class="risk-badge risk-${m.riskLevel.toLowerCase()}">${m.riskLevel} Risk</span>
          ${getRiskReasonsHTML(m)}
        </div>
      </td>
      <td>
        <div class="score-display">
          <span class="score-num font-bold">${m.riskScore}</span>
          <div class="score-bar-bg"><div class="score-bar risk-${m.riskLevel.toLowerCase()}" style="width: ${m.riskScore}%"></div></div>
        </div>
      </td>
      <td>
        <span class="rec-action-cell" title="${playbook.label}">
          <span class="driver-icon driver-icon-${m.primaryDriver}"></span>
          ${playbook.label}
        </span>
      </td>
      <td>
        <select class="${statusClass} status-select-dropdown" data-id="${m.id}">
          <option value="Unassigned" ${m.actionStatus === "Unassigned" ? "selected" : ""}>Unassigned</option>
          <option value="Needs Outreach" ${m.actionStatus === "Needs Outreach" ? "selected" : ""}>Needs Outreach</option>
          <option value="In Progress" ${m.actionStatus === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Resolved" ${m.actionStatus === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
      </td>
    `;

    // Row Click Listener
    tr.addEventListener("click", (e) => {
      // Don't trigger if changing dropdown
      if (e.target.classList.contains("status-select-dropdown")) return;
      selectMerchant(m.id);
    });

    tbody.appendChild(tr);
  });

  // Re-bind dropdown changes
  document.querySelectorAll(".status-select-dropdown").forEach(dropdown => {
    dropdown.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-id");
      const newStatus = e.target.value;
      updateMerchantStatus(id, newStatus);
    });
  });
}

function selectMerchant(id) {
  selectedMerchantId = id;
  renderTable(); // Update selected styling in table
  renderSidebar();
}

function closeSidebar() {
  selectedMerchantId = null;
  const sidebar = document.getElementById("detail-sidebar");
  sidebar.classList.remove("open");
  
  // Re-enable full width class if grid is responsive
  document.getElementById("main-layout").classList.remove("sidebar-active");
  renderTable();
}

function updateMerchantStatus(id, status) {
  const index = merchants.findIndex(m => m.id === id);
  if (index !== -1) {
    merchants[index].actionStatus = status;
    saveData();
    renderKPIs();
    renderTable();
    if (selectedMerchantId === id) {
      renderSidebar();
    }
  }
}

// Generate the custom SVG line chart for revenue
function generateRevenueChartSVG(volumeHistory) {
  const width = 450;
  const height = 150;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minVolume = Math.min(...volumeHistory) * 0.9;
  const maxVolume = Math.max(...volumeHistory) * 1.1;
  const volumeRange = maxVolume - minVolume || 1;

  const months = ["-5 Mo", "-4 Mo", "-3 Mo", "-2 Mo", "-1 Mo", "Current"];
  
  // Plot coordinates
  const points = volumeHistory.map((val, index) => {
    const x = paddingLeft + (index / (volumeHistory.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((val - minVolume) / volumeRange) * chartHeight;
    return { x, y, val };
  });

  // Create path command
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  // Create filled gradient area path
  let areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  // Draw gridlines
  let gridLines = "";
  const gridCount = 3;
  for (let i = 0; i <= gridCount; i++) {
    const gridY = paddingTop + (i / gridCount) * chartHeight;
    const gridValue = maxVolume - (i / gridCount) * volumeRange;
    gridLines += `
      <line x1="${paddingLeft}" y1="${gridY}" x2="${width - paddingRight}" y2="${gridY}" stroke="var(--border-color)" stroke-dasharray="3,3" />
      <text x="${paddingLeft - 8}" y="${gridY + 4}" text-anchor="end" font-size="10" fill="var(--text-secondary)">$${Math.round(gridValue/1000)}k</text>
    `;
  }

  // X Axis Labels
  let xLabels = "";
  points.forEach((pt, index) => {
    xLabels += `
      <text x="${pt.x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--text-secondary)">${months[index]}</text>
      <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="var(--accent-primary)" stroke="var(--bg-card)" stroke-width="1.5" />
    `;
  });

  // Assemble full SVG
  return `
    <svg width="100%" height="150" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="background: var(--bg-body); border-radius: 8px; border: 1px solid var(--border-color)">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaD}" fill="url(#chartGradient)" />
      <path d="${pathD}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" />
      ${xLabels}
    </svg>
  `;
}

function renderSidebar() {
  const sidebar = document.getElementById("detail-sidebar");
  if (!selectedMerchantId) {
    sidebar.classList.remove("open");
    document.getElementById("main-layout").classList.remove("sidebar-active");
    return;
  }

  const merchant = merchants.find(m => m.id === selectedMerchantId);
  if (!merchant) return;

  // Open sidebar
  sidebar.classList.add("open");
  document.getElementById("main-layout").classList.add("sidebar-active");

  // Populate basic text fields
  document.getElementById("detail-name").innerText = merchant.name;
  document.getElementById("detail-id").innerText = merchant.id;
  document.getElementById("detail-tier").className = `tier-badge tier-${merchant.tier.toLowerCase()}`;
  document.getElementById("detail-tier").innerText = merchant.tier;
  document.getElementById("detail-industry").innerText = merchant.industry;
  document.getElementById("detail-onboarding").innerText = merchant.onboardingDate;
  document.getElementById("detail-monthly-volume").innerText = formatCurrency(merchant.monthlyVolume);

  // Risk Score Gauge Update
  const scoreLabel = document.getElementById("detail-risk-score");
  const scoreLevel = document.getElementById("detail-risk-level");
  
  scoreLabel.innerText = merchant.riskScore;
  scoreLevel.innerText = `${merchant.riskLevel} Risk`;
  scoreLevel.className = `risk-text risk-text-${merchant.riskLevel.toLowerCase()}`;

  // Gauge animation: rotate semi-circle or bar meter
  const gaugeFill = document.getElementById("detail-gauge-fill");
  if (gaugeFill) {
    const radius = 45;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (merchant.riskScore / 100) * circ;
    gaugeFill.style.strokeDasharray = `${circ}`;
    gaugeFill.style.strokeDashoffset = `${offset}`;
    
    // Change stroke color dynamically
    let riskColor = "var(--success-color)";
    if (merchant.riskLevel === "High") riskColor = "var(--danger-color)";
    else if (merchant.riskLevel === "Medium") riskColor = "var(--warning-color)";
    gaugeFill.style.stroke = riskColor;
  }

  // Draw Revenue Chart
  const chartContainer = document.getElementById("detail-revenue-chart-container");
  chartContainer.innerHTML = generateRevenueChartSVG(merchant.volumeHistory);

  // Breakdown sliders
  document.getElementById("driver-volume-bar").style.width = `${merchant.riskBreakdown.volume}%`;
  document.getElementById("driver-volume-val").innerText = merchant.riskBreakdown.volume;
  document.getElementById("driver-inactivity-bar").style.width = `${merchant.riskBreakdown.inactivity}%`;
  document.getElementById("driver-inactivity-val").innerText = merchant.riskBreakdown.inactivity;
  document.getElementById("driver-friction-bar").style.width = `${merchant.riskBreakdown.friction}%`;
  document.getElementById("driver-friction-val").innerText = merchant.riskBreakdown.friction;

  // Triggered signals list
  const signalsList = document.getElementById("detail-triggered-signals");
  signalsList.innerHTML = "";
  
  let signalCount = 0;
  if (merchant.revenueTrend30d < 0) {
    signalCount++;
    signalsList.innerHTML += `
      <li class="signal-item warning-item">
        <span class="signal-icon driver-icon-volume"></span>
        <div class="signal-text">
          <span class="signal-title font-bold">Transaction Volume Decline</span>
          <span class="signal-desc">Processing volume dropped by <span class="text-danger font-bold">${merchant.revenueTrend30d}%</span> over the last 30 days. Value drop of ${formatCurrency(Math.abs(merchant.monthlyVolume * merchant.revenueTrend30d / 100))}.</span>
        </div>
      </li>
    `;
  }
  if (merchant.lastLoginDays > 3) {
    signalCount++;
    signalsList.innerHTML += `
      <li class="signal-item warning-item">
        <span class="signal-icon driver-icon-inactivity"></span>
        <div class="signal-text">
          <span class="signal-title font-bold">Portal Inactivity</span>
          <span class="signal-desc">No merchant login activity recorded for <span class="text-danger font-bold">${merchant.lastLoginDays} days</span> (threshold is 3 days).</span>
        </div>
      </li>
    `;
  }
  if (merchant.supportTickets > 0 || (merchant.nps !== null && merchant.nps !== undefined && merchant.nps < 7)) {
    signalCount++;
    let frictionDetail = [];
    if (merchant.supportTickets > 0) frictionDetail.push(`<span class="text-danger font-bold">${merchant.supportTickets} unresolved support tickets</span>`);
    if (merchant.nps !== null && merchant.nps !== undefined && merchant.nps < 7) frictionDetail.push(`a low NPS satisfaction score of <span class="text-danger font-bold">${merchant.nps}/10</span>`);
    
    signalsList.innerHTML += `
      <li class="signal-item warning-item">
        <span class="signal-icon driver-icon-friction"></span>
        <div class="signal-text">
          <span class="signal-title font-bold">Support & Satisfaction Friction</span>
          <span class="signal-desc">Merchant experiencing friction: ${frictionDetail.join(" and ")}.</span>
        </div>
      </li>
    `;
  }

  if (signalCount === 0) {
    signalsList.innerHTML = `<li class="signal-item healthy-item"><span class="signal-icon success-icon"></span><span class="signal-desc">No risk signals triggered. Merchant metrics are healthy and stable.</span></li>`;
  }

  // Recommended playbook setup
  const playbook = PLAYBOOKS[merchant.primaryDriver];
  document.getElementById("detail-rec-action-label").innerText = playbook.label;
  document.getElementById("detail-rec-why").innerText = playbook.why;

  const checklistContainer = document.getElementById("detail-playbook-checklist");
  checklistContainer.innerHTML = "";
  
  playbook.steps.forEach((step, idx) => {
    const isChecked = merchant.checkedPlaybookItems.includes(idx);
    const li = document.createElement("li");
    li.className = "playbook-step-item";
    li.innerHTML = `
      <label class="checkbox-container">
        <input type="checkbox" class="playbook-checkbox" data-idx="${idx}" ${isChecked ? "checked" : ""}>
        <span class="checkmark"></span>
        <span class="step-text">${step}</span>
      </label>
    `;
    checklistContainer.appendChild(li);
  });

  // Bind playbook checkbox change
  document.querySelectorAll(".playbook-checkbox").forEach(box => {
    box.addEventListener("change", (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      const isChecked = e.target.checked;
      togglePlaybookStep(merchant.id, idx, isChecked);
    });
  });

  // Notes field setup
  const notesField = document.getElementById("detail-notes-input");
  notesField.value = merchant.notes;
  
  // Re-bind save notes button click
  const saveNotesBtn = document.getElementById("detail-save-notes-btn");
  // Remove old event listeners
  const newSaveBtn = saveNotesBtn.cloneNode(true);
  saveNotesBtn.parentNode.replaceChild(newSaveBtn, saveNotesBtn);
  
  newSaveBtn.addEventListener("click", () => {
    saveMerchantNotes(merchant.id, notesField.value);
  });
}

function togglePlaybookStep(merchantId, stepIdx, isChecked) {
  const index = merchants.findIndex(m => m.id === merchantId);
  if (index !== -1) {
    const checked = merchants[index].checkedPlaybookItems || [];
    if (isChecked) {
      if (!checked.includes(stepIdx)) checked.push(stepIdx);
    } else {
      const itemIdx = checked.indexOf(stepIdx);
      if (itemIdx !== -1) checked.splice(itemIdx, 1);
    }
    merchants[index].checkedPlaybookItems = checked;
    saveData();
  }
}

function saveMerchantNotes(merchantId, notesText) {
  const index = merchants.findIndex(m => m.id === merchantId);
  if (index !== -1) {
    merchants[index].notes = notesText;
    saveData();
    // Show toast or temporary success message
    const saveBtn = document.getElementById("detail-save-notes-btn");
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "Saved ✓";
    saveBtn.style.backgroundColor = "var(--success-color)";
    setTimeout(() => {
      saveBtn.innerText = originalText;
      saveBtn.style.backgroundColor = "";
    }, 1500);
  }
}

function renderAll() {
  renderKPIs();
  renderTable();
  if (selectedMerchantId) {
    renderSidebar();
  }
}

// ==========================================
// 6. INITIALIZATION & BINDINGS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Theme selection initialization
  const storedTheme = localStorage.getItem("merchant_churn_theme") || "dark";
  document.documentElement.setAttribute("data-theme", storedTheme);
  updateThemeIcon(storedTheme);

  // Initialize data
  initData();
  renderAll();

  // Search & Filter event bindings
  document.getElementById("search-input").addEventListener("input", renderTable);
  document.getElementById("filter-risk").addEventListener("change", renderTable);
  document.getElementById("filter-tier").addEventListener("change", renderTable);
  document.getElementById("filter-industry").addEventListener("change", renderTable);
  document.getElementById("sort-by").addEventListener("change", renderTable);

  // Close Sidebar Button
  document.getElementById("close-sidebar-btn").addEventListener("click", closeSidebar);

  // Reset Button
  document.getElementById("reset-data-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all modifications to notes, statuses, and playbooks? This will reload default test data.")) {
      resetData();
    }
  });

  // Dark/Light Mode toggle
  document.getElementById("theme-toggle-btn").addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("merchant_churn_theme", newTheme);
    updateThemeIcon(newTheme);
  });
});

function updateThemeIcon(theme) {
  const icon = document.getElementById("theme-toggle-icon");
  if (theme === "dark") {
    icon.innerHTML = `<path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.385 5.385 0 0 1-7.64-7.64A9.04 9.04 0 0 0 12 3Z"/>`; // Moon icon
  } else {
    icon.innerHTML = `<path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3Zm0-5a1 1 0 0 0 1-1V2a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1Zm0 15a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1Zm8-8a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1ZM5 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm13-6.5a1 1 0 0 0-1.41 0l-.7.71a1 1 0 1 0 1.41 1.41l.71-.7a1 1 0 0 0 0-1.42ZM6.71 17.29a1 1 0 0 0-1.42 0l-.7.71a1 1 0 1 0 1.41 1.41l.71-.7a1 1 0 0 0 0-1.42Zm11.29 0a1 1 0 0 0 0-1.41l-.7-.71a1 1 0 1 0-1.41 1.41l.7.7a1 1 0 0 0 1.41 0ZM6.71 6.71a1 1 0 0 0 0-1.41l-.7-.71A1 1 0 1 0 4.59 6l.7.71a1 1 0 0 0 1.42 0Z"/>`; // Sun icon
  }
}
