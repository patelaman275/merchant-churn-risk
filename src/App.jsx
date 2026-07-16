import React, { useState, useEffect } from 'react';
import KPICards from './components/KPICards';
import MerchantTable from './components/MerchantTable';
import DetailsSidebar from './components/DetailsSidebar';
import { getInitialMerchants, calculateRisk, PLAYBOOKS } from './utils/riskEngine';

export default function App() {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState(null);
  
  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [sortBy, setSortBy] = useState('risk-desc');

  // Theme State
  const [theme, setTheme] = useState('dark');

  // 1. Initialize Theme & Data on mount
  useEffect(() => {
    // Theme
    const storedTheme = localStorage.getItem('merchant_churn_theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);

    // Data
    const storedData = localStorage.getItem('merchant_churn_dashboard_data');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        // Safely recalculate risks in case formula updated
        const calculated = parsed.map(m => {
          const risk = calculateRisk(m);
          return {
            ...m,
            riskScore: risk.score,
            riskLevel: risk.level,
            primaryDriver: risk.primaryDriver,
            riskBreakdown: risk.breakdown
          };
        });
        setMerchants(calculated);
      } catch (e) {
        console.error("Error parsing stored data. Resetting to defaults.", e);
        const seeds = getInitialMerchants();
        setMerchants(seeds);
        localStorage.setItem('merchant_churn_dashboard_data', JSON.stringify(seeds));
      }
    } else {
      const seeds = getInitialMerchants();
      setMerchants(seeds);
      localStorage.setItem('merchant_churn_dashboard_data', JSON.stringify(seeds));
    }
  }, []);

  // Helper to persist current merchant state
  const saveState = (updatedList) => {
    setMerchants(updatedList);
    localStorage.setItem('merchant_churn_dashboard_data', JSON.stringify(updatedList));
  };

  // 2. Action Event Handlers
  const handleStatusChange = (id, newStatus) => {
    const updated = merchants.map(m => m.id === id ? { ...m, actionStatus: newStatus } : m);
    saveState(updated);
  };

  const handleTogglePlaybookStep = (merchantId, stepIdx, isChecked) => {
    const updated = merchants.map(m => {
      if (m.id === merchantId) {
        const steps = m.checkedPlaybookItems || [];
        const updatedSteps = isChecked 
          ? [...steps.filter(s => s !== stepIdx), stepIdx]
          : steps.filter(s => s !== stepIdx);
        return { ...m, checkedPlaybookItems: updatedSteps };
      }
      return m;
    });
    saveState(updated);
  };

  const handleSaveNotes = (merchantId, notesText) => {
    const updated = merchants.map(m => m.id === merchantId ? { ...m, notes: notesText } : m);
    saveState(updated);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all modifications to notes, statuses, and playbooks? This will reload default test data.")) {
      const seeds = getInitialMerchants();
      saveState(seeds);
      setSelectedMerchantId(null);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('merchant_churn_theme', newTheme);
  };

  // 3. Filter & Sort calculations
  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || m.riskLevel === filterRisk;
    const matchesTier = filterTier === 'all' || m.tier === filterTier;
    const matchesIndustry = filterIndustry === 'all' || m.industry === filterIndustry;
    return matchesSearch && matchesRisk && matchesTier && matchesIndustry;
  });

  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
    if (sortBy === "risk-desc") return b.riskScore - a.riskScore;
    if (sortBy === "risk-asc") return a.riskScore - b.riskScore;
    if (sortBy === "volume-desc") return b.monthlyVolume - a.monthlyVolume;
    if (sortBy === "volume-change-desc") return a.revenueTrend30d - b.revenueTrend30d; // most negative first
    if (sortBy === "inactivity-desc") return b.lastLoginDays - a.lastLoginDays;
    return 0;
  });

  const selectedMerchant = merchants.find(m => m.id === selectedMerchantId);

  return (
    <div className="container">
      
      {/* HEADER */}
      <header>
        <div className="header-title-container">
          <div className="logo-icon">▲</div>
          <h1>Merchant Churn Risk Dashboard</h1>
        </div>
        <div className="header-actions">
          <button onClick={handleResetData} className="btn" title="Reset all changes to default mock data">
            Reset App Data
          </button>
          <button onClick={handleThemeToggle} className="btn" aria-label="Toggle theme">
            <svg className="theme-toggle-icon" viewBox="0 0 24 24">
              {theme === 'dark' ? (
                <path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3Zm0-5a1 1 0 0 0 1-1V2a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1Zm0 15a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1Zm8-8a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1ZM5 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm13-6.5a1 1 0 0 0-1.41 0l-.7.71a1 1 0 1 0 1.41 1.41l.71-.7a1 1 0 0 0 0-1.42ZM6.71 17.29a1 1 0 0 0-1.42 0l-.7.71a1 1 0 1 0 1.41 1.41l.71-.7a1 1 0 0 0 0-1.42Zm11.29 0a1 1 0 0 0 0-1.41l-.7-.71a1 1 0 1 0-1.41 1.41l.7.7a1 1 0 0 0 1.41 0ZM6.71 6.71a1 1 0 0 0 0-1.41l-.7-.71A1 1 0 1 0 4.59 6l.7.71a1 1 0 0 0 1.42 0Z"/>
              ) : (
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.385 5.385 0 0 1-7.64-7.64A9.04 9.04 0 0 0 12 3Z"/>
              )}
            </svg>
            Theme
          </button>
        </div>
      </header>

      {/* KPI CARDS (Aggregated over all active merchants) */}
      <KPICards merchants={merchants} />

      {/* FILTERS TOOLBAR */}
      <section className="filter-bar" aria-label="Filters and search">
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by merchant name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="filter-risk">Risk Level</label>
          <select 
            id="filter-risk" 
            className="filter-select"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="all">All Risks</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-tier">Tier</label>
          <select 
            id="filter-tier" 
            className="filter-select"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="all">All Tiers</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Basic">Basic</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-industry">Industry</label>
          <select 
            id="filter-industry" 
            className="filter-select"
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
          >
            <option value="all">All Industries</option>
            <option value="Retail">Retail</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="SaaS">SaaS</option>
            <option value="Services">Services</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">Sort By</label>
          <select 
            id="sort-by" 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="risk-desc">Risk Score (High to Low)</option>
            <option value="risk-asc">Risk Score (Low to High)</option>
            <option value="volume-desc">Processing Volume (High to Low)</option>
            <option value="volume-change-desc">Revenue Decline (Worst First)</option>
            <option value="inactivity-desc">Inactivity (Most to Least)</option>
          </select>
        </div>
      </section>

      {/* DASHBOARD BODY */}
      <main id="main-layout" className={`main-layout ${selectedMerchantId ? 'sidebar-active' : ''}`}>
        <MerchantTable 
          merchants={sortedMerchants}
          selectedMerchantId={selectedMerchantId}
          onSelectMerchant={setSelectedMerchantId}
          onStatusChange={handleStatusChange}
          playbooks={PLAYBOOKS}
        />
        <DetailsSidebar 
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchantId(null)}
          onTogglePlaybookStep={handleTogglePlaybookStep}
          onSaveNotes={handleSaveNotes}
          playbooks={PLAYBOOKS}
        />
      </main>

    </div>
  );
}
