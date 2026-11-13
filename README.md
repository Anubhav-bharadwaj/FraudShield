<div align="center">

# 🛡️ FraudShield
### *Stay Ahead of Every Threat.*

**Intelligent Financial Fraud Detection, Behavioural Anomaly Scoring & Anti-Money Laundering (AML) Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11.11-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[**Explore Live Demo**](#quick-start) • [**Core Features**](#core-capabilities) • [**Detection Engine**](#detection-engine-methodology) • [**AML Topology**](#aml-intelligence--graph-topology) • [**Architecture**](#project-structure)

</div>

---

## 📌 Overview

**FraudShield** is a modern, production-grade financial crime monitoring platform. Designed from first principles, it combines real-time behavioural anomaly scoring with directed-graph AML topology analysis to detect fraudulent transactions, smurfing syndicates, and circular laundering loops before funds leave the payment rails.

Built with a **zero black-box philosophy**, every single threat score is mathematically transparent—surfacing the exact signals, historical baseline comparisons, and evidence pills required for human compliance teams to take swift, defensible action.

---

## 🎨 Dual Visual Identity

FraudShield implements a dual-theme architecture isolated by route:

| Workspace | Route | Aesthetic | Palette |
|---|---|---|---|
| **Public Landing Page** | `/` | Cyber SaaS (Stripe/Linear-inspired) | Deep Navy (`#080D18`), Electric Blue (`#3B82F6`), Cyber Cyan (`#22D3EE`) |
| **Operational Console** | `/dashboard/*` | Editorial Financial Intelligence | Deep Charcoal (`#171715`), Warm Sand (`#D8C5A3`), Restrained Status Colors |

---

## ✨ Core Capabilities

### 1. 🌐 Premium Cybersecurity Landing Page (`/`)
- **Animated Cyber Shield**: Layered SVG shield with rotating 60fps radar sweep beam, glowing crosshairs, and pulse rings.
- **Simulated Security Telemetry Panel**: Live stream of transaction evaluations across Indian banking rails (UPI, IMPS, NEFT) with real-time laser scanning line.
- **Interactive Risk Inspector**: Dynamic score breakdown (0–100 gauge) revealing mathematical points allocation and evidence signals.
- **Responsive Navigation**: Frosted glass sticky navbar with scroll transitions and mobile drawer.

### 2. 📊 Executive Dashboard (`/dashboard`)
- **Live Computed KPIs**: Monitored transactions, flagged anomalies, active critical alerts, accounts under review, and financial risk exposure in INR Lakhs.
- **Interactive Recharts Telemetry**:
  - Hourly Ingestion vs. Flagged Anomalies (dual-gradient area chart).
  - Risk Severity Distribution (donut chart with custom tooltips).
- **Real-Time Feeds**: Live ledger ingestion feed and triage alerts queue.

### 3. 🔍 Transaction Monitor (`/transactions`)
- **105+ Deterministic Synthetic Transactions**: Believable Indian financial ecosystem (UPI, IMPS, NEFT, RTGS, Wallets) across 15 accounts with geographic hubs (Mumbai, Bengaluru, Delhi, Dubai, etc.).
- **Multidimensional Filters**: Filter by risk band (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), payment rail, and execution status.
- **Search & Sort**: Text search by ID, counterparty, account, or scenario tag; multi-column sorting by amount, timestamp, or risk score.
- **Batch Processing**: "Batch Analyse All" button to re-evaluate the full dataset in milliseconds.
- **Synthetic Injection Form**: Validated form to inject and immediately score custom transactions.
- **CSV Data Export**: One-click download of the currently filtered ledger.

### 4. 🧠 Explainable Fraud Detection Engine (`/fraud`)
Deterministic rule-based anomaly engine evaluating 6 core behavioural signals:
- **Amount Outlier vs Baseline**: Checks against account historical average and ceiling (up to +25 pts).
- **High-Frequency Velocity Bursts**: Detects 3+ outbound transfers in a 15-minute rolling window (up to +25 pts).
- **First-Time Unseen Beneficiary**: Flags large capital transfers to newly linked counterparties (up to +15 pts).
- **Geographic / IP Proxy Anomaly**: Identifies TOR exit nodes, suspicious proxy origins, or state mismatches (up to +22 pts).
- **Rapid Onward Layering**: Detects inbound funds disbursed onward within 30 minutes with < 15% retention (up to +25 pts).
- **Repeated Failed Authorisations**: Flags multiple failed PIN attempts preceding completion (up to +18 pts).

### 5. 🕸️ AML Intelligence & Graph Topology (`/aml`)
- **Structuring / Smurfing Detector**: Identifies clusters of transactions calibrated just below reporting thresholds (e.g. ₹48,000–₹49,900) across rolling windows.
- **Circular Flow Loop Detector**: Directed graph cycle algorithm detecting multi-hop round-tripping (e.g., A → B → C → A) where funds return to origin.
- **Rapid Pass-Through Layering**: Traces high-speed intermediate transit accounts disbursing 85%+ of incoming funds in under 30 minutes.
- **Interactive SVG Topology Graph**: Visualizes accounts as nodes with role badges, directional curved flow links, and pulsing red animated cycles.

### 6. 🚨 Operational Alerts & Case Dossiers (`/alerts` & `/investigations`)
- **Alert Triage**: Acknowledge, escalate, and resolve alerts with inline analyst findings.
- **Case Management**: Convert alerts directly into formal investigation cases with priority status state machines (`OPEN` → `INVESTIGATING` → `ESCALATED` → `CLOSED`).
- **Chronological Audit Log**: Post timestamped notes with investigator signatures.
- **Printable Dossiers**: One-click formatted print summaries.

### 7. ⚡ Coordinated Attack Simulation (`/settings`)
- **One-Click Attack Injector**: Triggers a simulated 5-step attack sequence (TOR account drain → 3-burst structuring → offshore layering jump), immediately updating alerts and dashboard KPIs.
- **Demo Baseline Reset**: Instantly resets `localStorage` back to pristine initial state.

---

## 📐 Detection Engine Methodology

The engine calculates risk deterministically using calibrated point additions clamped to `[0, 100]`:

$$\text{Risk Score} = \min\left(100, \max\left(0, \sum_{i} \text{Points}(\text{Signal}_i)\right)\right)$$

| Signal Identifier | Category | Weight | Trigger Criteria |
|---|---|---|---|
| `SIG-HIGH-AMOUNT` | Amount | +18 to +25 | Transaction > 2x to 5x account average and > limit |
| `SIG-VELOCITY-BURST` | Velocity | +20 to +25 | $\ge 3$ outbound transfers within 15 minutes |
| `SIG-NEW-BENEFICIARY` | Beneficiary | +10 to +15 | Zero prior transfer history and value > ₹10,000 |
| `SIG-LOCATION-ANOMALY` | Location | +12 to +22 | International IP, TOR exit node, or hub mismatch |
| `SIG-RAPID-PASS-THROUGH` | Flow | +25 | Inflow followed by outflow in $\le 30$ mins ($> 85\%$ volume) |
| `SIG-REPEATED-FAILURES` | Auth | +12 to +18 | $\ge 2$ failed authorisations in the past 60 minutes |
| `SIG-AML-STRUCTURING` | AML | +25 | Multiple sub-threshold transactions (₹45k–₹50k) in 4h |
| `SIG-AML-CIRCULAR` | AML | +30 | Confirmed participant in closed directed cycle |

### Risk Bands & Decision Recommendations

- **`0 – 29` LOW**: Conforms to historical profile $\rightarrow$ **APPROVE**
- **`30 – 49` MEDIUM**: Elevated single-factor anomaly $\rightarrow$ **REVIEW**
- **`50 – 74` HIGH**: Multiple correlating threat signals $\rightarrow$ **ESCALATE**
- **`75 – 100` CRITICAL**: Severe syndication or drain pattern $\rightarrow$ **FREEZE**

---

## 🛠️ Tech Stack

- **Core**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (scroll reveals, staggered cards), Pure CSS Keyframes (radar, scanlines, orbs)
- **Visualization**: [Recharts](https://recharts.org/) (telemetry charts), Bespoke SVG Directed Graph (AML topology)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Persistence**: React Context API + LocalStorage Adapter

---

## 🚀 Quick Start

### Prerequisites
- Node.js `v18.17.0` or higher
- npm, pnpm, or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/fraudshield.git
cd fraudshield
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```text
fraudshield/
├── src/
│   ├── app/                         # Next.js App Router Pages
│   │   ├── layout.tsx               # Root Layout & Metadata
│   │   ├── globals.css              # Custom Keyframes & Scrollbars
│   │   ├── page.tsx                 # Public Landing Page (/)
│   │   ├── dashboard/page.tsx       # Executive Overview Console (/dashboard)
│   │   ├── transactions/page.tsx    # Transaction Monitor (/transactions)
│   │   ├── fraud/page.tsx           # Explainable Risk Engine (/fraud)
│   │   ├── aml/page.tsx             # AML Network Topology (/aml)
│   │   ├── alerts/page.tsx          # Operational Alert Queue (/alerts)
│   │   ├── investigations/page.tsx  # Case Dossiers & Audit Log (/investigations)
│   │   ├── analytics/page.tsx       # AFC Synthesis & Rail Benchmarks (/analytics)
│   │   └── settings/page.tsx        # Presentation Controls & Calibration (/settings)
│   │
│   ├── components/
│   │   ├── AppShell.tsx             # Dual-theme workspace layout isolator
│   │   ├── Sidebar.tsx              # Internal dashboard navigation bar
│   │   ├── Header.tsx               # Top action toolbar
│   │   ├── AMLNetworkGraph.tsx      # SVG Directed Graph component
│   │   ├── TransactionDetailModal.tsx # Full investigative drawer
│   │   ├── AddTransactionModal.tsx  # Validated transaction injection form
│   │   └── landing/                 # Modular Landing Page Sections
│   │       ├── Navbar.tsx           # Sticky nav with mobile drawer
│   │       ├── HeroSection.tsx      # Hero copy & animated radar shield
│   │       ├── LiveSecurityPanel.tsx # Simulated live telemetry feed
│   │       ├── FeaturesSection.tsx  # Staggered capability cards
│   │       ├── HowItWorksSection.tsx # 3-stage protocol pipeline
│   │       ├── TrustSection.tsx     # Enterprise architectural principles
│   │       ├── FinalCTASection.tsx  # Radiant conversion banner
│   │       └── Footer.tsx           # Platform sitemap & legal notice
│   │
│   ├── context/
│   │   └── FraudShieldContext.tsx   # Central state, simulation & storage
│   ├── data/
│   │   └── initialData.ts           # 105+ deterministic synthetic transactions
│   ├── engine/
│   │   ├── riskEngine.ts            # Mathematical scoring heuristic engine
│   │   └── amlDetector.ts           # Smurfing, cycles & layering algorithms
│   └── types/
│       └── index.ts                 # Full TypeScript definitions
│
├── .gitignore                       # Git ignore configuration
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Dependencies & scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Design tokens & color system
└── tsconfig.json                    # TypeScript compiler options
```

---

## 🔒 Responsible AI & Synthetic Data Notice

- **Synthetic Sandbox**: All transactions, Indian account numbers, and counterparties are 100% synthetic. No real banking credentials, UPI PINs, or live banking rails are utilized.
- **Decision-Support**: FraudShield provides indicator telemetry for human investigator review. It is not an automated judicial determination of financial crime.
- **Mathematical Transparency**: Rules are deterministic and inspectable, avoiding opaque statistical hallucinations.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).

