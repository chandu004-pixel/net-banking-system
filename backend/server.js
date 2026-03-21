const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectdb = require("./config/db");
const kycRoutes = require("./routes/kycRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/UserRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const bankRoutes = require('./routes/bankRoutes');
const path = require('path');
const cors = require("cors");

const app = express();
app.use(express.json());

// Deployment-ready CORS
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Broaden to allow all Vercel domains for troubleshooting
        if (!origin || 
            allowedOrigins.includes(origin) || 
            origin.includes('vercel.app') || 
            origin.includes('now.sh')) {
            callback(null, true);
        } else {
            console.warn(`Blocked by CORS: ${origin}`);
            callback(new Error(`CORS Error: ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

connectdb();
app.use('/api/kyc', kycRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/banks', bankRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send("Api is working");
});

const PORT = process.env.PORT || 6500;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});