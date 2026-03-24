import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Transfer = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('fund');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [amount, setAmount] = useState('');

    // Internal
    const [internalAccount, setInternalAccount] = useState('');

    // Domestic
    const [domName, setDomName] = useState('');
    const [domAccount, setDomAccount] = useState('');
    const [domIfsc, setDomIfsc] = useState('');

    // International
    const [intName, setIntName] = useState('');
    const [intIban, setIntIban] = useState('');
    const [intSwift, setIntSwift] = useState('');
    const [intCurrency, setIntCurrency] = useState('USD');
    const [fxQuote, setFxQuote] = useState(null);
    const [fxLoading, setFxLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'international' && amount > 50) {
            const fetchQuote = async () => {
                setFxLoading(true);
                try {
                    const res = await api.post('/payment/fx-quote', { amount, targetCurrency: intCurrency });
                    setFxQuote(res.data);
                } catch (e) {
                    setFxQuote(null);
                } finally {
                    setFxLoading(false);
                }
            };
            const delay = setTimeout(fetchQuote, 500);
            return () => clearTimeout(delay);
        } else {
            setFxQuote(null);
        }
    }, [amount, intCurrency, activeTab]);

    const resetMessages = () => { setError(''); setSuccess(''); };

    const handleFund = async (e) => {
        e.preventDefault();
        setLoading(true); resetMessages();
        try {
            const res = await api.post('/payment/fund-simulator', { amount });
            setSuccess(res.data.message); 
            setAmount('');
        } catch (err) { 
            setError(err.response?.data?.error || "Failed to add funds"); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleInternal = async (e) => {
        e.preventDefault(); setLoading(true); resetMessages();
        try {
            const res = await api.post('/payment/transfer/internal', { amount: Number(amount), recipientAccount: internalAccount });
            setSuccess(res.data.message); setAmount(''); setInternalAccount('');
        } catch (err) { setError(err.response?.data?.error || "Transfer failed"); }
        finally { setLoading(false); }
    };

    const handleDomestic = async (e) => {
        e.preventDefault(); setLoading(true); resetMessages();
        try {
            const res = await api.post('/payment/transfer/domestic', { amount: Number(amount), recipientName: domName, recipientAccount: domAccount, recipientIfsc: domIfsc });
            setSuccess(res.data.message + " ₹5 Fee Applied."); setAmount(''); setDomName(''); setDomAccount(''); setDomIfsc('');
        } catch (err) { setError(err.response?.data?.error || "Transfer failed"); }
        finally { setLoading(false); }
    };

    const handleInternational = async (e) => {
        e.preventDefault(); setLoading(true); resetMessages();
        try {
            const res = await api.post('/payment/transfer/international', { amount: Number(amount), recipientName: intName, recipientIban: intIban, recipientSwift: intSwift, targetCurrency: intCurrency });
            setSuccess(res.data.message); setAmount(''); setIntName(''); setIntIban(''); setIntSwift(''); setFxQuote(null);
        } catch (err) { setError(err.response?.data?.error || "International Transfer failed"); }
        finally { setLoading(false); }
    };

    const tabStyle = (tabName) => ({
        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
        transition: 'all 0.3s', flex: 1, textAlign: 'center',
        background: activeTab === tabName ? 'var(--primary)' : 'transparent',
        color: activeTab === tabName ? '#000' : 'var(--text-secondary)',
        border: activeTab === tabName ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
    });

    return (
        <div style={{ padding: '120px 20px 40px', minHeight: '100vh', background: 'var(--bg-dashboard)' }}>
            <Container style={{ maxWidth: 550 }}>
                <div className="animate-fade-in">
                    <Button variant="link" onClick={() => navigate('/dashboard')} className="text-secondary p-0 mb-4 text-decoration-none d-inline-flex align-items-center" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                    </Button>
                    
                    <div className="glass-card p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h2 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Global Money Hub</h2>
                            <p className="text-secondary small">Fund your account or send money anywhere.</p>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mb-4">
                            <div style={tabStyle('fund')} onClick={() => {setActiveTab('fund'); resetMessages();}}><i className="fas fa-download me-2"></i>Fund</div>
                            <div style={tabStyle('internal')} onClick={() => {setActiveTab('internal'); resetMessages();}}><i className="fas fa-bolt me-2"></i>Internal</div>
                            <div style={tabStyle('domestic')} onClick={() => {setActiveTab('domestic'); resetMessages();}}><i className="fas fa-building me-2"></i>IMPS</div>
                            <div style={tabStyle('international')} onClick={() => {setActiveTab('international'); resetMessages();}}><i className="fas fa-globe-americas me-2"></i>SWIFT</div>
                        </div>

                        {error && <Alert variant="danger" className="border-0" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px' }}><i className="fas fa-exclamation-circle me-2"></i> {error}</Alert>}
                        {success && <Alert variant="success" className="border-0" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}><i className="fas fa-check-circle me-2"></i> {success}</Alert>}

                        <div className="p-3 mb-4 rounded-3" style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <Form.Group>
                                <Form.Label className="text-secondary small fw-bold">SENDING AMOUNT (INR)</Form.Label>
                                <div className="position-relative">
                                    <span className="position-absolute" style={{ left: 16, top: 12, color: 'var(--primary)', fontWeight: 700 }}>₹</span>
                                    <Form.Control type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                                        style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '12px 12px 12px 35px', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 600 }} />
                                </div>
                            </Form.Group>
                        </div>

                        {activeTab === 'fund' && (
                            <Form onSubmit={handleFund} className="animate-fade-in">
                                <Alert variant="info" style={{ background: 'rgba(25, 188, 253, 0.1)', color: '#19bcfd', border: 'none', fontSize: '13px' }}>
                                    <i className="fas fa-info-circle me-2"></i> Easily inject test funds into your account ledger directly (Razorpay Simulator).
                                </Alert>
                                <Button type="submit" disabled={loading || !amount} className="w-100 py-3 premium-gradient border-0 text-dark" style={{ fontWeight: 700, borderRadius: '10px' }}>
                                    {loading ? <Spinner size="sm" /> : "Fund Testing Account"}
                                </Button>
                            </Form>
                        )}

                        {activeTab === 'internal' && (
                            <Form onSubmit={handleInternal} className="animate-fade-in">
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-secondary small fw-bold">RECIPIENT NEXBANK ACCOUNT (12 DIGIT)</Form.Label>
                                    <Form.Control type="text" placeholder="e.g. 748293021849" value={internalAccount} onChange={e => setInternalAccount(e.target.value)} required
                                        style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px', padding: '12px' }} />
                                </Form.Group>
                                <Button type="submit" disabled={loading || !amount || !internalAccount} className="w-100 py-3 border-0 text-dark" style={{ background: '#00e97a', fontWeight: 700, borderRadius: '10px' }}>
                                    {loading ? <Spinner size="sm" /> : "Send Instantly (Free)"}
                                </Button>
                            </Form>
                        )}

                        {activeTab === 'domestic' && (
                            <Form onSubmit={handleDomestic} className="animate-fade-in">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-secondary small fw-bold">BENEFICIARY NAME</Form.Label>
                                    <Form.Control type="text" value={domName} onChange={e => setDomName(e.target.value)} required style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-secondary small fw-bold">EXTERNAL ACCOUNT NUMBER</Form.Label>
                                    <Form.Control type="text" value={domAccount} onChange={e => setDomAccount(e.target.value)} required style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-secondary small fw-bold">IFSC CODE</Form.Label>
                                    <Form.Control type="text" placeholder="e.g. HDFC0001234" value={domIfsc} onChange={e => setDomIfsc(e.target.value)} required style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                </Form.Group>
                                <Button type="submit" disabled={loading || !amount || !domAccount || !domIfsc} className="w-100 py-3 border-0 text-white" style={{ background: '#19bcfd', fontWeight: 700, borderRadius: '10px' }}>
                                    {loading ? <Spinner size="sm" /> : "Initiate IMPS (₹5 Fee)"}
                                </Button>
                            </Form>
                        )}

                        {activeTab === 'international' && (
                            <Form onSubmit={handleInternational} className="animate-fade-in">
                                <div className="d-flex gap-3 mb-3">
                                    <Form.Group className="flex-grow-1">
                                        <Form.Label className="text-secondary small fw-bold">BENEFICIARY NAME</Form.Label>
                                        <Form.Control type="text" value={intName} onChange={e => setIntName(e.target.value)} required style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                    </Form.Group>
                                    <Form.Group style={{ width: '120px' }}>
                                        <Form.Label className="text-secondary small fw-bold">CURRENCY</Form.Label>
                                        <Form.Select value={intCurrency} onChange={e => setIntCurrency(e.target.value)} style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }}>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-secondary small fw-bold">IBAN NUMBER</Form.Label>
                                    <Form.Control type="text" value={intIban} onChange={e => setIntIban(e.target.value)} required style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-secondary small fw-bold">SWIFT / BIC CODE</Form.Label>
                                    <Form.Control type="text" value={intSwift} onChange={e => setIntSwift(e.target.value)} required style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                </Form.Group>

                                {/* FX Calculator Block */}
                                <div className="p-3 mb-4 rounded-3" style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-secondary small">Exchange Rate</span>
                                        <span className="fw-bold" style={{ fontSize: '14px' }}>
                                            {fxLoading ? <Spinner size="sm" animation="grow"/> : fxQuote ? `1 ${fxQuote.targetCurrency} = ₹${fxQuote.exchangeRate}` : '--'}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-secondary small">NexBank Flat Fee</span>
                                        <span className="fw-bold text-danger" style={{ fontSize: '14px' }}>
                                            {fxQuote ? `- ₹${fxQuote.fee}` : '--'}
                                        </span>
                                    </div>
                                    <hr style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}/>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold" style={{ color: '#8b5cf6' }}>Recipient Gets</span>
                                        <span className="fw-bold" style={{ fontSize: '20px', color: '#8b5cf6' }}>
                                            {fxQuote ? `${fxQuote.targetCurrency} ${fxQuote.targetAmount}` : '--'}
                                        </span>
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading || !amount || !fxQuote || !intIban} className="w-100 py-3 border-0 text-white" style={{ background: '#8b5cf6', fontWeight: 700, borderRadius: '10px' }}>
                                    {loading ? <Spinner size="sm" /> : "Send SWIFT Wire"}
                                </Button>
                            </Form>
                        )}

                        <div className="mt-4 text-center">
                            <i className="fas fa-lock me-2 text-secondary" style={{ fontSize: '0.8rem' }}></i>
                            <small className="text-secondary" style={{ fontSize: '0.8rem' }}>Core Banking Ledger Validated</small>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Transfer;
