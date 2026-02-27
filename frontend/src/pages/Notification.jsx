import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.notifications?.filter(n => !n.isRead).length || 0);
        } catch (err) {
            console.warn('Notifications API not ready, using static fallback');
            const fallback = [
                { _id: '1', title: 'New Deposit', message: '₹5,000 added to your account.', createdAt: new Date().toISOString(), icon: 'fas fa-arrow-down', color: '#00e97a', isRead: false },
                { _id: '2', title: 'KYC Approved', message: 'Verification successful.', createdAt: new Date().toISOString(), icon: 'fas fa-check-circle', color: '#19bcfd', isRead: false },
                { _id: '3', title: 'Security Alert', message: 'New login from Mac OS.', createdAt: new Date().toISOString(), icon: 'fas fa-shield-alt', color: '#f59e0b', isRead: true }
            ];
            setNotifications(fallback);
            setUnreadCount(fallback.filter(n => !n.isRead).length);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const poll = setInterval(fetchNotifications, 60000);
        return () => clearInterval(poll);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch {
            // Local update for immediate feedback if API fails
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const handleNotifClick = (notif) => {
        markAsRead(notif._id);
        setIsOpen(false);
        // Navigate based on type if available
        if (notif.title.includes('KYC')) navigate('/view');
        else if (notif.title.includes('Deposit')) navigate('/transactions');
    };

    return (
        <div className="relative notification-container" style={{ position: 'relative' }}>
            <button className="notif-btn" onClick={() => setIsOpen(!isOpen)}>
                <i className="far fa-bell"></i>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notif-panel animate-slide-down shadow-2xl">
                    <div className="notif-header">
                        <h6 className="notif-title">Notifications</h6>
                        <span className="mark-read" onClick={() => setNotifications(n => n.map(not => ({ ...not, isRead: true })))}>
                            Mark all as read
                        </span>
                    </div>

                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted smaller">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif._id}
                                    className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotifClick(notif)}
                                >
                                    <div className="notif-icon-wrap" style={{ color: notif.color, backgroundColor: `${notif.color}15` }}>
                                        <i className={notif.icon}></i>
                                    </div>
                                    <div className="notif-content">
                                        <span className="n-title">{notif.title}</span>
                                        <span className="n-desc">{notif.message || notif.desc}</span>
                                        <span className="n-time">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {!notif.isRead && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .notification-container { z-index: 1001; }
                .notif-btn {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: var(--surface-tertiary);
                    border: 1px solid var(--card-border);
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                }
                .notif-btn:hover { background: var(--surface-secondary); color: var(--text-primary); }
                .notif-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    background: #f43f5e;
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    min-width: 18px;
                    height: 18px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(244, 63, 94, 0.4);
                    border: 2px solid var(--surface-primary);
                }
                .notif-panel {
                    position: absolute;
                    top: 54px;
                    right: 0;
                    width: 320px;
                    background: var(--surface-secondary);
                    border-radius: 16px;
                    border: 1px solid var(--card-border);
                    z-index: 100;
                    overflow: hidden;
                }
                .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--card-border); }
                .notif-title { font-size: 14px; color: var(--text-primary); margin: 0; font-weight: 700; }
                .mark-read { font-size: 11px; color: #00e97a; cursor: pointer; font-weight: 600; }
                .notif-list { max-height: 400px; overflow-y: auto; }
                .notif-item { display: flex; padding: 16px 20px; border-bottom: 1px solid var(--card-border); transition: all 0.2s; position: relative; cursor: pointer; }
                .notif-item.unread { background: rgba(0,233,122,0.03); }
                .notif-item:hover { background: rgba(255,255,255,0.05); }
                .notif-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 14px; flex-shrink: 0; }
                .n-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
                .n-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 6px; line-height: 1.4; }
                .n-time { font-size: 10px; color: var(--text-muted); }
                .unread-dot { width: 6px; height: 6px; background: #00e97a; border-radius: 50%; position: absolute; top: 22px; right: 20px; box-shadow: 0 0 10px rgba(0,233,122,0.5); }
                .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Notification;
