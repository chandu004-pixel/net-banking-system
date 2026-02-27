import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Container, Table, Spinner, Button, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Viewkyc = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchKyc = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/kyc');
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error('Fetch KYC Error:', err);
      setError('Failed to load KYC records.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/kyc/${id}`, { status });
      fetchKyc();
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/kyc/${selectedId}`);
      setShowDelete(false);
      fetchKyc();
    } catch {
      alert('Failed to delete record.');
    }
  };

  const isLight = theme === 'light';

  return (
    <div style={{
      padding: '120px 20px 40px',
      minHeight: '100vh',
      background: isLight ? '#f4f7fb' : 'var(--bg-dashboard)',
      transition: 'background 0.3s ease'
    }}>
      <Container>
        <div className="animate-fade-in shadow-sm">
          <Button
            variant="link"
            onClick={() => navigate('/dashboard')}
            className="p-0 mb-4 text-decoration-none d-inline-flex align-items-center"
            style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}
          >
            <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
          </Button>

          <div className={isLight ? "light-card p-4 overflow-hidden" : "glass-card p-4 overflow-hidden"}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-gradient" style={{ fontWeight: 800 }}>KYC Repository</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review and manage submitted verification records.</div>
              </div>
              <Button
                onClick={() => navigate('/add')}
                className="premium-gradient border-0 px-4 py-2"
                style={{ borderRadius: '0.7rem', fontWeight: 700, color: isLight ? '#fff' : 'var(--bg-dark)' }}
              >
                <i className="fas fa-plus me-2"></i> New Record
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                <div className="mt-3" style={{ color: 'var(--text-muted)' }}>Synchonizing records...</div>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-folder-open fa-3x mb-3" style={{ color: 'var(--text-muted)', opacity: 0.5 }}></i>
                <h5 style={{ color: 'var(--text-primary)' }}>No KYC Records Found</h5>
                <p style={{ color: 'var(--text-muted)' }}>Create a new record to get started with verification.</p>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate('/add')}
                  style={{ borderRadius: '8px', fontWeight: 600 }}
                >
                  + Create Record
                </Button>
              </div>
            ) : (
              <div className="table-responsive rounded-4">
                <Table
                  hover
                  responsive
                  className="align-middle"
                  style={{
                    background: isLight ? '#ffffff' : 'transparent',
                    color: 'var(--text-primary)',
                    borderCollapse: 'separate',
                    borderSpacing: '0 8px',
                    marginBottom: 0
                  }}
                >
                  <thead style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)' }}>
                    <tr>
                      <th className="py-3 px-4 small fw-700" style={{ border: 'none', color: 'var(--text-muted)' }}>APPLICANT</th>
                      <th className="py-3 small fw-700" style={{ border: 'none', color: 'var(--text-muted)' }}>ID TYPE & NUMBER</th>
                      <th className="py-3 small fw-700" style={{ border: 'none', color: 'var(--text-muted)' }}>RESIDENCE</th>
                      <th className="py-3 small fw-700" style={{ border: 'none', color: 'var(--text-muted)' }}>STATUS</th>
                      <th className="py-3 small fw-700 text-center" style={{ border: 'none', color: 'var(--text-muted)' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec) => (
                      <tr
                        key={rec._id}
                        onClick={() => navigate(`/view`)} // In real app, navigate to details
                        style={{
                          cursor: 'pointer',
                          background: isLight ? '#fff' : 'var(--surface-primary)',
                          border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)',
                          transition: 'transform 0.2s ease, background 0.2s ease'
                        }}
                        className="record-row"
                      >
                        <td className="py-3 px-4" style={{ border: 'none', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                          <div className="d-flex align-items-center">
                            {rec.photo || rec.idFile ? (
                              <img
                                src={`http://localhost:6500/uploads/${rec.photo || rec.idFile}`}
                                alt=""
                                width={44}
                                height={44}
                                style={{ objectFit: 'cover', borderRadius: '10px', border: '2px solid var(--primary)', marginRight: 15 }}
                              />
                            ) : (
                              <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: '10px',
                                background: 'var(--surface-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 15,
                                border: '1px solid var(--card-border)'
                              }}>
                                <i className="fas fa-user" style={{ color: 'var(--text-muted)' }}></i>
                              </div>
                            )}
                            <div>
                              <div className="fw-700" style={{ color: 'var(--text-primary)' }}>{rec.fullname}</div>
                              <div className="smaller" style={{ color: 'var(--text-muted)' }}>{new Date(rec.dob).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ border: 'none' }}>
                          <div className="fw-600" style={{ color: 'var(--text-primary)' }}>{rec.documenttype}</div>
                          <div className="smaller" style={{ color: 'var(--text-muted)' }}>{rec.documentnumber}</div>
                        </td>
                        <td className="small" style={{ border: 'none', maxWidth: 200, color: 'var(--text-muted)' }}>
                          {rec.address}
                        </td>
                        <td style={{ border: 'none' }}>
                          <Badge className={`status-badge status-${rec.status.toLowerCase()}`}>
                            {rec.status}
                          </Badge>
                          {rec.status === 'Pending' && (
                            <div className="mt-2 d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                style={{ fontSize: '10px', padding: '2px 8px', background: '#10b981', border: 'none' }}
                                onClick={() => updateStatus(rec._id, 'Verified')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                style={{ fontSize: '10px', padding: '2px 8px', background: '#ef4444', border: 'none' }}
                                onClick={() => updateStatus(rec._id, 'Rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                        <td className="text-center" style={{ border: 'none', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                          <div className="d-flex justify-content-center" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="link"
                              className="p-0 action-btn view-btn me-3"
                              onClick={() => alert(`Viewing details for ${rec.fullname}`)}
                            >
                              <i className="far fa-eye"></i>
                            </Button>
                            <Button
                              variant="link"
                              className="p-0 action-btn edit-btn me-3"
                              onClick={() => navigate('/add', { state: { id: rec._id } })}
                            >
                              <i className="far fa-edit"></i>
                            </Button>
                            <Button
                              variant="link"
                              className="p-0 action-btn delete-btn"
                              onClick={() => {
                                setSelectedId(rec._id);
                                setShowDelete(true);
                              }}
                            >
                              <i className="far fa-trash-alt"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered contentClassName={isLight ? "" : "bg-[#111821] border-white/10"}>
        <Modal.Header closeButton style={{ borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid var(--card-border)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Delete Record</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'var(--text-muted)' }}>
          Are you sure you want to permanently delete this verification record? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer style={{ borderTop: isLight ? '1px solid #e2e8f0' : '1px solid var(--card-border)' }}>
          <Button variant="secondary" onClick={() => setShowDelete(false)} style={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            style={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Delete Permanently
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
                .light-card {
                    background: #ffffff;
                    border-radius: 18px;
                    border: 1px solid #e9eef5;
                    box-shadow: 0 10px 30px rgba(16, 24, 40, 0.05);
                }
                .action-btn { transition: all 0.2s; opacity: 0.6; color: var(--text-muted); font-size: 1.1rem; }
                .action-btn:hover { opacity: 1; transform: scale(1.15); }
                .view-btn:hover { color: #3b82f6 !important; }
                .edit-btn:hover { color: var(--primary) !important; }
                .delete-btn:hover { color: #ff4d4d !important; }
                
                .status-badge {
                    font-weight: 700;
                    padding: 6px 12px;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border: none;
                }
                .status-verified { background: #e6f9f0 !important; color: #059669 !important; }
                .status-rejected { background: #fee2e2 !important; color: #dc2626 !important; }
                .status-pending { background: #fff7e6 !important; color: #d97706 !important; }
                
                .record-row:hover {
                    background: ${isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)'} !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .smaller { font-size: 0.75rem; }
                .fw-700 { font-weight: 700; }
                .fw-800 { font-weight: 800; }
                
                /* Dark Modal Fixes */
                .bg-\\[\\#111821\\] { background-color: #111821 !important; }
                .border-white\\/10 { border-color: rgba(255,255,255,0.1) !important; }
            `}</style>
    </div>
  );
};

export default Viewkyc;

