---
description: How to deploy the NexBank MERN application
---

## 🚀 Deployment Guide for NexBank

Deploying a MERN stack application involves three main parts: Database, Backend, and Frontend.

### 1. Database (MongoDB Atlas)
Your database is already on the cloud. Ensure your Network Access in MongoDB Atlas allows connections from `0.0.0.0/0` (for testing) or the specific IP of your backend server.

---

### 2. Backend Deployment (Render / Railway)

**Option A: Render (Recommended)**
1.  Connect your GitHub repository to [Render](https://render.com).
2.  Create a new **Web Service**.
3.  Set the **Root Directory** to `backend`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  Add **Environment Variables**:
    *   `MONGO_URI`: (Your Atlas URI)
    *   `JWT_SECRET`: (Any strong string)
    *   `PORT`: `6500`
    *   `RAZORPAY_KEY_ID`: (Your Key)
    *   `RAZORPAY_KEY_SECRET`: (Your Secret)

**Option B: Railway**
1.  Connect GitHub and select the `backend` folder.
2.  Railway will auto-detect Node.js.
3.  Add the same variables as above in the "Variables" tab.

---

### 3. Frontend Deployment (Vercel / Netlify)

**Option A: Vercel**
1.  Connect your GitHub repository to [Vercel](https://vercel.com).
2.  Select the **Root Directory** as `frontend`.
3.  **Framework Preset**: `Vite`.
4.  Add **Environment Variables**:
    *   `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
5.  Deploy!

---

### 🛠️ Important: CORS Configuration
If your frontend cannot communicate with the backend, update `backend/server.js`:

```javascript
app.use(cors({
    origin: 'https://your-frontend-url.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
```

### ⚡ Troubleshooting
*   **Mixed Content**: Ensure both your backend and frontend use `https`.
*   **Whitelisting**: Ensure Razorpay Dashboard has your production domain whitelisted in Webhooks/Settings.
*   **Env Issues**: React (Vite) requires environment variables to start with `VITE_`.
