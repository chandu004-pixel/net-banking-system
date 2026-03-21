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
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>AML Flagged Reviews</h2>
                        <p className="text-muted small mb-0">High-risk transactions flagged for manual intervention</p>
                    </div>
                    <Button variant="outline-primary" onClick={() => navigate('/admin')} className="rounded-pill px-4">
                        <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <div className="saas-card overflow-hidden" style={{ background: 'var(--surface-primary)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <Table responsive hover variant="dark" className="mb-0" style={{ '--bs-table-bg': 'transparent' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <th className="py-4 ps-4 text-muted small uppercase">Request ID</th>
                                    <th className="py-4 text-muted small uppercase">Customer</th>
                                    <th className="py-4 text-muted small uppercase">Amount</th>
                                    <th className="py-4 text-muted small uppercase">Flag Reason</th>
                                    <th className="py-4 pe-4 text-end text-muted small uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {frozenTxs.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-5 text-muted">No transactions flagged for review.</td></tr>
                                ) : (
                                    frozenTxs.map(tx => (
                                        <tr key={tx._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <td className="py-4 ps-4 font-mono small">{tx._id.slice(-8)}</td>
                                            <td className="py-4">
                                                <div className="fw-bold text-primary-accent">{tx.user?.name}</div>
                                                <div className="text-muted x-small">{tx.user?.email}</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="fw-bold">₹{tx.amount.toLocaleString()}</div>
                                                <Badge bg="danger" className="x-small bg-opacity-10 text-danger border border-danger border-opacity-20 uppercase">{tx.type}</Badge>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-warning small italic"><i className="fas fa-exclamation-triangle me-1"></i> {tx.fraudReason}</div>
                                            </td>
                                            <td className="py-4 pe-4 text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Button 
                                                        variant="success" 
                                                        size="sm" 
                                                        className="px-3 rounded-pill bg-opacity-20 text-success border-success"
                                                        onClick={() => handleResolve(tx._id, 'approve')}
                                                        disabled={resolving === tx._id}
                                                    >
                                                        {resolving === tx._id ? <Spinner size="sm" /> : 'Approve'}
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        className="px-3 rounded-pill"
                                                        onClick={() => handleResolve(tx._id, 'reject')}
                                                        disabled={resolving === tx._id}
                                                    >
                                                        Reject
                                                    </Button>
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
                .text-primary-accent { color: #00e97a; }
                .x-small { font-size: 10px; }
                .uppercase { text-transform: uppercase; letter-spacing: 0.5px; }
            `}</style>
        </div>
    );
};

export default TransactionReview;
