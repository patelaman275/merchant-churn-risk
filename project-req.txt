# Project Requirements Document: Merchant Churn Risk Dashboard

**Status:** Approved  
**Tech Stack:** React, Vite, Tailwind CSS, HTML5 LocalStorage  

---

## 1. Problem Statement
Customer Experience (CX) and Customer Success (CS) teams handle hundreds of merchants daily. Warning signs of merchant attrition—such as decreasing transaction volumes, drop-offs in portal usage, unresolved technical support tickets, or poor satisfaction scores—are typically siloed across different platforms. Without a single pane of glass, CX managers are forced to be reactive, often finding out a merchant has decided to leave after they have already stopped processing transactions. A centralized, real-time dashboard is needed to identify at-risk merchants and suggest immediate retention outreach playbooks.

---

## 2. Objectives
*   **Centralize Warning Signals:** Consolidate revenue trends, activity logs, support tickets, and NPS surveys into one operational dashboard.
*   **Prioritize Outreach:** Automatically calculate a churn risk score (0-100) for each merchant to help agents focus on high-risk accounts first.
*   **Recommend Playbooks:** Suggest context-specific "Next Best Actions" based on the primary driver of risk.
*   **Persist Outreach State:** Enable agents to document interaction notes and mark playbook checklist items as completed, persisting state locally.

---

## 3. Assumptions Made
*   **Client-side Execution:** A frontend-only dashboard powered by a pre-seeded static database (24 mock merchants) is sufficient for prototyping and deployment evaluation.
*   **Browser Security:** All calculations, custom charts, and notes storage can run locally in the browser using HTML5 `LocalStorage` without requiring a backend database.
*   **Metric Reliability:** The monthly revenue volume history, login logs, and ticket systems update metrics periodically, which are loaded as static values.

---

## 4. Merchant Data Model
Each merchant record is structured with the following fields:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique identifier (e.g. `MCH-1001`). |
| `name` | String | Commercial name of the merchant. |
| `tier` | Enum | Contract tier level (`Basic`, `Silver`, `Gold`, `Platinum`). |
| `industry` | Enum | Vertical market (`Retail`, `E-Commerce`, `Food & Beverage`, `SaaS`, `Services`). |
| `onboardingDate` | Date String | The date the merchant joined (`YYYY-MM-DD`). |
| `monthlyVolume` | Number | Transaction volume processed in the last 30 days (USD). |
| `revenueTrend30d` | Number | Percentage MoM change in monthly volume (e.g. `-38` represents a 38% drop). |
| `lastLoginDays` | Number | Days elapsed since any staff member logged in. |
| `supportTickets` | Number | Number of active unresolved support tickets. |
| `nps` | Number | Net Promoter Score rating given by the merchant (0-10, can be `null` if not surveyed). |
| `actionStatus` | Enum | Outreach status (`Unassigned`, `Needs Outreach`, `In Progress`, `Resolved`). |
| `notes` | String | Rich-text interaction logs recorded by the CSM. |
| `checkedPlaybookItems` | Array | Index integers representing completed steps in the playbook checklist. |

---

## 5. Churn Signals Chosen and Why
We track four primary warning signals to determine churn risk:

1.  **Revenue Falling (`revenueTrend30d < 0`):** Indicates a drop in processing volume, which is the strongest financial predictor of merchant attrition.
2.  **Low Engagement (`lastLoginDays > 3`):** Portal inactivity indicates the merchant is abandoning dashboard features or migrating management elsewhere.
3.  **Support Issues (`supportTickets > 0`):** A backlog of unresolved support tickets indicates persistent technical or service bottlenecks.
4.  **Poor NPS (`nps < 7`):** Direct rating feedback below 7 represents detractor behavior, highlighting customer frustration.

---

## 6. Risk Scoring Approach
The overall **Risk Score** is a weighted average (0-100) calculated from three components:

