import api from '../utils/api';
import { Container, Badge, Spinner } from 'react-bootstrap';

const TransactionHistory = () => {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await api.get(`/users/${userId}/transactions`);
        setTxs(res.data);

      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: '120px 20px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Container style={{ maxWidth: 700 }}>
        <div className="animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="text-gradient mb-1" style={{ fontWeight: 800 }}>Audit Trail</h1>
              <div className="text-secondary small">Real-time history of your ledger movements.</div>
            </div>
            <i className="fas fa-list-ul text-secondary" style={{ fontSize: '1.5rem opacity: 0.3' }}></i>
          </div>

          <div className="glass-card p-4">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: 'var(--primary)' }} />
              </div>
            ) : txs.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <i className="fas fa-receipt d-block mb-3" style={{ fontSize: '3rem', opacity: 0.1 }}></i>
                No transaction records available.
              </div>
            ) : (
              txs.map((tx) => (
                <div
                  key={tx._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '1.2rem',
                    padding: '20px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: tx.type === 'deposit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16
                    }}>
                      <i className={`fas fa-arrow-${tx.type === 'deposit' ? 'down' : 'up'}`}
                        style={{ color: tx.type === 'deposit' ? '#10b981' : '#ef4444' }}></i>
                    </div>
                    <div>
                      <div className="fw-600" style={{ textTransform: 'capitalize' }}>
                        {tx.type === 'deposit' ? 'Inward Remittance' : 'Outward Transfer'}
                      </div>
                      <div className="text-secondary smaller" style={{ fontSize: '0.8rem' }}>
                        {new Date(tx.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div style={{
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      color: tx.type === 'deposit' ? '#0afc88' : '#ff4e4e'
                    }}>
                      {tx.type === 'deposit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                    </div>
                    {tx.razorpayOrderId && (
                      <div className="smaller text-secondary d-flex align-items-center justify-content-end" style={{ fontSize: '0.7rem' }}>
                        <i className="fas fa-fingerprint me-1" style={{ fontSize: '0.6rem' }}></i>
                        {tx.razorpayOrderId.slice(-8).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TransactionHistory;

