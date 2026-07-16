# Product Requirements Document: Merchant Churn Risk Dashboard

**Document Version:** 1.0.0  
**Date:** July 16, 2026  
**Status:** Approved  
**Author:** CX Product Management Team  

---

## 1. Project Overview
The **Merchant Churn Risk Dashboard** is a high-fidelity, frontend-only web application designed for Customer Experience (CX) and Customer Success (CS) teams. The application serves as an interactive command center that consolidates scattered churn indicators, calculates a dynamic risk rating for each merchant, and provides tailored, actionable playbooks to prevent merchant attrition. Since it is frontend-only, all computations, data storage, and state management run entirely within the client's browser, utilizing a rich set of pre-populated synthetic merchant data.

---

## 2. Problem Statement
Customer Experience teams manage hundreds of merchants, making it impossible to manually check in on every account regularly. Critical warning signs of merchant churn—such as dropping transaction volumes, lack of system login activity, low NPS scores, or a backlog of unresolved customer support tickets—are currently siloed. Without a single pane of glass, CX managers are forced to be reactive, often finding out a merchant has decided to leave after they have already stopped using the platform. To minimize revenue leakage, the CX team needs a proactive, prioritized view of at-risk merchants and clear playbooks for immediate retention outreach.

---

## 3. Objectives
*   **Centralize Health Signals:** Unify transactional, behavioral, and support metrics into a single, intuitive interface.
*   **Prioritize Outreach:** Automatically flag and sort merchants based on a calculated churn risk score, focusing team effort where it is needed most.
*   **Facilitate Swift Action:** Provide context-specific "Next Best Action" guidelines and interactive checklists for each merchant.
*   **Ensure Data Portability & Independence:** Build a self-contained web app that works out of the box without complex server setup, making it ideal for immediate deployment and testing.
*   **Track Progress in Real Time:** Enable CX agents to update action statuses and document notes directly on the dashboard, with automatic local persistence.

---

## 4. Users
*   **Customer Success Managers (CSMs) / CX Specialists:** The primary users. They log in daily, view high-risk merchants, review recommended actions, execute outreach, and update the status of retention tasks.
*   **CX Directors / Team Leads:** Secondary users. They review aggregated team KPIs (such as overall churn rate and total value at risk) and audit notes left by CSMs to monitor overall account health.

---

## 5. Functional Requirements

### 5.1 Data Management & State Persistence
*   **Pre-populated Dataset:** The application must load a robust, realistic dataset of at least 50 mock merchants upon first load.
*   **Data Distribution:** The mock dataset must cover a realistic distribution of industries, tier levels (Basic, Silver, Gold, Platinum), and churn risk profiles (Low, Medium, High).
*   **State Persistence:** Any state changes made by the user—including marking a recommended action checklist item as complete, changing the account outreach status, or writing interaction notes—must persist locally using the browser's `LocalStorage`. A refresh of the page must not wipe out the user's modifications.
*   **Reset State Capability:** Provide a "Reset App Data" option to wipe local modifications and restore the default mock dataset state.

### 5.2 Dynamic Risk Scoring Engine
*   The application must dynamically compute a Churn Risk Score (0-100) for each merchant using their metric attributes (see Section 8). If a user edits notes or changes metrics, the score must update automatically.

### 5.3 Interactive Workspace Layout
*   **KPI Cards Panel:** Display high-level aggregate metrics at the top of the page to give immediate business context.
*   **Merchant Grid/Table:** A responsive main table displaying all merchants with key fields (Name, Tier, Industry, Risk Level, Risk Score, Primary Driver, Action Status).
*   **Detail Sidebar / Panel:** Clicking any merchant row must slide open a detail panel containing granular customer profile information, trend charts, and execution playbooks without navigating away from the current list.

---

## 6. Non-Functional Requirements

### 6.1 Usability & Visual Aesthetics
*   **UI Style:** Modern, premium dashboard with a cohesive dark-mode/light-mode design system. It should use clean typography, subtle drop-shadows, and smooth micro-interactions (e.g., hover states, sidebar slide-ins).
*   **Risk Color Coding:** Use semantic coloring for risk indicators:
    *   **High Risk:** Dark Red / Coral
    *   **Medium Risk:** Orange / Amber
    *   **Low Risk:** Green / Emerald
