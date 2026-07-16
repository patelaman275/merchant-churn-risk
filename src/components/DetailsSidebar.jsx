import React, { useState, useEffect } from 'react';

function RevenueChart({ volumeHistory }) {
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

  const points = volumeHistory.map((val, index) => {
    const x = paddingLeft + (index / (volumeHistory.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((val - minVolume) / volumeRange) * chartHeight;
    return { x, y, val };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const gridCount = 3;
  const gridLines = [];
  for (let i = 0; i <= gridCount; i++) {
    const gridY = paddingTop + (i / gridCount) * chartHeight;
    const gridValue = maxVolume - (i / gridCount) * volumeRange;
    gridLines.push({ y: gridY, val: gridValue });
  }

  return (
    <svg width="100%" height="150" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ background: 'var(--bg-body)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0"/>
        </linearGradient>
      </defs>
      {gridLines.map((g, i) => (
        <React.Fragment key={i}>
          <line x1={paddingLeft} y1={g.y} x2={width - paddingRight} y2={g.y} stroke="var(--border-color)" strokeDasharray="3,3" />
          <text x={paddingLeft - 8} y={g.y + 4} textAnchor="end" fontSize="10" fill="var(--text-secondary)">
            ${Math.round(g.val / 1000)}k
          </text>
        </React.Fragment>
      ))}
      <path d={areaD} fill="url(#chartGradient)" />
      <path d={pathD} fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" />
      {points.map((pt, i) => (
        <React.Fragment key={i}>
          <text x={pt.x} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">
            {months[i]}
          </text>
          <circle cx={pt.x} cy={pt.y} r="4" fill="var(--accent-primary)" stroke="var(--bg-card)" strokeWidth="1.5" />
        </React.Fragment>
      ))}
    </svg>
  );
}

export default function DetailsSidebar({ 
  merchant, 
  onClose, 
  onTogglePlaybookStep, 
  onSaveNotes, 
  playbooks 
}) {
  const [notesText, setNotesText] = useState('');
  const [saveStatus, setSaveStatus] = useState('Save Notes');

  // Sync state notes when merchant changes
  useEffect(() => {
    if (merchant) {
      setNotesText(merchant.notes || '');
      setSaveStatus('Save Notes');
    }
  }, [merchant]);

  if (!merchant) {
    return <aside id="detail-sidebar" className="detail-sidebar" aria-label="Merchant details"></aside>;
  }

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  const handleSaveNotes = () => {
    onSaveNotes(merchant.id, notesText);
    setSaveStatus('Saved ✓');
    setTimeout(() => {
      setSaveStatus('Save Notes');
    }, 1500);
  };

  // Circular gauge config
  const radius = 45;
  const circ = 2 * Math.PI * radius;
  const strokeOffset = circ - (merchant.riskScore / 100) * circ;

  let riskColor = "var(--success-color)";
  if (merchant.riskLevel === "High") riskColor = "var(--danger-color)";
  else if (merchant.riskLevel === "Medium") riskColor = "var(--warning-color)";

  const playbook = playbooks[merchant.primaryDriver];

  return (
    <aside id="detail-sidebar" className="detail-sidebar open" aria-label="Merchant details">
      
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-title-container">
          <h2 className="font-bold">{merchant.name}</h2>
          <span className="merchant-id">{merchant.id}</span>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close sidebar">&times;</button>
      </div>

      {/* Profile Details */}
      <div className="detail-profile-grid">
        <div className="profile-item">
          <span className="profile-label">Service Tier</span>
          <span className={`tier-badge tier-${merchant.tier.toLowerCase()}`}>{merchant.tier}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Industry</span>
          <span className="profile-val">{merchant.industry}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Onboarding Date</span>
          <span className="profile-val">{merchant.onboardingDate}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Monthly Volume</span>
          <span className="profile-val">{formatCurrency(merchant.monthlyVolume)}</span>
        </div>
      </div>

      {/* Risk Gauge */}
      <div className="detail-risk-gauge-container">
        <div className="gauge-svg-wrapper">
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="8" />
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              fill="none" 
              stroke={riskColor} 
              strokeWidth="8" 
              strokeLinecap="round" 
              transform="rotate(-90 50 50)" 
              style={{
                transition: 'stroke-dashoffset 0.6s ease',
                strokeDasharray: `${circ}`,
                strokeDashoffset: `${strokeOffset}`
              }}
            />
          </svg>
          <div className="gauge-center-text">
            <span className="gauge-num">{merchant.riskScore}</span>
            <span className="gauge-total">/100</span>
          </div>
        </div>
        <div className="risk-text-label">
          <span className="profile-label">Overall Risk Level</span>
          <span className={`risk-text risk-text-${merchant.riskLevel.toLowerCase()}`}>
            {merchant.riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Breakdown sliders */}
      <div className="drivers-breakdown-container">
        <h3>Risk Drivers Breakdown</h3>
        
        <div className="driver-bar-item">
          <div className="driver-bar-info">
            <span>Volume Decline Risk</span>
            <span className="font-bold">{merchant.riskBreakdown.volume}</span>
          </div>
          <div className="driver-bar-wrapper">
            <div className="driver-fill driver-fill-volume" style={{ width: `${merchant.riskBreakdown.volume}%` }}></div>
          </div>
        </div>
        
        <div className="driver-bar-item">
          <div className="driver-bar-info">
            <span>Portal Inactivity Risk</span>
            <span className="font-bold">{merchant.riskBreakdown.inactivity}</span>
          </div>
          <div className="driver-bar-wrapper">
            <div className="driver-fill driver-fill-inactivity" style={{ width: `${merchant.riskBreakdown.inactivity}%` }}></div>
          </div>
        </div>
        
        <div className="driver-bar-item">
          <div className="driver-bar-info">
            <span>Support & Friction Risk</span>
            <span className="font-bold">{merchant.riskBreakdown.friction}</span>
          </div>
          <div className="driver-bar-wrapper">
            <div className="driver-fill driver-fill-friction" style={{ width: `${merchant.riskBreakdown.friction}%` }}></div>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="detail-trend-section">
        <h3>6-Month Volume Trend</h3>
        <div className="detail-revenue-chart-container">
          <RevenueChart volumeHistory={merchant.volumeHistory} />
        </div>
      </div>

      {/* Warning Signals */}
      <div className="detail-signals-section">
        <h3>Active Warning Signals</h3>
        <ul className="signals-list">
          {merchant.revenueTrend30d < 0 && (
            <li className="signal-item warning-item">
              <span className="signal-icon driver-icon-volume"></span>
              <div className="signal-text">
                <span className="signal-title font-bold">Transaction Volume Decline</span>
                <span className="signal-desc">
                  Processing volume dropped by <span className="text-danger font-bold">{merchant.revenueTrend30d}%</span>.
                  Value drop of {formatCurrency(Math.abs(merchant.monthlyVolume * merchant.revenueTrend30d / 100))}.
                </span>
              </div>
            </li>
          )}
          {merchant.lastLoginDays > 3 && (
            <li className="signal-item warning-item">
              <span className="signal-icon driver-icon-inactivity"></span>
              <div className="signal-text">
                <span className="signal-title font-bold">Portal Inactivity</span>
                <span className="signal-desc">
                  No login activity for <span class="text-danger font-bold">{merchant.lastLoginDays} days</span> (threshold 3d).
                </span>
              </div>
            </li>
          )}
          {(merchant.supportTickets > 0 || (merchant.nps !== null && merchant.nps !== undefined && merchant.nps < 7)) && (
            <li className="signal-item warning-item">
              <span className="signal-icon driver-icon-friction"></span>
              <div className="signal-text">
                <span className="signal-title font-bold">Support & Satisfaction Friction</span>
                <span className="signal-desc">
                  {merchant.supportTickets > 0 && <React.Fragment><span className="text-danger font-bold">{merchant.supportTickets} open ticket{merchant.supportTickets > 1 ? 's' : ''}</span> </React.Fragment>}
                  {merchant.supportTickets > 0 && merchant.nps !== null && merchant.nps !== undefined && merchant.nps < 7 && "and "}
                  {merchant.nps !== null && merchant.nps !== undefined && merchant.nps < 7 && <React.Fragment>low NPS score of <span className="text-danger font-bold">{merchant.nps}/10</span></React.Fragment>}
                </span>
              </div>
            </li>
          )}
          {merchant.revenueTrend30d >= 0 && merchant.lastLoginDays <= 3 && merchant.supportTickets === 0 && (merchant.nps === null || merchant.nps >= 7) && (
            <li className="signal-item healthy-item">
              <span className="signal-icon success-icon"></span>
              <span className="signal-desc">No risk signals triggered. Metrics are healthy.</span>
            </li>
          )}
        </ul>
      </div>

      {/* Recommended Playbook */}
      <div className="detail-playbook-section">
        <div className="playbook-badge-container">
          <span className="playbook-badge">Recommended Playbook</span>
        </div>
        <h2 className="playbook-title">{playbook.label}</h2>
        <p className="playbook-why">{playbook.why}</p>
        
        <hr style={{ margin: '0.75rem 0', border: 0, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
        
        <ul className="playbook-checklist">
          {playbook.steps.map((step, idx) => {
            const isChecked = merchant.checkedPlaybookItems?.includes(idx);
            return (
              <li key={idx} className="playbook-step-item">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    className="playbook-checkbox"
                    checked={!!isChecked}
                    onChange={(e) => onTogglePlaybookStep(merchant.id, idx, e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="step-text">{step}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* CS Notes */}
      <div className="detail-notes-section">
        <h3>Interaction Notes</h3>
        <textarea 
          className="notes-textarea" 
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Add interaction details, call logs, next outreach scheduling..."
        />
        <div className="notes-actions">
          <button 
            className="btn btn-primary"
            onClick={handleSaveNotes}
            style={saveStatus === 'Saved ✓' ? { backgroundColor: 'var(--success-color)' } : {}}
          >
            {saveStatus}
          </button>
        </div>
      </div>

    </aside>
  );
}
