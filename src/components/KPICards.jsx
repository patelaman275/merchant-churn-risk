import React from 'react';

export default function KPICards({ merchants }) {
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

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  let avgClass = "kpi-card success";
  if (avgRiskScore > 60) {
    avgClass = "kpi-card danger";
  } else if (avgRiskScore > 35) {
    avgClass = "kpi-card warning";
  }

  return (
    <section class="kpi-container" aria-label="Key Performance Indicators">
      <div class="kpi-card danger">
        <span class="kpi-title">Value at Risk (High Churn)</span>
        <span class="kpi-value">{formatCurrency(totalValueAtRisk)}</span>
      </div>
      <div class="kpi-card warning">
        <span class="kpi-title">At-Risk Merchants</span>
        <span class="kpi-value">{atRiskCount}</span>
      </div>
      <div class={`${avgClass}`}>
        <span class="kpi-title">Average Risk Score</span>
        <span class="kpi-value">{avgRiskScore}/100</span>
      </div>
      <div class="kpi-card info">
        <span class="kpi-title">Open Support Tickets</span>
        <span class="kpi-value">{totalOpenTickets}</span>
      </div>
    </section>
  );
}
