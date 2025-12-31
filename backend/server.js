const express = require("express");
const dotenv = require("dotenv");
const connectdb = require("./config/db");
const kycRoutes = require("./routes/kycRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/UserRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const path = require('path');
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectdb();
app.use('/api/kyc', kycRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send("Api is working");
});
const PORT = process.env.PORT || 6500;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});