const User = require('../models/User');
const Transaction = require('../models/transaction');

exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const u = new User({ name, email });
        await u.save();
        res.status(201).json(u);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
};

exports.getUser = async (req, res) => {
    try {
        const u = await User.findById(req.params.id);
        if (!u) return res.status(404).json({ error: "User not found" });
        res.status(200).json(u);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const txs = await Transaction.find({ user: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json(txs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }); // all regular users
        
        const systemLiquidity = users.reduce((acc, user) => acc + (user.balance || 0), 0);
        const activeUsersCount = users.length;
        
        // Fetch last 7 days transactions for velocity chart (Volume sum instead of count)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const txs = await Transaction.find({ createdAt: { $gte: sevenDaysAgo } });
        
        // Group transactions by day
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const velocityBase = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
        txs.forEach(tx => {
            const dayName = days[new Date(tx.createdAt).getDay()];
            velocityBase[dayName] += (tx.amount || 1); 
        });
        
        // Reorder array to standard display order or keep as is
        const txVolumeData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
            day, vol: velocityBase[day]
        }));
        
        const recentTxs = await Transaction.find().sort({ createdAt: -1 }).limit(10).populate('user', 'email');
        const recentFlags = recentTxs
            .filter(tx => tx.amount >= 20000) // Flag large dummy transactions
            .slice(0, 5)
            .map((tx, idx) => ({
                id: `FLG-${8821 + idx}`,
                type: tx.amount > 50000 ? 'Large Transfer' : 'Velocity Alert',
                user: tx.user ? tx.user.email.split('@')[0] : 'Unknown',
                risk: tx.amount > 100000 ? 'High' : tx.amount > 50000 ? 'Medium' : 'Low',
                time: new Date(tx.createdAt).toLocaleTimeString()
            }));

        res.status(200).json({
            systemLiquidity,
            activeUsers: activeUsersCount,
            txVolumeData,
            recentFlags: recentFlags.length > 0 ? recentFlags : null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch admin stats" });
    }
};
