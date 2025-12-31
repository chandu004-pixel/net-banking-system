import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {

  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`http://localhost:6500/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    fetchUser();
  }, []);

  const actions = [
    { title: 'Add KYC', icon: 'fas fa-address-card', path: '/add', color: '#00e97a' },
    { title: 'View KYC', icon: 'fas fa-eye', path: '/view', color: '#19bcfd' },
    { title: 'History', icon: 'fas fa-history', path: '/transactions', color: '#f59e0b' },
    { title: 'Deposit', icon: 'fas fa-plus-circle', path: '/transfer', color: '#00e97a' },
    { title: 'Withdraw', icon: 'fas fa-minus-circle', path: '/withdraw', color: '#ef4444' },
  ];


  return (
    <div style={{ padding: '120px 20px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Container>
        <div className="animate-fade-in">
          <h1 className="mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
            Welcome back, <span className="text-gradient">{userName}</span>
          </h1>

          <Row className="mb-5">
            <Col lg={4} md={12} className="mb-4">
              <div className="glass-card p-4" style={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0, 233, 122, 0.1) 0%, rgba(25, 188, 253, 0.1) 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.5px' }}>TOTAL BALANCE</span>
                  <i className="fas fa-shield-alt text-gradient" style={{ fontSize: '1.2rem' }}></i>
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: 10, color: '#ffffff' }}>
                  ₹{balance.toLocaleString()}
                </h2>
                <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', marginRight: 8, boxShadow: '0 0 10px var(--primary)' }}></div>
                  Savings Account • Active
                </div>

              </div>
            </Col>

            <Col lg={8} md={12}>
              <div className="glass-card p-4 h-100">
                <h4 className="mb-4" style={{ fontWeight: 700, color: '#ffffff' }}>Quick Actions</h4>
                <Row>
                  {actions.map((action, idx) => (
                    <Col key={idx} xs={6} md={3} className="mb-3">
                      <div
                        onClick={() => navigate(action.path)}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '1.2rem',
                          padding: '24px 15px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: '1px solid rgba(255,255,255,0.08)',
                          transition: 'all 0.3s ease'
                        }}
                        className="h-100 dashboard-action-card"
                      >
                        <i className={`${action.icon}`} style={{ fontSize: '1.8rem', color: action.color, marginBottom: 14 }}></i>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>{action.title}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 style={{ fontWeight: 700, margin: 0, color: '#ffffff' }}>Security Center</h4>
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill" style={{ fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(0, 233, 122, 0.2)' }}>
                    <i className="fas fa-shield-alt me-1"></i> STATUS: SECURE
                  </span>
                </div>
                <div className="p-4 mb-3" style={{ background: 'rgba(0, 233, 122, 0.05)', borderRadius: '1.2rem', border: '1px solid rgba(0,233,122,0.1)' }}>
                  <div className="d-flex align-items-center">
                    <div style={{ width: 50, height: 50, background: 'rgba(0, 233, 122, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                      <i className="fas fa-user-shield" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>Advanced Security Active</div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Your account is protected by industry-standard 256-bit encryption and multi-factor authentication.</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

        </div>
      </Container>

      <style>{`
        .dashboard-action-card:hover {
          background: rgba(255,255,255,0.08) !important;
          transform: translateY(-5px);
          border-color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