*   **Responsiveness:** The layout must adapt gracefully to desktop and tablet viewports.

### 6.2 Performance & Speed
*   **Zero-latency Filters:** All search, sort, and filter operations must execute client-side instantly (< 100ms).
*   **Load Time:** The initial page load, including parsing the mock data, must take less than 1.5 seconds.

### 6.3 Technical Portability
*   **Frontend-only:** The project must contain no backend code, databases, or API dependencies that require server setup. It must run on standard browsers (Chrome, Safari, Edge, Firefox) by opening a static index file or serving it locally.

---

## 7. Merchant Data Model

| Field Name | Data Type | Description | Allowed Values / Constraints |
| :--- | :--- | :--- | :--- |
| `id` | String | Unique identifier for the merchant. | Format: `MCH-XXXX` (e.g., `MCH-1029`) |
| `name` | String | Legal trading name of the merchant. | Non-empty string |
| `tier` | Enum | Customer tier based on contract value. | `Basic`, `Silver`, `Gold`, `Platinum` |
| `industry` | Enum | Vertical business sector of the merchant. | `Retail`, `E-Commerce`, `Food & Beverage`, `SaaS`, `Services` |
| `onboardingDate` | Date String | The date the merchant joined the platform. | Format: `YYYY-MM-DD` |
| `monthlyVolume` | Number | Transaction volume processed in the last 30 days (USD). | Positive number |
| `volumeChangeMoM` | Number | Percentage change in volume compared to the previous 30 days. | Range: `-100%` to `+500%` |
| `loginInactivityDays`| Number | Number of consecutive days since any staff member logged in. | Non-negative integer |
| `openSupportTickets` | Number | Number of active unresolved customer support tickets. | Non-negative integer |
| `npsScore` | Number | Net Promoter Score rating given by the merchant (0-10). | Integer from `0` to `10` |
| `actionStatus` | Enum | Outreach and resolution status tracked by CSM. | `Unassigned`, `Needs Outreach`, `In Progress`, `Resolved` |
| `notes` | String | Rich-text or plain-text logs recorded by the CSM. | Max length: 2000 characters |

---

## 8. Churn Risk Methodology

The overall **Churn Risk Score** is a weighted index calculated on a scale of `0` to `100`. It is derived from three primary components: **Volume Decline**, **Product Inactivity**, and **Support Friction**.

### 8.1 Formula
$$\text{Risk Score} = (0.40 \times S_{\text{volume}}) + (0.30 \times S_{\text{inactivity}}) + (0.30 \times S_{\text{friction}})$$

### 8.2 Component Scoring Logic

#### 1. Volume Drop Score ($S_{\text{volume}}$)
Measures the loss of transaction volume. Dropping volume is the strongest indicator of churn.
*   If MoM Volume Change is positive or zero ($\ge 0\%$), then $S_{\text{volume}} = 0$.
*   If MoM Volume Change is negative, the score scales linearly up to $100$:
    $$S_{\text{volume}} = \min\left(100, \left| \text{volumeChangeMoM} \right| \times 2.5\right)$$
    *(E.g., a $-20\%$ drop = score of $50$; a $-40\%$ drop or worse = score of $100$)*.

#### 2. Inactivity Score ($S_{\text{inactivity}}$)
Measures platform abandonment.
*   If inactivity is $\le 3$ days, $S_{\text{inactivity}} = 0$.
*   If inactivity is $> 3$ days, the score increases by $5$ points per day, capped at $100$:
    $$S_{\text{inactivity}} = \min\left(100, (\text{loginInactivityDays} - 3) \times 5\right)$$
    *(E.g., $10$ days inactive = score of $35$; $23$ or more days inactive = score of $100$)*.

