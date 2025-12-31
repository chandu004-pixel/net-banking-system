import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userName', res.data.name);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
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
      {/* Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, background: 'rgba(0, 233, 122, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'rgba(25, 188, 253, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

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
              <i className="fas fa-landmark" style={{ color: '#07090c', fontSize: '1.8rem' }}></i>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-1px' }}>NexBank</h2>
            <p className="text-secondary">Secure Digital Access</p>
          </div>

          {error && <Alert variant="danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '1rem' }}>
            <i className="fas fa-exclamation-circle me-2"></i> {error}
          </Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-4">
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

            <Form.Group className="mb-5">
              <Form.Label className="text-secondary small fw-600">PASSWORD</Form.Label>
              <div className="position-relative">
                <i className="fas fa-lock position-absolute" style={{ top: 15, left: 16, color: 'var(--text-secondary)' }}></i>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
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
              {loading ? <i className="fas fa-spinner fa-spin"></i> : "Sign In to NexBank"}
            </Button>
          </Form>

          <div className="mt-5 text-center text-secondary">
            Don't have an account? <Link to="/register" className="text-primary fw-600 text-decoration-none" style={{ color: 'var(--primary)' }}>Create one free</Link>
          </div>
        </div>

        <div className="text-center mt-4 text-secondary opacity-50" style={{ fontSize: '0.8rem' }}>
          By signing in, you agree to our Terms of Service.
        </div>
      </Container>
    </div>
  );
};

export default Login;

