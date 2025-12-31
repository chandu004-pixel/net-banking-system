import React, { useState } from 'react';
import api from '../utils/api';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const Withdraw = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await api.post('/payment/withdraw',
                { amount: Number(amount) }
            );


            setSuccess('Withdrawal processed successfully! Your balance has been updated.');
            setAmount('');
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Withdrawal failed. Ensure sufficient balance.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '120px 20px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <Container style={{ maxWidth: 450 }}>
                <div className="animate-fade-in">
                    <div className="glass-card p-5">
                        <div className="text-center mb-5">
                            <div style={{
                                width: 50,
                                height: 50,
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px'
                            }}>
                                <i className="fas fa-hand-holding-usd" style={{ color: '#ef4444', fontSize: '1.4rem' }}></i>
                            </div>
                            <h2 style={{ fontWeight: 700 }}>Outward Withdrawal</h2>
                            <p className="text-secondary small">Transfer funds to your linked bank account.</p>
                        </div>

                        {error && <Alert variant="danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '1rem' }}>
                            <i className="fas fa-exclamation-circle me-2"></i> {error}
                        </Alert>}
                        {success && <Alert variant="success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '1rem' }}>
                            <i className="fas fa-check-circle me-2"></i> {success}
                        </Alert>}

                        <Form onSubmit={handleWithdraw}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-secondary small fw-600">AMOUNT (INR)</Form.Label>
                                <div className="position-relative">
                                    <span className="position-absolute" style={{ left: 16, top: 12, color: '#ef4444', fontWeight: 700 }}>₹</span>
                                    <Form.Control
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 12px 12px 35px', borderRadius: '0.8rem', fontSize: '1.2rem', fontWeight: 600 }}
                                    />
                                </div>
                            </Form.Group>
                            <Button
                                type="submit"
                                disabled={loading || !amount}
                                className="w-100 py-3 border-0 text-white"
                                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', fontWeight: 700, borderRadius: '0.8rem', fontSize: '1.1rem' }}
                            >
                                {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> Processing Withdrawal...</> : "Confirm Withdrawal"}
                            </Button>
                        </Form>
                        <div className="mt-4 text-center">
                            <i className="fas fa-info-circle me-2 text-secondary" style={{ fontSize: '0.8rem' }}></i>
                            <small className="text-secondary" style={{ fontSize: '0.8rem' }}>Settlement may take up to 24 hours.</small>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Withdraw;
