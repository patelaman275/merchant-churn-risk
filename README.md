# Merchant Churn Risk Dashboard

A high-fidelity, frontend-only web application designed for Customer Experience (CX) and Customer Success (CS) teams. The application serves as an interactive command center that consolidates scattered merchant metrics, calculates a dynamic risk rating for each merchant, and suggests context-specific action playbooks to prevent customer attrition.

## 🚀 Live Demo
*   **Vercel Live URL:** [https://merchant-churn-risk.vercel.app](https://merchant-churn-risk.vercel.app)

---

## 🎨 Features
*   **Weighted Risk Engine:** Dynamically calculates an overall churn risk score (0-100) based on three core dimensions: Month-over-Month volume trends (40%), login inactivity days (30%), and support friction metrics (30%).
*   **Edge Case Overrides:** Built-in heuristics that prevent critical warning indicators from being averaged down (e.g. escalating extreme inactivity, ticket backlogs, or volume drops to at least Medium Risk).
*   **Dynamic Recommendations & Playbooks:** Identifies the primary risk driver and recommends a targeted action:
    *   *Revenue Falling* → **Offer pricing review** (Revenue Recovery Playbook)
    *   *Low Engagement* → **Schedule onboarding session** (Engagement Playbook)
    *   *Support Issues* → **Escalate support case** (Support Escalation Playbook)
    *   *Poor NPS* → **Customer Success outreach** (NPS Recovery Playbook)
    *   *Healthy Metrics* → **Standard account maintenance**
*   **Interactive Sidebar Details:** Displays a granular customer profile, custom SVG line chart of 6-month transaction history, list of triggered signals, interactive playbook checklist, and user-editable interaction logs.
*   **LocalStorage Persistence:** Automatically saves and restores note logs, ticked checklist items, and client statuses across browser refreshes.
*   **Real-Time Filters:** Instantly search by name/ID, and filter by Risk Level, Contract Tier, or Industry with sub-100ms response times.
*   **Responsive Dark/Light Theme:** Premium theme integration with a header toggle button.

---

## 🛠️ Technical Stack
*   **Core:** React 18
*   **Scaffolding:** Vite
*   **Styling:** Vanilla CSS Custom Properties + Tailwind CSS (Utility classes)
*   **Charts:** Native declarative SVGs (no external chart libraries required)
*   **Persistence:** HTML5 LocalStorage

---

## 📦 Local Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Swym
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server locally:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` in your web browser.

4.  **Compile the production build:**
    ```bash
    npm run build
    ```
    Compiles optimized static assets to the `dist/` directory.

---

## 🚀 Deployment Instructions

### Deploy to GitHub Pages
This project has been pre-configured with the `gh-pages` package. To deploy directly to your GitHub repository:
1.  Add your GitHub remote repository origin:
    ```bash
    git remote add origin https://github.com/<your-username>/<your-repo-name>.git
    ```
2.  Publish to the `gh-pages` branch:
    ```bash
    npm run deploy
    ```
    Vite will compile the production bundle and push it to the `gh-pages` branch automatically.

### Deploy to Vercel
1.  Install Vercel CLI and authenticate:
    ```bash
    npx vercel login
    ```
2.  Deploy the static site:
    ```bash
    npx vercel --prod
    ```
