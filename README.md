# 🏦 NexBank - Modern Digital Banking Ecosystem

NexBank is a premium, full-stack digital banking platform designed for performance, security, and a superior user experience. Built with the MERN stack and a cutting-edge **Glassmorphism UI**, NexBank provides a seamless gateway for personal finance management.

---

## ✨ Features

### 💎 Premium Experience
*   **Modern Dashboard**: A live overview of your financial health with real-time balance tracking and quick-action access.
*   **Glassmorphism UI/UX**: A high-contrast, premium interface designed for maximum legibility and aesthetic appeal.
*   **Fully Responsive**: optimized for desktops and tablets with sleek micro-animations.

### 💳 Financial Services
*   **Secure Deposits**: Integrated with **Razorpay** for instant, bank-grade secure wallet refills.
*   **Smart Withdrawals**: An intuitive withdrawal system with real-time ledger validation.
*   **Audit Trail**: A comprehensive, encrypted history of all inward and outward transactions.

### 🛡️ Compliance & Security
*   **KYC Enrollment**: A streamlined digital onboarding process for document submission.
*   **Document Repository**: Secure storage and status tracking for all compliance records.
*   **JWT Protection**: State-of-the-art authentication and endpoint security layers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React-Bootstrap, Axios, FontAwesome |
| **Backend** | Node.js, Express, JWT, Bcrypt |
| **Database** | MongoDB Atlas (Cloud) |
| **Payments** | Razorpay SDK |
| **Design** | Modern Glassmorphism, CSS3 Variables, Google Fonts (Inter) |

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v16.x or higher)
*   NPM or Yarn
*   MongoDB Atlas Account

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
*(On production, set `VITE_API_URL` to your deployed backend URL)*

---

### 🚀 Deployment-Ready Architecture
The frontend utilizes a centralized **Axios interceptor** (`src/utils/api.js`) which:
1.  **Dynamic Routing**: Automatically switches between local and production URLs via environment variables.
2.  **Auth Injection**: Automatically attaches the JWT token to every outgoing request, removing the need for manual headers in components.


---

### 3. Installation & Deployment

#### **Backend**
```bash
cd backend
npm install
npm start
```

#### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```text
net-banking-system/
├── backend/                # Express server & API Logic
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic & Handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes definition
│   └── middleware/         # Auth & Safety filters
├── frontend/               # React client (Vite)
│   ├── src/
│   │   ├── components/     # UI Building blocks
│   │   ├── pages/          # Full-page views
│   │   └── utils/          # API & Helpers
│   └── public/             # Static assets
└── README.md               # Documentation
```

---

## 🔒 Security
NexBank utilizes 256-bit encryption for sensitive data and secure token-based sessions. All compliance documents are processed through a isolated, secure validation pipeline.

---

Developed with ❤️ as a modern banking solution.
