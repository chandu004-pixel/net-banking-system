import React from 'react';
import { Container, Button, Row, Col, Form, Accordion } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const HelpSupport = () => {
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
                {/* AI Generated Banner Image */}
                <div className="w-100 mb-5 rounded-4 overflow-hidden shadow-lg position-relative" style={{ height: '200px', background: 'linear-gradient(to right, #0f172a, #1e293b)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, background: 'var(--bg-dark)', zIndex: 1 }}></div>
                    <img src="/support_banner.png" alt="Support Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: 0.8 }} />
                    <div className="position-absolute z-2 d-flex flex-column justify-content-center h-100 px-5">
                        <h2 style={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Support Center</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontWeight: 600 }}>We are here to help 24/7/365.</p>
                    </div>
                </div>

                <Row className="animate-slide-up">
                    <Col lg={7} md={12} className="mb-4">
                        <div className="p-4" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Contact Support</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Subject</Form.Label>
                                    <Form.Control type="text" placeholder="e.g. Transaction Dispute" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Message</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Describe your issue..." style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} />
                                </Form.Group>
                                <Button className="fw-bold px-4 py-2" style={{ background: 'var(--primary)', border: 'none', borderRadius: '10px' }}>
                                    <i className="fas fa-paper-plane me-2"></i> Submit Ticket
                                </Button>
                            </Form>
                        </div>
                    </Col>

                    <Col lg={5} md={12}>
                        <div className="p-4 h-100" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Frequently Asked Questions</h5>
                            
                            <Accordion defaultActiveKey="0" className="custom-accordion">
                                <Accordion.Item eventKey="0" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <Accordion.Header>How do I reset my password?</Accordion.Header>
                                    <Accordion.Body style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                        You can reset your password by going to Settings - Security - Reset Password. You will receive an OTP on your registered email.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <Accordion.Header>Why is my transaction frozen?</Accordion.Header>
                                    <Accordion.Body style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Our AML (Anti-Money Laundering) system automatically flags unusual velocity limits. An admin will review it within 24 hours.
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2" style={{ background: 'transparent', border: 'none' }}>
                                    <Accordion.Header>Are virtual cards secure?</Accordion.Header>
                                    <Accordion.Body style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Yes. Your virtual cards generate temporary CCV codes to prevent unauthorized online captures.
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <div className="mt-5 p-3 rounded-3 d-flex align-items-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                <i className="fas fa-phone-alt fa-2x me-3 text-[#3b82f6]"></i>
                                <div>
                                    <h6 style={{ margin: 0, fontWeight: 700 }}>Call Us Instead</h6>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>1-800-NEX-BANK</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <style>{`
                .custom-accordion .accordion-button {
                    background: transparent !important;
                    color: var(--text-primary) !important;
                    box-shadow: none !important;
                    font-weight: 600;
                    padding: 15px 0;
                }
                .custom-accordion .accordion-button:not(.collapsed) {
                    color: var(--primary) !important;
                }
            `}</style>
        </div>
    );
};

export default HelpSupport;
