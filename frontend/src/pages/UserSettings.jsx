import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const isLoggedIn = !!userId;

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Profile Data
    const [profile, setProfile] = useState({ name: '', email: '', accountNumber: '', ifscCode: '' });
    
    // Password Form
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [isLoggedIn, navigate, userId]);

    const fetchUserData = async () => {
        try {
            const res = await api.get(`/users/${userId}`);
            setProfile({
                name: res.data.name || '',
                email: res.data.email || '',
                accountNumber: res.data.accountNumber || '',
                ifscCode: res.data.ifscCode || ''
            });
        } catch (err) {
            setMsg({ type: 'danger', text: 'Failed to load profile details' });
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg({ type: '', text: '' });
        try {
            const res = await api.put('/users/profile', { name: profile.name, email: profile.email });
            setMsg({ type: 'success', text: res.data.message });
        } catch (err) {
            setMsg({ type: 'danger', text: err.response?.data?.error || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMsg({ type: 'danger', text: "New passwords do not match!" });
        }
        setLoading(true);
        try {
            const res = await api.put('/users/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMsg({ type: 'success', text: res.data.message });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMsg({ type: 'danger', text: err.response?.data?.error || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const tabStyle = (tabName) => ({
        padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
        transition: 'all 0.3s ease', textAlign: 'center', whiteSpace: 'nowrap',
        background: activeTab === tabName ? 'var(--primary)' : 'transparent',
        color: activeTab === tabName ? '#000' : 'var(--text-secondary)',
        border: activeTab === tabName ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
    });

    return (
        <div style={{ padding: '120px 20px 40px', minHeight: '100vh', background: 'var(--bg-dashboard)' }}>
            <Container style={{ maxWidth: 800 }}>
                <div className="animate-fade-in">
                    <div className="d-flex align-items-center mb-5">
                        <Button variant="link" onClick={() => navigate('/dashboard')} className="text-secondary p-0 text-decoration-none d-flex align-items-center" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                        </Button>
                        <h2 className="ms-auto mb-0" style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                            <i className="fas fa-cog me-2" style={{ color: 'var(--primary)' }}></i>User Settings
                        </h2>
                    </div>

                    <Row>
                        <Col md={4} className="mb-4">
                            <div className="glass-card p-4 h-100 d-flex flex-column gap-3">
                                <div style={tabStyle('profile')} onClick={() => { setActiveTab('profile'); setMsg({type:'',text:''}); }}>
                                    <i className="fas fa-user me-2"></i> Profile
                                </div>
                                <div style={tabStyle('security')} onClick={() => { setActiveTab('security'); setMsg({type:'',text:''}); }}>
                                    <i className="fas fa-shield-alt me-2"></i> Security
                                </div>
                            </div>
                        </Col>

                        <Col md={8}>
                            <div className="glass-card p-4 p-md-5">
                                {msg.text && (
                                    <Alert variant={msg.type} className="border-0 mb-4 animate-fade-in" style={{ borderRadius: '12px', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? '#10b981' : '#ef4444' }}>
                                        <i className={`fas fa-${msg.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i> {msg.text}
                                    </Alert>
                                )}

                                {activeTab === 'profile' && (
                                    <div className="animate-fade-in">
                                        <h4 className="fw-bold mb-1">Personal Information</h4>
                                        <p className="text-secondary small mb-4">Manage your identity and contact vectors.</p>
                                        
                                        {profile.accountNumber && (
                                            <div className="mb-4 p-3 rounded-3 d-flex justify-content-between align-items-center" style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                                <div>
                                                    <div className="text-secondary small fw-bold">NEXBANK ACCOUNT / LEDGER ID</div>
                                                    <div style={{ color: '#8b5cf6', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '2px' }}>{profile.accountNumber}</div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-secondary small fw-bold">IFSC / ROUTING</div>
                                                    <div className="text-white fw-bold">{profile.ifscCode}</div>
                                                </div>
                                            </div>
                                        )}

                                        <Form onSubmit={handleProfileUpdate}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-secondary small fw-bold">FULL NAME</Form.Label>
                                                <Form.Control type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-secondary small fw-bold">EMAIL ADDRESS</Form.Label>
                                                <Form.Control type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                            </Form.Group>
                                            <Button type="submit" disabled={loading} className="py-2 px-4 border-0 text-dark" style={{ background: 'var(--primary)', fontWeight: 700, borderRadius: '8px' }}>
                                                {loading ? <Spinner size="sm"/> : "Save Changes"}
                                            </Button>
                                        </Form>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="animate-fade-in">
                                        <h4 className="fw-bold mb-1">Account Security</h4>
                                        <p className="text-secondary small mb-4">Ensure your password is at least 8 characters long.</p>
                                        <Form onSubmit={handlePasswordChange}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-secondary small fw-bold">CURRENT PASSWORD</Form.Label>
                                                <Form.Control type="password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-secondary small fw-bold">NEW PASSWORD</Form.Label>
                                                <Form.Control type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-secondary small fw-bold">CONFIRM NEW PASSWORD</Form.Label>
                                                <Form.Control type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '10px' }} />
                                            </Form.Group>
                                            <Button type="submit" disabled={loading} className="py-2 px-4 border-0 text-white" style={{ background: '#ef4444', fontWeight: 700, borderRadius: '8px' }}>
                                                {loading ? <Spinner size="sm"/> : "Update Password"}
                                            </Button>
                                        </Form>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default UserSettings;
