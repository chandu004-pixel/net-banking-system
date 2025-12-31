import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, background: 'rgba(0, 233, 122, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, background: 'rgba(25, 188, 253, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

      <Container className="animate-fade-in" style={{ maxWidth: 450, position: 'relative', zIndex: 1 }}>
        <div className="glass-card p-5 shadow-2xl">
          <div className="text-center mb-5">
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #00e97a 0%, #19bcfd 100%)',
              borderRadius: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 25px rgba(0, 233, 122, 0.4)'
            }}>
              <i className="fas fa-user-plus" style={{ color: '#07090c', fontSize: '1.8rem' }}></i>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-1px' }}>Join NexBank</h2>
            <p className="text-secondary">Start your digital journey today</p>
          </div>

          {error && <Alert variant="danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '1rem' }}>
            <i className="fas fa-exclamation-circle me-2"></i> {error}
          </Alert>}
          {success && <Alert variant="success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '1rem' }}>
            <i className="fas fa-check-circle me-2"></i> {success}
          </Alert>}

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary small fw-600">FULL NAME</Form.Label>
              <div className="position-relative">
                <i className="far fa-user position-absolute" style={{ top: 15, left: 16, color: 'var(--text-secondary)' }}></i>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent text-white border-secondary border-opacity-25"
                  style={{ padding: '12px 12px 12px 45px', borderRadius: '0.8rem' }}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-secondary small fw-600">EMAIL ADDRESS</Form.Label>
              <div className="position-relative">
                <i className="far fa-envelope position-absolute" style={{ top: 15, left: 16, color: 'var(--text-secondary)' }}></i>
                <Form.Control
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white border-secondary border-opacity-25"
                  style={{ padding: '12px 12px 12px 45px', borderRadius: '0.8rem' }}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-secondary small fw-600">PASSWORD</Form.Label>
              <div className="position-relative">
                <i className="fas fa-lock position-absolute" style={{ top: 15, left: 16, color: 'var(--text-secondary)' }}></i>
                <Form.Control
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-white border-secondary border-opacity-25"
                  style={{ padding: '12px 12px 12px 45px', borderRadius: '0.8rem' }}
                  required
                />
              </div>
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="w-100 py-3 premium-gradient border-0 text-dark"
              style={{ fontWeight: 700, borderRadius: '0.8rem', fontSize: '1.1rem' }}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create Secure Account"}
            </Button>
          </Form>

          <div className="mt-4 text-center text-secondary">
            Already dynamic? <Link to="/login" className="text-primary fw-600 text-decoration-none" style={{ color: 'var(--primary)' }}>Sign In</Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;

