import React, { useState } from 'react';
import { Container, Button, Row, Col, Badge, Modal } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const VirtualCards = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const [isFrozen, setIsFrozen] = useState(false);
    const [showCVV, setShowCVV] = useState(false);

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
                        <h2 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Virtual Cards</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your digital spending options instantly.</p>
                    </div>
                </div>

                <Row className="animate-slide-up">
                    <Col lg={5} md={12} className="mb-4">
                        <div style={{
                            perspective: '1000px',
                            width: '100%',
                            maxWidth: '400px',
                            margin: '0 auto'
                        }}>
                            <div style={{
                                width: '100%',
                                aspectRatio: '1.586',
                                borderRadius: '20px',
                                background: isFrozen 
                                    ? 'linear-gradient(135deg, #475569, #1e293b)' 
                                    : 'linear-gradient(135deg, #19bcfd, #3b82f6)',
                                padding: '25px',
                                color: '#fff',
                                boxShadow: isFrozen ? 'none' : '0 20px 40px rgba(25,188,253,0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.5s ease'
                            }}>
                                {/* Card Decor */}
                                <div style={{ position: 'absolute', right: '-20%', top: '-20%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                                
                                <div className="d-flex justify-content-between align-items-center mb-4 z-1 position-relative">
                                    <h5 style={{ fontWeight: 800, letterSpacing: '1px', margin: 0 }}>NexBank</h5>
                                    <i className="fab fa-cc-visa fa-2x"></i>
                                </div>
                                
                                <div className="mb-4 mt-4 z-1 position-relative" style={{ filter: isFrozen ? 'blur(2px)' : 'none' }}>
                                    <i className="fas fa-sim-card fa-2x mb-3" style={{ color: '#fbbf24' }}></i>
                                    <h4 style={{ letterSpacing: '3px', fontFamily: 'monospace' }}>
                                        4532  8821  **  **
                                    </h4>
                                </div>
                                
                                <div className="d-flex justify-content-between z-1 position-relative" style={{ filter: isFrozen ? 'blur(2px)' : 'none' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '10px', opacity: 0.8 }}>CARDHOLDER</p>
                                        <p style={{ margin: 0, fontWeight: 600 }}>{localStorage.getItem('userName') || 'VALID USER'}</p>
                                    </div>
                                    <div className="text-end">
                                        <p style={{ margin: 0, fontSize: '10px', opacity: 0.8 }}>EXPIRES</p>
                                        <p style={{ margin: 0, fontWeight: 600 }}>09/28</p>
                                    </div>
                                    <div className="text-end" onClick={() => !isFrozen && setShowCVV(!showCVV)} style={{ cursor: 'pointer' }}>
                                        <p style={{ margin: 0, fontSize: '10px', opacity: 0.8 }}>CVV</p>
                                        <p style={{ margin: 0, fontWeight: 600 }}>{showCVV ? '842' : '***'}</p>
                                    </div>
                                </div>
                                
                                {isFrozen && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                        <div style={{ background: '#ef4444', padding: '5px 15px', borderRadius: '20px', fontWeight: 700, letterSpacing: '2px', fontSize: '14px' }}>
                                            <i className="fas fa-snowflake me-2"></i> FROZEN
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <Button 
                                variant={isFrozen ? 'success' : 'outline-danger'} 
                                className="px-4 py-2" 
                                style={{ borderRadius: '12px', fontWeight: 600 }}
                                onClick={() => setIsFrozen(!isFrozen)}
                            >
                                <i className={`fas ${isFrozen ? 'fa-fire' : 'fa-snowflake'} me-2`}></i>
                                {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                            </Button>
                        </div>
                    </Col>

                    <Col lg={7} md={12}>
                        <div className="p-4" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}><i className="fas fa-sliders-h me-2 text-[#19bcfd]"></i> Card Settings</h5>
                            
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-secondary border-opacity-25">
                                <div>
                                    <h6 style={{ fontWeight: 600, margin: 0 }}>Online Transactions</h6>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Allow purchases on e-commerce websites.</p>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-secondary border-opacity-25">
                                <div>
                                    <h6 style={{ fontWeight: 600, margin: 0 }}>International Usage</h6>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Allow transactions outside your home country.</p>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h6 style={{ fontWeight: 600, margin: 0 }}>Transaction Limit</h6>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Set maximum spend amount per day.</p>
                                </div>
                                <Button onClick={() => alert("Credit limit modifications require Level 2 KYC verification.")} variant="outline-primary" size="sm" style={{ borderRadius: '8px' }}>Edit Limit</Button>
                            </div>
                        </div>

                        <div className="mt-4 p-4 text-center" style={{ background: 'linear-gradient(45deg, rgba(0,233,122,0.1), rgba(25,188,253,0.1))', border: '1px dashed #00e97a', borderRadius: '24px' }}>
                            <i className="fas fa-credit-card fa-2x mb-2 text-[#00e97a]"></i>
                            <h6>Order Physical Card</h6>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Get a premium metal card delivered to your address in 3-5 business days.</p>
                            <Button onClick={() => alert("Virtual Card requested! It will appear in your console within 10 minutes.")} className="btn-success text-[#0b0f14] fw-bold px-4 border-0" style={{ background: '#00e97a' }}>Request Now</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default VirtualCards;
