import React from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const ProductManagement = () => {
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
                        <h2 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Product Configuration</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Configure core banking parameters, interest rates, and limits.</p>
                    </div>
                    <Button variant="primary" className="fw-bold px-4 py-2" style={{ borderRadius: '12px' }}>
                        <i className="fas fa-save me-2"></i> Deploy Global Config
                    </Button>
                </div>

                <Row className="animate-slide-up">
                    <Col lg={6} md={12} className="mb-4">
                        <div className="p-4 h-100" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                                <i className="fas fa-hand-holding-usd fa-2x me-3 text-[#10b981]"></i>
                                <div>
                                    <h5 style={{ fontWeight: 700, margin: 0 }}>Lending Rates</h5>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Adjust base interest for loan products.</span>
                                </div>
                            </div>
                            
                            <Form>
                                <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                                    <Form.Label className="mb-0 fw-bold">Home Equity Base APR</Form.Label>
                                    <div className="d-flex align-items-center" style={{ width: '150px' }}>
                                        <Form.Control type="number" defaultValue="8.5" step="0.1" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} />
                                        <span className="ms-2 fw-bold text-muted">%</span>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                                    <Form.Label className="mb-0 fw-bold">Auto Loan Base APR</Form.Label>
                                    <div className="d-flex align-items-center" style={{ width: '150px' }}>
                                        <Form.Control type="number" defaultValue="10.2" step="0.1" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} />
                                        <span className="ms-2 fw-bold text-muted">%</span>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                                    <Form.Label className="mb-0 fw-bold">Personal Credit APR</Form.Label>
                                    <div className="d-flex align-items-center" style={{ width: '150px' }}>
                                        <Form.Control type="number" defaultValue="14.5" step="0.1" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} />
                                        <span className="ms-2 fw-bold text-muted">%</span>
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>

                    <Col lg={6} md={12} className="mb-4">
                        <div className="p-4 h-100" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                                <i className="fas fa-shield-alt fa-2x me-3 text-[#f43f5e]"></i>
                                <div>
                                    <h5 style={{ fontWeight: 700, margin: 0 }}>AML & KYC Triggers</h5>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure automated security rules.</span>
                                </div>
                            </div>
                            
                            <Form>
                                <Form.Group className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <Form.Label className="mb-0 fw-bold">Velocity Freeze Limit</Form.Label>
                                        <Badge bg="danger">HIGH RISK</Badge>
                                    </div>
                                    <div className="d-flex align-items-center mb-1">
                                        <span className="me-2 fw-bold text-muted">₹</span>
                                        <Form.Control type="number" defaultValue="50000" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} />
                                    </div>
                                    <Form.Text className="text-muted" style={{ fontSize: '12px' }}>Any transfers above this amount instantly freeze.</Form.Text>
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)' }}>
                                    <div>
                                        <div className="fw-bold">Mandatory KYC Verification</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Require approved KYC before deposits.</div>
                                    </div>
                                    <Form.Check type="switch" id="kyc-switch" defaultChecked style={{ transform: 'scale(1.3)' }} />
                                </div>
                            </Form>
                        </div>
                    </Col>

                    <Col lg={12} className="mb-4">
                        <div className="p-4" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                             <div className="d-flex align-items-center mb-4">
                                <i className="fas fa-credit-card fa-2x me-3 text-[#19bcfd]"></i>
                                <div>
                                    <h5 style={{ fontWeight: 700, margin: 0 }}>Virtual Card Management</h5>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Global settings for digital issuance.</span>
                                </div>
                            </div>
                            
                            <Row>
                                <Col md={4} className="mb-3">
                                    <div className="p-3 rounded-3" style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)' }}>
                                        <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>CARD ISSUANCE FEE</Form.Label>
                                        <Form.Control type="number" defaultValue="0" style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', borderBottom: '2px solid var(--primary)', borderRadius: '0', padding: '5px 0', fontWeight: 700, fontSize: '1.2rem' }} />
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <div className="p-3 rounded-3" style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)' }}>
                                        <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>DEFAULT DAILY LIMIT</Form.Label>
                                        <Form.Control type="number" defaultValue="20000" style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', borderBottom: '2px solid var(--primary)', borderRadius: '0', padding: '5px 0', fontWeight: 700, fontSize: '1.2rem' }} />
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                     <div className="p-3 rounded-3" style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)' }}>
                                        <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>FOREIGN TXF FEE (%)</Form.Label>
                                        <Form.Control type="number" defaultValue="1.5" step="0.1" style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', borderBottom: '2px solid var(--primary)', borderRadius: '0', padding: '5px 0', fontWeight: 700, fontSize: '1.2rem' }} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductManagement;
