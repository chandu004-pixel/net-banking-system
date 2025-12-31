import api from '../utils/api';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Transfer = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDeposit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.post('/payment/create-order', { amount });

            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "NexBank Secure",
                description: "Wallet Refill",
                image: "https://img.icons8.com/fluency/96/bank.png",
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            txId: data.txId
                        });

                        setSuccess(verifyRes.data.message);
                    } catch (err) {
                        setError("Payment verification failed. Contact support if debited.");
                    }
                },
                prefill: {
                    name: localStorage.getItem('userName'),
                },
                theme: { color: "#00e97a" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to initiate payment engine");
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
                                background: 'rgba(139, 92, 246, 0.1)',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px'
                            }}>
                                <i className="fas fa-wallet" style={{ color: '#8b5cf6', fontSize: '1.4rem' }}></i>
                            </div>
                            <h2 style={{ fontWeight: 700 }}>Inward Deposit</h2>
                            <p className="text-secondary small">Top up your account balance instantly.</p>
                        </div>

                        {error && <Alert variant="danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '1rem' }}>
                            <i className="fas fa-exclamation-circle me-2"></i> {error}
                        </Alert>}
                        {success && <Alert variant="success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '1rem' }}>
                            <i className="fas fa-check-circle me-2"></i> {success}
                        </Alert>}

                        <Form onSubmit={handleDeposit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-secondary small fw-600">AMOUNT (INR)</Form.Label>
                                <div className="position-relative">
                                    <span className="position-absolute" style={{ left: 16, top: 12, color: 'var(--primary)', fontWeight: 700 }}>₹</span>
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
                                className="w-100 py-3 premium-gradient border-0 text-dark"
                                style={{ fontWeight: 700, borderRadius: '0.8rem', fontSize: '1.1rem' }}
                            >
                                {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> Initializing Gateway...</> : "Pay with Razorpay"}
                            </Button>
                        </Form>
                        <div className="mt-4 text-center">
                            <i className="fas fa-lock me-2 text-secondary" style={{ fontSize: '0.8rem' }}></i>
                            <small className="text-secondary" style={{ fontSize: '0.8rem' }}>Bank-grade 256-bit SSL Layer</small>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Transfer;

