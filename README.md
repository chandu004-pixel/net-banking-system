# 🏦 NexBank - Modern Digital Banking Ecosystem

NexBank is a premium, full-stack digital banking platform designed for institutional-grade performance, security, and a superior user experience. Built with the MERN stack and a cutting-edge **Glassmorphism UI**, NexBank serves as a robust gateway for both personal and enterprise finance management.

---

## ✨ System Architecture & Core Features

### 🛡️ Legal Compliance & Fraud Prevention (Institutional Grade)
NexBank is built on a "Compliance-First" philosophy, integrating advanced security protocols required by global financial regulators:

*   **AI-Powered Automated KYC**: A futuristic biometric onboarding system. Instead of manual reviews, NexBank uses a simulated **AI Verification Engine** that scans document authenticity and facial consistency in real-time.
*   **AML (Anti-Money Laundering) Algorithms**: Real-time velocity monitoring. Transactions are automatically flagged and **"Frozen"** if a brand-new user attempts high-value transfers (e.g., >₹5,000 within 2 minutes of account age), preventing rapid funneling of illicit funds.
*   **Double-Entry Bookkeeping Ledger**: Every penny is tracked via an immutable, append-only **Ledger**. The system never just updates a balance—it creates a cryptographic-ready audit trail of `debit`, `credit`, and `balanceAfter` before finalizing any movement of funds.
*   **Admin Command Center**: A dedicated **"Review Flagged"** console for SuperAdmins to manually inspect and override algorithmic blocks for verified customers.

### 🚀 Cutting-Edge FinTech Integrations
*   **External Bank Linking**: Users can securely link their real-world bank accounts (SBI, HDFC, ICICI, etc.) for direct deposits and withdrawals, moving beyond simple "play money" ecosystems.
*   **Real Deposits via Razorpay**: Integrated with **Razorpay** for instant, bank-grade secure wallet refills via UPI, Debit Cards, and NetBanking.
*   **Smart Withdrawals**: Withdraw funds directly to linked bank accounts with real-time ledger validation and AML checks.

### 💎 Premium Experience (NexBank UI v2.0)
*   **Modern Glassmorphism**: A high-contrast, premium interface using translucent blurred layers, vibrant gradients, and CSS3 glassmorphic tokens.
*   **Advanced Typography**: Utilizing **Space Grotesk** for headings and **Inter** for data—delivering a tech-forward, crisp, and authoritative visual hierarchy.
*   **Dynamic Micro-Animations**: Smooth transitions, pulsing security indicators, and hover-reactive glass cards designed to provide high-engagement feedback.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React-Bootstrap, Recharts (Analytics), Axios |
| **Backend** | Node.js, Express, JWT (Auth), Bcrypt (Security) |
| **Database** | MongoDB Atlas (Cloud) with Ledger-based Schema |
| **Payments** | Razorpay SDK, External Bank API Integration (Simulated) |
| **Design** | CSS3 Variables, Google Fonts (Space Grotesk & Inter), Glassmorphism |

---

## 📂 Project Structure

```text
net-banking-system/
├── backend/                # Express server & API Logic
│   ├── models/             # Mongoose schemas (User, Bank, Transaction, KYC, Ledger)
│   ├── controllers/        # Business logic (AML, Bookkeeping, AI KYC Simulation)
│   ├── routes/             # API routes (Payment, Bank, KYC, Admin)
│   └── middleware/         # Security filters (Auth, Admin, Fraud Radar)
├── frontend/               # React client (Vite)
│   ├── src/
│   │   ├── pages/          # Admin Hub, User Dash, KYC Center, Review Console
│   │   ├── components/     # Stepped KYC Form, Glass Components, Navbars
│   │   └── utils/          # API Handlers & Global axios interceptors
│   └── public/             # Static assets
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v18.x or higher)
*   NPM or Yarn
*   MongoDB Atlas Account
*   Razorpay API Keys

### 2. Environment Setup
Create a `.env` file in the `backend` directory:
```env
PORT=6500
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:6500/api
```

---

## 🔒 Security & Integrity
NexBank utilizes 256-bit encryption for sensitive data and secure token-based sessions. All financial movements are mathematically verified against the **Immutable Ledger** to prevent balance manipulation and ensure total transparency.

---

Developed with ❤️ as a modern banking solution for the future.