$$\text{Risk Score} = (0.40 \times S_{\text{volume}}) + (0.30 \times S_{\text{inactivity}}) + (0.30 \times S_{\text{friction}})$$

### 6.1 Component Calculations
*   **Volume Drop ($S_{\text{volume}}$):** If `revenueTrend30d >= 0`, score is `0`. If negative, score is:
    $$S_{\text{volume}} = \min(100, \left| \text{revenueTrend30d} \right| \times 2.5)$$
*   **Inactivity ($S_{\text{inactivity}}$):** If `lastLoginDays <= 3`, score is `0`. If greater, score is:
    $$S_{\text{inactivity}} = \min(100, (\text{lastLoginDays} - 3) \times 5)$$
*   **Support Friction ($S_{\text{friction}}$):** Derived from support tickets and NPS:
    $$S_{\text{friction}} = (0.60 \times S_{\text{tickets}}) + (0.40 \times S_{\text{nps}})$$
    Where $S_{\text{tickets}} = \min(100, \text{supportTickets} \times 25)$ and $S_{\text{nps}} = (10 - \text{nps}) \times 10$ *(if NPS is null, $S_{\text{nps}}$ defaults to 0)*.

### 6.2 Product overrides for Edge Cases
To prevent critical, single-metric failures from being averaged down, three overrides are implemented:
*   **Extreme Inactivity:** If `lastLoginDays >= 30` (Silent Churn), the score is forced to at least `50` (Medium Risk).
*   **Support Backlog:** If `supportTickets >= 4`, the score is forced to at least `50` (Medium Risk).
*   **Catastrophic Volume Decline:** If `revenueTrend30d <= -40`, the score is forced to at least `50` (Medium Risk).

---

## 7. Recommendation Strategy
The system identifies the highest component risk score among Volume, Inactivity, Tickets, and NPS to recommend the **Next Best Action**:

*   **Primary Driver: Volume Drop** → Action: **Offer pricing review** (Playbook: Review processing errors, audit competitor rates, propose credits).
*   **Primary Driver: Inactivity** → Action: **Schedule onboarding session** (Playbook: Re-engagement email, portal demo, feature training).
*   **Primary Driver: Support Backlog** → Action: **Escalate support case** (Playbook: Audit open tickets, push support leads, send concrete ETAs).
*   **Primary Driver: Low NPS** → Action: **Customer Success outreach** (Playbook: Review feedback, schedule direct calls, offer fee credits).
*   **No Active Triggers (Healthy)** → Action: **Standard account maintenance** (Playbook: Log wellness checks, monitor quarterly volumes).

---

## 8. Persistence Choice
*   **Local Storage:** State changes made by the agent—such as selecting client statuses, checking playbook tasks, or typing interaction notes—are automatically serialized and saved to the browser's `LocalStorage`.
*   **State Reset:** A "Reset App Data" option is provided to clear the local storage cache and reload the initial mock seeds.

---

## 9. Dashboard Features
1.  **KPI Stats Board:** Top cards summarizing Value at Risk, At-Risk Count, Average Score, and Open Tickets.
2.  **Interactive Filters:** Live text search (Name/ID) and dropdown selectors for Risk Level, Service Tier, and Industry.
3.  **Detailed Table List:** Displays merchant profiles alongside a visual breakdown panel showing the active checkmarked reasons explaining why a merchant is flagged.
4.  **Slide-Out Workspace Panel:** Opens on row click to show a 6-month historical volume line chart, risk breakdown meters, interactive playbook checkboxes, and notes.

---

## 10. Acceptance Criteria
*   The dashboard runs in all standard browsers with sub-100ms response times for all search queries and sorting.
*   The calculated risk score and level correctly reflect the weights and overrides described in Section 6.
*   Refreshing the page (F5) retains all checked playbook items, status selections, and saved notes.
*   Brand new accounts with missing (`null`) NPS scores are calculated safely as Low Risk instead of throwing compilation errors.
