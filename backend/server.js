const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectdb = require("./config/db");
const kycRoutes = require("./routes/kycRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/UserRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const bankRoutes = require('./routes/bankRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const path = require('path');
const cors = require("cors");

const app = express();
app.use(express.json());

// Deployment-ready CORS
// simplified CORS setup for debugging deployment issues
app.use(cors({
    origin: true,
    credentials: true
}));


connectdb();
app.use('/api/kyc', kycRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send("Api is working");
});

const PORT = process.env.PORT || 6500;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});