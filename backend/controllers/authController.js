const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        // Simple heuristic: if domain is @admin.com, set role to admin
        const role = email.endsWith('@admin.com') ? 'admin' : 'user';
        const hashedpassword = await bcrypt.hash(password, 10);
        
        // Generate a random 12-digit Virtual Account Number
        const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();

        const user = await User.create({ name, email, password: hashedpassword, role, phone, accountNumber, ifscCode: 'NEXB0000001' });
        res.status(201).json({ message: "User register success", role: user.role });
    } catch (err) {
        console.error('Registration error details:', err);
        if (err.code === 11000 || err.name === 'MongoServerError' && err.message.includes('E11000')) {
            return res.status(400).json({ error: "Email address is already registered" });
        }
        res.status(500).json({ error: "Registration failed: " + (err.message || "Internal server error") });
    }
}

exports.sendAdminOtp = async (req, res) => {
    const { email, password, phone } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ error: "Invalid Credentials or Not an Admin" });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
        // Update phone if provided
        if (phone) {
            user.phone = phone;
        }
        await user.save();
        
        // Simulating sending SMS (In production, replace with Twilio/AWS SNS)
        console.log(`\n[SIMULATED SMS] -> Sent Admin OTP ${otp} to phone ${user.phone}\n`);
        
        // DEV OVERRIDE: Returning OTP in response so it can be shown on the frontend
        res.status(200).json({ message: "OTP sent successfully", devOtp: otp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
}

exports.login = async (req, res) => {
    const { email, password, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        if (user.role === 'admin') {
            if (!otp) {
                return res.status(400).json({ requireOtp: true, error: "OTP is required for Admin login" });
            }
            if (user.otp !== otp || user.otpExpiry < new Date()) {
                return res.status(401).json({ error: "Invalid or expired OTP" });
            }
            // Clear OTP
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
        }

const KYC = require('../models/kyc');

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        let hasKyc = false;
        if (user.role === 'user') {
            const userKyc = await KYC.findOne({ user: user._id });
            hasKyc = !!userKyc;
        }

        res.status(200).json({ token, userId: user._id, name: user.name, role: user.role, hasKyc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
}