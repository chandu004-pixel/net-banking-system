import React from 'react';
import { Container, Button, Row, Col, Badge } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const LinkedBanks = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const connectedBanks = [
        { name: 'Chase Bank', type: 'Checking •••• 4402', status: 'Active', logo: 'fas fa-university', color: '#1d4ed8' },
        { name: 'Bank of America', type: 'Savings •••• 9812', status: 'Active', logo: 'fas fa-piggy-bank', color: '#dc2626' },
        { name: 'Discover', type: 'Credit Card •••• 1104', status: 'Sync Error', logo: 'fas fa-credit-card', color: '#f59e0b' }
    ];

    return (
        <div style={{
            padding: '120px 20px 40px',
            minHeight: '100vh',
            background: isLight ? '#f4f7fb' : 'var(--bg-dashboard)',
            color: 'var(--text-primary)',
            transition: 'background 0.3s ease'
        }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                    <div>
                        <h2 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Linked Accounts</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Manage external institutions connected to NexBank.</p>
                    </div>
                </div>

                <Row className="animate-slide-up">
                    <Col lg={8} md={12} className="mb-4">
                        <div className="p-4" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 style={{ fontWeight: 700, margin: 0 }}>Active Connections</h5>
                                <Badge bg="secondary">3 Institutions</Badge>
                            </div>
                            
                            <div className="d-flex flex-column gap-3">
                                {connectedBanks.map((bank, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center p-3 p-md-4" style={{ background: 'var(--surface-tertiary)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                        <div className="d-flex align-items-center">
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginRight: '15px', color: bank.color }}>
                                                <i className={bank.logo}></i>
                                            </div>
                                            <div>
                                                <h6 style={{ fontWeight: 700, margin: 0 }}>{bank.name}</h6>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{bank.type}</span>
                                            </div>
                                        </div>
                                        <div className="text-end d-flex align-items-center gap-3">
                                            <Badge bg={bank.status === 'Active' ? 'success' : 'warning'} className="px-2 py-1">
                                                {bank.status === 'Active' ? <><i className="fas fa-check-circle me-1"></i> Active</> : <><i className="fas fa-exclamation-triangle me-1"></i> Sync Error</>}
                                            </Badge>
                                            <Button variant="link" className="p-0 text-decoration-none" style={{ color: 'var(--text-muted)' }} title="Disconnect">
                                                <i className="fas fa-unlink"></i>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>

                    <Col lg={4} md={12}>
                        <div className="p-4 text-center h-100 d-flex flex-column justify-content-center" style={{ background: 'linear-gradient(135deg, rgba(25,188,253,0.1), rgba(59,130,246,0.1))', border: '1px dashed #19bcfd', borderRadius: '24px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#19bcfd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(25,188,253,0.3)' }}>
                                <i className="fas fa-plus"></i>
                            </div>
                            <h5 style={{ fontWeight: 700 }}>Link Another Bank</h5>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Securely connect via Plaid to see all your finances in one place.</p>
                            <Button className="w-100 fw-bold border-0 mt-3" style={{ background: '#19bcfd', color: '#fff', borderRadius: '12px', padding: '12px' }}>
                                Connect Institution
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LinkedBanks;
