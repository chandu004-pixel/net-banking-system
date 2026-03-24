import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const UserManagement = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showEdit, setShowEdit] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/all');
            setUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load users", err);
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setShowEdit(true);
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/users/manage/${editingUser._id}`, {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                isBlocked: editingUser.isBlocked
            });
            setShowEdit(false);
            fetchUsers();
        } catch (err) {
            console.error("Failed to update user", err);
            alert("Failed to update user details.");
        }
    };

    const toggleBlockStatus = async (user) => {
        try {
            await api.put(`/users/manage/${user._id}`, { isBlocked: !user.isBlocked });
            fetchUsers();
        } catch (err) {
            console.error("Failed to toggle block", err);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            padding: '120px 20px 40px',
            minHeight: '100vh',
            background: isLight ? '#f4f7fb' : 'var(--bg-dashboard)',
            color: 'var(--text-primary)',
            transition: 'background 0.3s ease'
        }}>
            <Container>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 animate-fade-in">
                    <div className="mb-3 mb-md-0">
                        <h2 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>User Management</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Admin control over all registered platform users.</p>
                    </div>
                    <Button 
                        variant="link" 
                        onClick={() => navigate('/admin')}
                        className="d-flex align-items-center px-4 py-2 text-decoration-none shadow-sm transition hover:scale-105"
                        style={{ background: 'var(--surface-tertiary)', borderRadius: '10px', fontWeight: 600, color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                    >
                        <i className="fas fa-arrow-left me-2"></i> Back to Command Center
                    </Button>
                </div>

                <div className="p-4 rounded-4 shadow-sm mb-4" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)' }}>
                    <div className="d-flex justify-content-between mb-4">
                        <Form.Control 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ maxWidth: '300px', background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}
                        />
                        <Badge bg="primary" className="d-flex align-items-center px-3" style={{ fontSize: '13px' }}>
                            Total Users: {users.length}
                        </Badge>
                    </div>

                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover variant={isLight ? 'light' : 'dark'} className="align-middle border-0" style={{ '--bs-table-bg': 'transparent' }}>
                                <thead style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                                    <tr>
                                        <th className="text-secondary" style={{ fontWeight: 600 }}>USER</th>
                                        <th className="text-secondary" style={{ fontWeight: 600 }}>ROLE</th>
                                        <th className="text-secondary" style={{ fontWeight: 600 }}>BALANCE</th>
                                        <th className="text-secondary" style={{ fontWeight: 600 }}>JOINED</th>
                                        <th className="text-secondary" style={{ fontWeight: 600 }}>STATUS</th>
                                        <th className="text-secondary text-end" style={{ fontWeight: 600 }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <td>
                                                <div className="fw-bold">{u.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}><i className="fas fa-envelope me-1"></i> {u.email}</div>
                                                <div style={{ fontSize: '11px', color: '#19bcfd', fontWeight: 600, marginTop: '2px', letterSpacing: '1px' }}>ACC: {u.accountNumber || 'PENDING'}</div>
                                            </td>
                                            <td>
                                                <Badge bg={u.role === 'admin' ? 'danger' : 'info'}>{u.role.toUpperCase()}</Badge>
                                            </td>
                                            <td className="fw-bold" style={{ color: '#10b981' }}>
                                                ₹{u.balance.toLocaleString('en-IN')}
                                            </td>
                                            <td style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                {u.isBlocked ? (
                                                    <Badge bg="danger"><i className="fas fa-lock me-1"></i> BLOCK</Badge>
                                                ) : (
                                                    <Badge bg="success"><i className="fas fa-check me-1"></i> ACTIVE</Badge>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <Button variant="outline-primary" size="sm" className="me-2" style={{ borderRadius: '8px' }} onClick={() => handleEditClick(u)}>
                                                    <i className="fas fa-edit"></i> Edit
                                                </Button>
                                                <Button variant={u.isBlocked ? 'success' : 'outline-danger'} size="sm" style={{ borderRadius: '8px' }} onClick={() => toggleBlockStatus(u)}>
                                                    {u.isBlocked ? 'Unblock' : 'Block'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">No users found matching "{searchTerm}"</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </Container>

            {/* Edit User Modal */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered contentClassName={isLight ? '' : 'bg-dark text-light'} backdrop="static">
                <Modal.Header closeButton className={!isLight ? 'border-secondary' : ''}>
                    <Modal.Title style={{ fontWeight: 800 }}>Edit User Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingUser && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>FULL NAME</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editingUser.name} 
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>EMAIL ADDRESS</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    value={editingUser.email} 
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>SYSTEM ROLE</Form.Label>
                                <Form.Select 
                                    value={editingUser.role} 
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                    style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }} 
                                >
                                    <option value="user">USER</option>
                                    <option value="admin">ADMINISTRATOR</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="d-flex justify-content-between align-items-center p-3 rounded-3 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-secondary)' }}>
                                <div>
                                    <div className="fw-bold text-danger">Account Lock</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prevent user from accessing the system.</div>
                                </div>
                                <Form.Check 
                                    type="switch" 
                                    id="block-switch"
                                    checked={editingUser.isBlocked}
                                    onChange={(e) => setEditingUser({...editingUser, isBlocked: e.target.checked})}
                                    style={{ transform: 'scale(1.3)' }}
                                />
                            </div>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className={!isLight ? 'border-secondary' : ''}>
                    <Button variant="secondary" onClick={() => setShowEdit(false)} style={{ borderRadius: '10px' }}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveEdit} style={{ borderRadius: '10px', fontWeight: 600 }}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;
