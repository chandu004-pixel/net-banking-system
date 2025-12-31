import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        navigate('/login');
    }, [navigate]);

    return (
        <div style={{ background: '#0e161e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e97a' }}>
            Logging out...
        </div>
    );
};

export default Logout;