#### 3. Support Friction Score ($S_{\text{friction}}$)
Measures merchant frustration based on open support issues and historical satisfaction.
*   Derived from open tickets and Net Promoter Score (NPS):
    $$S_{\text{friction}} = \left( 0.60 \times S_{\text{tickets}} \right) + \left( 0.40 \times S_{\text{nps}} \right)$$
    Where:
    *   $S_{\text{tickets}} = \min\left(100, \text{openSupportTickets} \times 25\right)$ *(4+ tickets maximizes this sub-score)*
    *   $S_{\text{nps}} = (10 - \text{npsScore}) \times 10$ *(An NPS of 10 gives 0 risk points, while NPS of 0 gives 100 points)*.

---

## 9. Risk Score Ranges

The numerical score is categorized into three qualitative risk levels, which dictate UI styling and prioritization:

*   **High Risk (Score: 71 - 100):** Red alert tag. Indicates critical platform abandonment, catastrophic transaction volume drop, or high ticket backlog. CSMs must prioritize these accounts first.
*   **Medium Risk (Score: 36 - 70):** Yellow/Orange alert tag. Indicates deteriorating engagement or minor transaction volume decline. Recommended for routine weekly check-in or automated retention playbooks.
*   **Low Risk (Score: 0 - 35):** Green tag. Indicates stable accounts with active usage and normal transaction volumes. No immediate CX action required.

---

## 10. Recommendation Strategy

A merchant's recommended **Next Best Action** is dynamically determined by identifying their highest risk component score among $S_{\text{volume}}$, $S_{\text{inactivity}}$, and $S_{\text{friction}}$. If there is a tie, prioritize in the order of the weights: Volume > Inactivity > Friction.

### 10.1 Retention Playbook Directory

#### Playbook A: Revenue Recovery Review
*   **Trigger:** Volume Drop Score ($S_{\text{volume}}$) is the primary driver of risk.
*   **Action Label:** "Schedule Revenue Recovery Review"
*   **Checkbox Action Steps:**
    1.  [ ] Audit transaction logs to check for payment processor error rates or API integration bugs.
    2.  [ ] Check competitive pricing structures and prepare a customized volume-based pricing discount.
    3.  [ ] Call the merchant's financial operator to ask about seasonal shifts or changes in their payment processing.
    4.  [ ] Propose a feature upgrade (e.g., multi-currency or fraud-prevention tools) to restore volume.

#### Playbook B: Platform Re-engagement Outreach
*   **Trigger:** Inactivity Score ($S_{\text{inactivity}}$) is the primary driver of risk.
*   **Action Label:** "Launch Re-engagement Campaign"
*   **Checkbox Action Steps:**
    1.  [ ] Send a personalized re-engagement email with an overview of new platform features.
    2.  [ ] Attempt a direct phone call to schedule a live demo/training refresher for their operations team.
    3.  [ ] Review user access permissions to ensure key staff members have active account access.
    4.  [ ] Offer a complimentary 30-minute workspace optimization audit with an integration specialist.

#### Playbook C: Support Escalate & Recover
*   **Trigger:** Support Friction Score ($S_{\text{friction}}$) is the primary driver of risk.
*   **Action Label:** "Escalate Support Tickets & Book Exec Call"
*   **Checkbox Action Steps:**
    1.  [ ] Review all open tickets and contact the Technical Support Director to expedite resolution.
    2.  [ ] Prepare a summary of resolved issues and outstanding bugs to share with the merchant.
    3.  [ ] Schedule a face-to-face video call with the merchant's executive sponsor.
    4.  [ ] Offer a service level credit (e.g., one month of free processing fees) as a gesture of goodwill.

---

## 11. Dashboard Features

### 11.1 KPI Dashboard Cards (Top Panel)
*   **Total Value at Risk:** Sum of `monthlyVolume` for all merchants classified as "High Risk."
*   **At-Risk Merchants Count:** Number of merchants currently marked "High Risk" or "Medium Risk."
*   **Average Churn Risk Score:** The mean churn risk score across the entire active merchant portfolio.
*   **Outstanding Tickets:** Total count of open support tickets across all merchants.

### 11.2 Merchant List (Main Panel)
*   **Data Grid:** Interactive table display.
*   **Visual Badges:** Color-coded badges for Tier (e.g., Gold - Metallic Gold; Platinum - Deep Silver) and Risk Levels.
*   **Quick Actions:** Quick dropdown to change `actionStatus` directly from the row.

