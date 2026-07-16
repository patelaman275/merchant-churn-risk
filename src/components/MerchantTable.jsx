import React from 'react';

function RiskReasonsList({ merchant }) {
  const reasons = [];

  // 1. Revenue
  if (merchant.revenueTrend30d < 0) {
    reasons.push({ type: 'danger', text: `Revenue down ${Math.abs(merchant.revenueTrend30d)}%` });
  } else if (merchant.revenueTrend30d > 0) {
    reasons.push({ type: 'success', text: `Revenue up ${merchant.revenueTrend30d}%` });
  } else {
    reasons.push({ type: 'success', text: `Revenue stable` });
  }

  // 2. Inactivity
  if (merchant.lastLoginDays > 3) {
    reasons.push({ type: 'danger', text: `No login for ${merchant.lastLoginDays} days` });
  } else {
    const text = merchant.lastLoginDays === 0 ? "Login today" : `Login ${merchant.lastLoginDays} day${merchant.lastLoginDays > 1 ? 's' : ''} ago`;
    reasons.push({ type: 'success', text: `${text}` });
  }

  // 3. Support Tickets
  if (merchant.supportTickets > 0) {
    reasons.push({ type: 'danger', text: `${merchant.supportTickets} unresolved ticket${merchant.supportTickets > 1 ? 's' : ''}` });
  } else {
    reasons.push({ type: 'success', text: `0 unresolved tickets` });
  }

  // 4. NPS
  if (merchant.nps === null || merchant.nps === undefined || merchant.nps < 0) {
    reasons.push({ type: 'success', text: `No NPS score yet` });
  } else if (merchant.nps < 7) {
    reasons.push({ type: 'danger', text: `NPS = ${merchant.nps}` });
  } else {
    reasons.push({ type: 'success', text: `NPS = ${merchant.nps}` });
  }

  return (
    <div className="reasons-box">
      <span className="reasons-heading">Reasons</span>
      <ul className="risk-reasons-list">
        {reasons.map((r, i) => (
          <li key={i} className={`reason-item ${r.type === 'danger' ? 'text-danger' : 'text-success'}`}>
            ✓ {r.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MerchantTable({ 
  merchants, 
  selectedMerchantId, 
  onSelectMerchant, 
  onStatusChange, 
  playbooks 
}) {
  if (merchants.length === 0) {
    return (
      <div className="table-card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Risk & Reasons</th>
                <th>Score</th>
                <th>Recommended Action</th>
                <th>CS Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="empty-state">
                  No merchants match the selected filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Risk & Reasons</th>
              <th>Score</th>
              <th>Recommended Action</th>
              <th>CS Status</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map(m => {
              const playbook = playbooks[m.primaryDriver];
              const isSelected = m.id === selectedMerchantId;
              
              let statusClass = "status-tag status-needs-outreach";
              if (m.actionStatus === "In Progress") statusClass = "status-tag status-in-progress";
              if (m.actionStatus === "Resolved") statusClass = "status-tag status-resolved";
              if (m.actionStatus === "Unassigned") statusClass = "status-tag status-unassigned";

              return (
                <tr 
                  key={m.id} 
                  className={isSelected ? 'selected-row' : ''}
                  onClick={(e) => {
                    if (e.target.classList.contains("status-select-dropdown")) return;
                    onSelectMerchant(m.id);
                  }}
                >
                  <td>
                    <div className="merchant-name-cell">
                      <span className="merchant-name">{m.name}</span>
                      <span className="merchant-id">{m.id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="risk-cell-container">
                      <span className={`risk-badge risk-${m.riskLevel.toLowerCase()}`}>
                        {m.riskLevel} Risk
                      </span>
                      <RiskReasonsList merchant={m} />
                    </div>
                  </td>
                  <td>
                    <div className="score-display">
                      <span className="score-num font-bold">{m.riskScore}</span>
                      <div className="score-bar-bg">
                        <div 
                          className={`score-bar risk-${m.riskLevel.toLowerCase()}`} 
                          style={{ width: `${m.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="rec-action-cell" title={playbook.label}>
                      <span className={`driver-icon driver-icon-${m.primaryDriver}`}></span>
                      {playbook.label}
                    </span>
                  </td>
                  <td>
                    <select 
                      className={`${statusClass} status-select-dropdown`}
                      value={m.actionStatus}
                      onChange={(e) => onStatusChange(m.id, e.target.value)}
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Needs Outreach">Needs Outreach</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
