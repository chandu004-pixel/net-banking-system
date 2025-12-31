import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Container, Table, Alert, Spinner, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Viewkyc = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchKyc = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:6500/api/kyc', {
        headers: { 'Authorization': `Bearer ${token} ` }
      });
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch {
      setError('Failed to load KYC records. Please try again later.');
      setRecords([]);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record permanently?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:6500/api/kyc/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchKyc();
    } catch {
      alert('Failed to delete record.');
    }
  };

  return (
    <div style={{ padding: '120px 20px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Container>
        <div className="animate-fade-in shadow-lg">
          <div className="glass-card p-4 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-gradient" style={{ fontWeight: 700 }}>KYC Repository</h2>
                <div className="text-secondary small">Review and manage submitted verification records.</div>
              </div>
              <Button onClick={() => navigate('/add')} className="premium-gradient border-0 px-4 py-2" style={{ borderRadius: '0.7rem', fontWeight: 600, color: '#07090c' }}>
                <i className="fas fa-plus me-2"></i> New Record
              </Button>
            </div>

            {error && <Alert variant="danger" className="bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger" style={{ borderRadius: '1rem' }}>
              <i className="fas fa-exclamation-triangle me-2"></i> {error}
            </Alert>}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                <div className="mt-3 text-secondary">Loading records...</div>
              </div>
            ) : (
              <div className="table-responsive rounded-4">
                <Table hover borderless style={{ color: 'white', verticalAlign: 'middle', marginBottom: 0 }}>
                  <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <tr>
                      <th className="py-3 px-4 text-secondary small fw-600">APPLICANT</th>
                      <th className="py-3 text-secondary small fw-600">ID TYPE & NUMBER</th>
                      <th className="py-3 text-secondary small fw-600">RESIDENCE</th>
                      <th className="py-3 text-secondary small fw-600">STATUS</th>
                      <th className="py-3 text-secondary small fw-600 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-secondary">
                          <i className="far fa-folder-open d-block mb-3" style={{ fontSize: '2.5rem' }}></i>
                          No records found in the database.
                        </td>
                      </tr>
                    ) : (
                      records.map((rec) => (
                        <tr key={rec._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                          <td className="py-4 px-4">
                            <div className="d-flex align-items-center">
                              {rec.photo ? (
                                <img
                                  src={`http://localhost:6500/uploads/${rec.photo}`}
                                  alt=""
                                  width={44}
                                  height={44}
                                  style={{ objectFit: 'cover', borderRadius: '0.8rem', border: '2px solid rgba(0, 233, 122, 0.3)', marginRight: 15 }}
                                />
                              ) : (
                                <div style={{ width: 44, height: 44, borderRadius: '0.8rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
                                  <i className="fas fa-user text-secondary"></i>
                                </div>
                              )}
                              <div>
                                <div className="fw-600">{rec.fullname}</div>
                                <div className="text-secondary smaller">{new Date(rec.dob).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-500">{rec.documenttype}</div>
                            <div className="text-secondary smaller">{rec.documentnumber}</div>
                          </td>
                          <td className="text-secondary small" style={{ maxWidth: 200 }}>{rec.address}</td>
                          <td>
                            <Badge className={`px-3 py-2 rounded-pill fw-600`} style={{
                              background: rec.status === 'Verified' ? 'rgba(16, 185, 129, 0.1)' : rec.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: rec.status === 'Verified' ? '#10b981' : rec.status === 'Rejected' ? '#ef4444' : '#f59e0b',
                              border: `1px solid ${rec.status === 'Verified' ? 'rgba(16, 185, 129, 0.2)' : rec.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                            }}>
                              <i className={`fas fa-${rec.status === 'Verified' ? 'check' : rec.status === 'Rejected' ? 'times' : 'clock'} me-1`}></i>
                              {rec.status}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Button variant="link" className="text-secondary me-2 p-0 action-btn" onClick={() => alert('Editing not enabled in demo')}>
                              <i className="far fa-edit"></i>
                            </Button>
                            <Button variant="link" className="text-danger p-0 action-btn" onClick={() => handleDelete(rec._id)}>
                              <i className="far fa-trash-alt"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </Container>
      <style>{`
        .action-btn { transition: all 0.2s; opacity: 0.6; }
        .action-btn:hover { opacity: 1; transform: scale(1.15); }
        .smaller { font-size: 0.75rem; }
        .fw-600 { font-weight: 600; }
        tr:hover { background: rgba(255,255,255,0.02); }
      `}</style>
    </div>
  );
};

export default Viewkyc;

