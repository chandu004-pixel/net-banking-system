// Simple mock controller to stop 404 errors on the frontend
exports.getNotifications = async (req, res) => {
    try {
        // Return an empty array or a simple welcome notification
        res.json({ success: true, data: [
            { _id: '1', title: 'Welcome to NexBank', message: 'Your account is fully secured.', isRead: false, createdAt: new Date() }
        ]});
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

exports.markAsRead = async (req, res) => {
    res.json({ success: true, message: "Marked as read" });
};
