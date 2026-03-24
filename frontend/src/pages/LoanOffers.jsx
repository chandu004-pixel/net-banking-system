import React from 'react';
import { Container, Button, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const LoanOffers = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

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
                        <h2 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Lending Hub</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Pre-approved liquidity options tailored to your profile.</p>
                    </div>
                    <Badge bg="success" className="px-3 py-2" style={{ fontSize: '14px', borderRadius: '10px' }}>
                        <i className="fas fa-star me-2 text-warning"></i>Excellent Credit Tier
                    </Badge>
                </div>

                <Row className="animate-slide-up">
                    <Col lg={4} md={6} className="mb-4">
                        <div className="p-4 h-100 position-relative" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: '1px solid #10b981', borderRadius: '24px', boxShadow: '0 10px 30px rgba(16,185,129,0.1)' }}>
                            <Badge bg="success" className="position-absolute" style={{ top: '-10px', right: '20px' }}>Pre-Approved</Badge>
                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                                <i className="fas fa-home"></i>
                            </div>
                            <h5 style={{ fontWeight: 700 }}>Home Equity Line</h5>
                            <h2 style={{ fontWeight: 800, color: '#10b981', margin: '15px 0' }}>₹25,00,000</h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tap into your home's equity with our lowest variable rate.</p>
                            
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>
                                    <span>Interest Rate</span>
                                    <span>8.5% APR</span>
                                </div>
                                <ProgressBar variant="success" now={20} />
                            </div>

                            <Button onClick={() => alert("Personal Loan application initiated. An executive will contact you shortly.")} className="w-100 fw-bold border-0" style={{ background: '#10b981', color: '#fff', borderRadius: '12px' }}>Review Offer <i className="fas fa-arrow-right ms-2"></i></Button>
                        </div>
                    </Col>

                    <Col lg={4} md={6} className="mb-4">
                        <div className="p-4 h-100 position-relative" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(25,188,253,0.1)', color: '#19bcfd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                                <i className="fas fa-car"></i>
                            </div>
                            <h5 style={{ fontWeight: 700 }}>Auto Loan Refinance</h5>
                            <h2 style={{ fontWeight: 800, color: '#19bcfd', margin: '15px 0' }}>₹8,50,000</h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lower your monthly payments on your existing vehicle.</p>
                            
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>
                                    <span>Interest Rate</span>
                                    <span>10.2% APR</span>
                                </div>
                                <ProgressBar variant="info" now={40} />
                            </div>

                            <Button onClick={() => alert("Home Loan application initiated. Please upload your property deeds in the KYC portal.")} variant="outline-info" className="w-100 fw-bold" style={{ borderRadius: '12px' }}>Apply Now</Button>
                        </div>
                    </Col>

                    <Col lg={4} md={6} className="mb-4">
                        <div className="p-4 h-100 position-relative" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                                <i className="fas fa-user-tie"></i>
                            </div>
                            <h5 style={{ fontWeight: 700 }}>Personal Line of Credit</h5>
                            <h2 style={{ fontWeight: 800, color: '#f59e0b', margin: '15px 0' }}>₹5,00,000</h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Flexible funds for renovations, weddings, or emergencies.</p>
                            
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>
                                    <span>Interest Rate</span>
                                    <span>14.5% APR</span>
                                </div>
                                <ProgressBar variant="warning" now={70} />
                            </div>

                            <Button onClick={() => alert("Car Loan application initiated. Current interest rate locked at 7.9%.")} variant="outline-warning" className="w-100 fw-bold" style={{ borderRadius: '12px' }}>Apply Now</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoanOffers;
