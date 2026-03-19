import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Container, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TransactionReview = () => {
    const [frozenTxs, setFrozenTxs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(null);
    const navigate = useNavigate();

    const fetchFrozenTxs = async () => {
        try {
            const res = await api.get('/payment/frozen');
            setFrozenTxs(res.data.data);
        } catch (err) {
            console.error('Failed to fetch frozen transactions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFrozenTxs();
    }, []);

    const handleResolve = async (txId, action) => {
        setResolving(txId);
        try {
            const res = await api.post('/payment/resolve-frozen', { txId, action });
            alert(res.data.message);
            fetchFrozenTxs();
        } catch (err) {
            alert(err.response?.data?.error || 'Resolution failed');
        } finally {
            setResolving(null);
        }
    };

    return (
        <div className="min-h-screen py-32" style={{ background: 'var(--bg-dashboard)' }}>
            <Container>
                {/* Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 animate-fade-in">
                    <div>
                        <div className="d-flex align-items-center mb-2">
                            <Badge bg="danger" className="me-2 px-2 py-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>SECURITY PROTOCOL</Badge>
                            <span className="status-blink me-2"></span>
                            <span style={{ fontSize: '11px', color: '#00e97a', fontWeight: 700, letterSpacing: '1px' }}>LIVE RADAR ACTIVE</span>
                        </div>
                        <h2 className="display-6 fw-bold mb-0" style={{ color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                            Transaction <span style={{ color: '#ef4444' }}>Review</span>
                        </h2>
                        <p className="text-muted mt-2" style={{ fontSize: '14px', maxWidth: '400px' }}>
                            Inspect flagged movements and manually override algorithmic blocks for verified customers.
                        </p>
                    </div>
                    <div>
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => navigate('/admin')} 
                            className="rounded-pill px-4 border-1 transition-all hover:translate-x-[-4px]"
                            style={{ fontSize: '13px', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
                        >
                            <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="text-muted mt-3 small tracking-widest uppercase">Fetching encrypted logs...</p>
                    </div>
                ) : (
                    <div className="saas-card overflow-hidden animate-slide-up" style={{ 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <Table responsive hover variant="dark" className="mb-0" style={{ '--bs-table-bg': 'transparent' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <th className="py-4 ps-4 text-muted small uppercase tracking-wider">Origin ID</th>
                                    <th className="py-4 text-muted small uppercase tracking-wider">Account Holder</th>
                                    <th className="py-4 text-muted small uppercase tracking-wider">Amount / Flow</th>
                                    <th className="py-4 text-muted small uppercase tracking-wider">Risk Assessment</th>
                                    <th className="py-4 pe-4 text-end text-muted small uppercase tracking-wider">Resolution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {frozenTxs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="py-5">
                                                <div className="mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 233, 122, 0.05)', border: '1px solid rgba(0, 233, 122, 0.1)' }}>
                                                    <i className="fas fa-shield-check text-[#00e97a]" style={{ fontSize: '32px' }}></i>
                                                </div>
                                                <h5 className="fw-bold mb-1">Clear Horizon</h5>
                                                <p className="text-muted small">No transactions currently flagged for intervention.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    frozenTxs.map(tx => (
                                        <tr key={tx._id} className="transaction-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.3s' }}>
                                            <td className="py-4 ps-4 font-mono small text-secondary">#...{tx._id.slice(-6)}</td>
                                            <td className="py-4">
                                                <div className="fw-bold fs-6">{tx.user?.name}</div>
                                                <div className="text-muted x-small tracking-wide">{tx.user?.email}</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="fw-bold fs-5">₹{tx.amount.toLocaleString()}</div>
                                                <Badge bg={tx.type === 'withdraw' ? 'danger' : 'success'} className="x-small bg-opacity-10 py-1 px-2 border border-opacity-20 uppercase tracking-widest" 
                                                       style={{ color: tx.type === 'withdraw' ? '#ef4444' : '#00e97a', borderColor: tx.type === 'withdraw' ? '#ef4444' : '#00e97a' }}>
                                                    {tx.type}
                                                </Badge>
                                            </td>
                                            <td className="py-4">
                                                <div className="p-2 rounded-3 d-inline-flex align-items-center" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                                    <i className="fas fa-biohazard text-danger me-2 animate-pulse"></i>
                                                    <span className="text-danger small fw-600">{tx.fraudReason}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 pe-4 text-end">
                                                <div className="d-flex gap-3 justify-content-end">
                                                    <button 
                                                        className="btn-action approve transition-all"
                                                        onClick={() => handleResolve(tx._id, 'approve')}
                                                        disabled={resolving === tx._id}
                                                    >
                                                        {resolving === tx._id ? <Spinner size="sm" /> : <><i className="fas fa-check me-2"></i> Approve</>}
                                                    </button>
                                                    <button 
                                                        className="btn-action reject transition-all"
                                                        onClick={() => handleResolve(tx._id, 'reject')}
                                                        disabled={resolving === tx._id}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>
            <style>{`
                .transaction-row:hover { background: rgba(255, 255, 255, 0.02); }
                .text-primary-accent { color: #00e97a; }
                .x-small { font-size: 10px; }
                .uppercase { text-transform: uppercase; letter-spacing: 1.5px; }
                .fw-600 { font-weight: 600; }
                
                h2, .display-6, .font-heading {
                    font-family: var(--font-heading) !important;
                    letter-spacing: -1.5px;
                }

                th {
                    font-family: var(--font-heading) !important;
                    font-weight: 700 !important;
                    letter-spacing: 2px !important;
                    color: var(--text-muted) !important;
                }

                td, p, span, div, .btn-action {
                    font-family: var(--font-main) !important;
                }

                .btn-action {
                    padding: 10px 24px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    border: none;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .btn-action.approve {
                    background: #00e97a;
                    color: #000;
                    box-shadow: 0 4px 15px rgba(0, 233, 122, 0.2);
                }
                .btn-action.approve:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 233, 122, 0.4); }

                .btn-action.reject {
                    background: transparent;
                    color: #94a3b8;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .btn-action.reject:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: #ef4444; }

                .status-blink {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #00e97a;
                    box-shadow: 0 0 8px #00e97a;
                    animation: blinker 2s linear infinite;
                }
                @keyframes blinker { 50% { opacity: 0.3; } }

                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
                @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default TransactionReview;