### 11.3 Interactive Details Sidebar (Slide-Out Panel)
*   **Profile Section:** Displays merchant name, ID, onboarding date, tier, and contact information.
*   **Metric Graphs:** Visual representation (e.g., a simple line or bar chart) showing:
    *   Transaction Volume over time.
    *   Login frequency or inactivity trends.
*   **Risk Breakdown:** A visualization (like a horizontal breakdown or gauge) showing how $S_{\text{volume}}$, $S_{\text{inactivity}}$, and $S_{\text{friction}}$ contributed to the overall score.
*   **Interactive Playbook Checklist:** Step-by-step checklist matching the recommended strategy (Section 10). The CSM can check off items, and their checked state will persist.
*   **Notes Section:** Text area allowing CSMs to save interaction history. Includes a "Save Note" button which updates the timestamped logs list for the merchant.

---

## 12. Filters and Search
To facilitate navigation through large portfolios, the dashboard must feature a top-level sticky filtering bar:

*   **Search Input:** Real-time text search. Matches against:
    *   Merchant Name
    *   Merchant ID (`MCH-XXXX`)
*   **Risk Level Filter:** Dropdown to filter by `High Risk`, `Medium Risk`, or `Low Risk` (multiselect preferred).
*   **Tier Filter:** Dropdown to filter by contract tier (`Basic`, `Silver`, `Gold`, `Platinum`).
*   **Industry Filter:** Dropdown to filter by sector (`Retail`, `E-Commerce`, etc.).
*   **Table Sorters:** Clicking on column headers must toggle ascending/descending order for:
    *   Risk Score (default sort: Descending)
    *   Monthly Volume (USD)
    *   MoM Change (%)
    *   Inactivity Days

---

## 13. Assumptions
*   **Frontend Execution:** The application runs as a single-page app or static bundle. No network-based database reads/writes are required; state persistence relies entirely on client-side storage mechanisms.
*   **Deterministic Scores:** The churn risk calculation runs on the client upon data load and recalculates dynamically if metrics change, ensuring consistent presentation.
*   **Browser Storage Limits:** The volume of data (approx. 50-100 merchants) is small enough to fit well within standard `LocalStorage` boundaries (typically 5MB).

---

## 14. Constraints
*   **Security & PII:** Since the application is hosted on static pages (such as GitHub Pages or Vercel) and has public visibility, the dataset must not include real merchant details or PII (e.g., real names, phone numbers, or emails).
*   **No Multi-User Sync:** Because state is stored in the local browser cache, updates made by one CSM will not sync with another CSM's device. This is acceptable for the v1 prototype stage.

---

## 15. Future Improvements
*   **Backend Integration:** Connect to live billing systems (e.g., Stripe, Recurly) and CRM platforms (e.g., Salesforce, Zendesk) via standard webhooks/APIs.
*   **Machine Learning Scores:** Transition from static weighted formulas to predictive machine learning models trained on historical churn logs.
*   **Outreach Automations:** Add "Send Email" or "Open Slack Alert" actions directly from the playbook checklist to trigger automated customer communications.
*   **Multi-tenant Collaboration:** Introduce cloud database syncing and role-based access control (RBAC) to allow multiple CSMs to collaborate on the same portfolio.

---

## 16. Acceptance Criteria
1.  **Initial Load & Rendering:** On opening the page, the application displays the mock database of merchants instantly, with the top-level KPI cards displaying accurate summary statistics.
2.  **Risk Score Accuracy:** The calculated Risk Score for each merchant matches the weighted logic outlined in Section 8.
3.  **Real-Time Filtration:** Typing a name in search or selecting a filter immediately filters the visible merchant table without requiring a page reload.
4.  **Sidebar Interactions:** Clicking a table row correctly slides open the detail sidebar showing the details, graphs, and the playbook corresponding to the merchant's highest risk driver.
5.  **State Retention:** Editing notes, ticking off playbook items, or changing the outreach status of a merchant remains saved even after a full browser refresh (F5).
6.  **Reset Capability:** Clicking the "Reset App Data" option successfully clears all user edits and re-initializes the default mock dataset state.
