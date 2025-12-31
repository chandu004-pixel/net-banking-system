const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedpassword });
        res.status(201).json({ message: "User register success" });
    } catch (err) {
        res.status(401).json({ error: "User already exists " });
    }
}
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, userId: user._id, name: user.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
}