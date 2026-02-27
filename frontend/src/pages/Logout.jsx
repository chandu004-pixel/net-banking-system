import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const performLogout = async () => {
            try {
                await api.post('/auth/logout');
            } catch (err) {
                console.warn('Logout API failed or already logged out');
            } finally {
                localStorage.clear();
                window.location.href = '/login'; // Force reload to clear all states
            }
        };
        performLogout();
    }, [navigate]);

    return (
        <div style={{ background: 'var(--bg-dashboard)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#00e97a' }}>
            <div className="spinner-border mb-4" role="status"></div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Securing your session...</div>
        </div>
    );
};

export default Logout;
